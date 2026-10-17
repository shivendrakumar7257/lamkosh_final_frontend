import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "sonner";
import { getGuestId, setGuestId } from "@/lib/guest";

export interface ApiValidationError {
  field?: string;
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ApiValidationError[];
  guestId?: string;
}

export interface CustomAxiosError extends AxiosError<ApiResponse> {
  validationErrors?: Record<string, string>;
}

// Configurable base URL: Defaults to production backend API, never localhost
const rawEnvBase =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.NEXT_PUBLIC_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  import.meta.env.NEXT_PUBLIC_API_URL;

export const BASE_URL =
  rawEnvBase && !rawEnvBase.includes("localhost") && !rawEnvBase.includes("127.0.0.1")
    ? rawEnvBase
    : "https://api.lamokshfabric.com/api/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // credentials: 'include' for cookies & sessions
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Access token getter & setter helpers to avoid circular dependencies with Zustand store
let getAccessTokenFn: () => string | null = () => null;
let setAccessTokenFn: (token: string | null) => void = () => {};
let logoutFn: () => void = () => {};

export function bindAuthMethods(
  getAccessToken: () => string | null,
  setAccessToken: (token: string | null) => void,
  logout: () => void,
) {
  getAccessTokenFn = getAccessToken;
  setAccessTokenFn = setAccessToken;
  logoutFn = logout;
}

/**
 * Request Interceptor
 * 1. Ensure baseURL and URL never point to localhost
 * 2. Read token from auth store/localStorage: if present, append Authorization: Bearer ${token}.
 * 3. Read guestId from localStorage.getItem('guest_id'): if present, append X-Guest-ID: ${guestId}.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Ensure baseURL never points to localhost or 127.0.0.1
    if (config.baseURL && (config.baseURL.includes("localhost") || config.baseURL.includes("127.0.0.1"))) {
      config.baseURL = BASE_URL;
    }
    // If request URL has localhost, strip it and use baseURL
    if (config.url && (config.url.includes("localhost") || config.url.includes("127.0.0.1"))) {
      config.url = config.url
        .replace(/^https?:\/\/localhost(:\d+)?(\/api\/v1)?/, "")
        .replace(/^https?:\/\/127\.0\.0\.1(:\d+)?(\/api\/v1)?/, "");
      if (!config.url.startsWith("/")) {
        config.url = `/${config.url}`;
      }
    }

    let token = getAccessTokenFn();
    if (!token && typeof window !== "undefined") {
      token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      if (!token) {
        try {
          const raw =
            sessionStorage.getItem("lamoksh_admin_session") ||
            localStorage.getItem("lamoksh_admin_session") ||
            sessionStorage.getItem("manmayi_admin_session") ||
            localStorage.getItem("manmayi_admin_session");
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.token) token = parsed.token;
          }
        } catch {}
      }
    }
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const guestId =
      getGuestId() ||
      (typeof window !== "undefined"
        ? localStorage.getItem("guestId") || localStorage.getItem("guest_id")
        : null);
    if (guestId && config.headers && !config.headers["X-Guest-ID"] && !token) {
      config.headers["X-Guest-ID"] = guestId;
    }

    if (config.data instanceof FormData && config.headers) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Queue mechanism for handling concurrent requests during silent refresh
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Response Interceptor
 * 1. Check response header x-guest-id or response body data.guestId / guestId
 *    If present, save it to localStorage under guestId and guest_id.
 * 2. Silent token refresh on 401
 * 3. Handle global errors (e.g. 422 stock errors: error.response?.data?.message)
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Check response header x-guest-id or response body guestId
    if (typeof window !== "undefined") {
      const headerGuestId = response.headers?.["x-guest-id"] || response.headers?.["X-Guest-ID"];
      const bodyGuestId = response.data?.guestId || response.data?.data?.guestId;
      const newGuestId = headerGuestId || bodyGuestId;

      if (newGuestId) {
        setGuestId(newGuestId);
        localStorage.setItem("guestId", newGuestId);
      }
    }

    return response;
  },
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;
    const responseData = error.response?.data;

    // Handle 422 Unprocessable Entity (e.g. Stock errors or Form Validation)
    if (status === 422) {
      const customError = error as CustomAxiosError;
      const fieldErrors: Record<string, string> = {};
      if (Array.isArray(responseData?.errors)) {
        responseData.errors.forEach((err) => {
          if (err.field) {
            fieldErrors[err.field] = err.message;
          }
        });
      }
      customError.validationErrors = fieldErrors;

      // Handle stock and general 422 errors globally with toast
      const message = responseData?.message;
      if (message) {
        toast.error(message);
      }
    }

    // Handle 423 Locked - Account lockout countdown
    if (status === 423) {
      const msg =
        responseData?.message || "Account is temporarily locked due to multiple failed attempts.";
      toast.error(msg, {
        duration: 8000,
        description:
          "Please check your email or wait for the lockout period to elapse before trying again.",
      });
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("auth:lockout", {
            detail: { message: msg },
          }),
        );
      }
    }

    // Handle 429 Too Many Requests - Rate limit warning
    if (status === 429) {
      const msg =
        responseData?.message || "Too many requests. Please slow down and try again shortly.";
      toast.warning("Rate Limit Exceeded", {
        description: msg,
        duration: 6000,
      });
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("auth:ratelimit", {
            detail: { message: msg },
          }),
        );
      }
    }

    // Handle 401 Unauthorized - Silent Refresh Queue
    if (status === 401 && originalRequest && !originalRequest._retry) {
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
      const isCurrentAdmin = currentPath.startsWith("/admin");

      const url = originalRequest.url || "";
      const isAuthEndpoint =
        url.includes("/auth/refresh-token") ||
        url.includes("/auth/login") ||
        url.includes("/auth/signup") ||
        url.includes("/auth/logout") ||
        url.includes("/auth/forgot-password") ||
        url.includes("/auth/reset-password");

      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      // If on an admin route, do NOT trigger customer logout or redirect to customer /login
      if (isCurrentAdmin) {
        return Promise.reject(error);
      }

      const localRefreshToken =
        typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
      if (!localRefreshToken) {
        logoutFn();
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.dispatchEvent(new CustomEvent("auth:logout"));
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post<
          ApiResponse<{ accessToken: string; refreshToken?: string; user?: any }>
        >(
          `${BASE_URL}/auth/refresh-token`,
          { refreshToken: localRefreshToken },
          { withCredentials: true },
        );

        const newAccessToken =
          refreshResponse.data?.data?.accessToken || (refreshResponse.data as any)?.accessToken;
        const newRefreshToken =
          refreshResponse.data?.data?.refreshToken || (refreshResponse.data as any)?.refreshToken;

        if (newAccessToken) {
          setAccessTokenFn(newAccessToken);
          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", newAccessToken);
            if (newRefreshToken) {
              localStorage.setItem("refreshToken", newRefreshToken);
            }
          }

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          processQueue(null, newAccessToken);
          return apiClient(originalRequest);
        } else {
          throw new Error("No access token returned from refresh");
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        logoutFn();
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.dispatchEvent(new CustomEvent("auth:logout"));
          if (
            !window.location.pathname.startsWith("/login") &&
            !window.location.pathname.startsWith("/signup") &&
            !window.location.pathname.startsWith("/admin")
          ) {
            window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
          }
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

/**
 * Extracts friendly error message from Axios error
 */
export function getErrorMessage(
  error: unknown,
  fallback = "An unexpected error occurred. Please try again.",
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiResponse | undefined;
    if (data?.message) return data.message;
    if (data?.errors && data.errors.length > 0) {
      return data.errors.map((e) => e.message).join(", ");
    }
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export const api = apiClient;
export default apiClient;
