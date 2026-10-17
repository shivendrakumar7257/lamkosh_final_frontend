import { create } from "zustand";
import axios from "axios";
import { api, bindAuthMethods, ApiResponse, BASE_URL } from "./api";
import { getGuestId, clearGuestId } from "./guest";

export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";
export type Gender = "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  mustChangePassword: boolean;
  address?: string | null;
  gender?: Gender | null;
}

export interface ProfileUpdateData {
  name: string;
  address?: string;
  gender: Gender;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  lockoutMessage: string | null;
  rateLimitMessage: string | null;

  // Actions
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<User>;
  signup: (payload: {
    name: string;
    email: string;
    mobile: string;
    password: string;
  }) => Promise<User>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  updateUserProfile: (data: ProfileUpdateData) => Promise<User>;
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setLockoutMessage: (msg: string | null) => void;
  setRateLimitMessage: (msg: string | null) => void;
}

import { toast } from "sonner";

// Helper to trigger guest cart and wishlist merge post-login / registration
export async function mergeGuestDataPostLogin(): Promise<{
  cartMerged: boolean;
  wishlistMerged: boolean;
  adjustedItems?: any[];
}> {
  const guestId = getGuestId();
  if (!guestId) {
    return { cartMerged: false, wishlistMerged: false };
  }

  let adjustedItems: any[] = [];
  let cartMerged = false;
  let wishlistMerged = false;

  try {
    const [cartRes, wishlistRes] = await Promise.allSettled([
      api.post("/cart/merge", { guestId }),
      api.post("/wishlist/merge", { guestId }),
    ]);

    if (cartRes.status === "fulfilled") {
      cartMerged = true;
      const data = cartRes.value.data?.data || cartRes.value.data;
      if (data?.adjustedItems && data.adjustedItems.length > 0) {
        adjustedItems = data.adjustedItems;
        toast.warning("Some items in your cart were adjusted based on available stock");
      }
    }

    if (wishlistRes.status === "fulfilled") {
      wishlistMerged = true;
    }
  } catch (error) {
    console.warn("Failed to merge guest cart or wishlist:", error);
  } finally {
    clearGuestId();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cart:refresh"));
      window.dispatchEvent(new CustomEvent("wishlist:refresh"));
    }
  }

  return { cartMerged, wishlistMerged, adjustedItems };
}

const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: getStoredToken(),
  isAuthenticated: false,
  isLoading: true,
  lockoutMessage: null,
  rateLimitMessage: null,

  setAccessToken: (token: string | null) => {
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("accessToken", token);
      } else {
        localStorage.removeItem("accessToken");
      }
    }
    set({ accessToken: token, isAuthenticated: Boolean(token) });
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: Boolean(user && get().accessToken) });
  },

  setLockoutMessage: (msg: string | null) => {
    set({ lockoutMessage: msg });
  },

  setRateLimitMessage: (msg: string | null) => {
    set({ rateLimitMessage: msg });
  },

  login: async (identifier: string, password: string, _rememberMe = true) => {
    set({ isLoading: true, lockoutMessage: null });
    try {
      const response = await api.post<
        ApiResponse<{ user: User; accessToken: string; refreshToken?: string }>
      >("/auth/login", { identifier, password });

      const data = response.data?.data || (response.data as any);
      const user: User = data.user;
      const accessToken: string = data.accessToken;
      const refreshToken: string | undefined = data.refreshToken;

      if (typeof window !== "undefined") {
        if (accessToken) localStorage.setItem("accessToken", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      }

      set({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
        lockoutMessage: null,
      });

      // Immediately trigger guest cart and wishlist merge
      await mergeGuestDataPostLogin();

      return user;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  signup: async (payload: { name: string; email: string; mobile: string; password: string }) => {
    set({ isLoading: true });
    try {
      const response = await api.post<
        ApiResponse<{ user: User; accessToken: string; refreshToken?: string }>
      >("/auth/signup", payload);

      const data = response.data?.data || (response.data as any);
      const user: User = data.user;
      const accessToken: string = data.accessToken;
      const refreshToken: string | undefined = data.refreshToken;

      if (typeof window !== "undefined") {
        if (accessToken) localStorage.setItem("accessToken", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      }

      set({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
      });

      // Immediately trigger guest cart and wishlist merge
      await mergeGuestDataPostLogin();

      return user;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      const storedRefreshToken =
        typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
      await api
        .post("/auth/logout", storedRefreshToken ? { refreshToken: storedRefreshToken } : {})
        .catch(() => {});
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        if (path.startsWith("/account") && !path.startsWith("/admin")) {
          window.location.href = "/login";
        }
      }
    }
  },

  initializeAuth: async () => {
    // If currently on admin route, do not run storefront customer auth checks
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
      set({ isLoading: false });
      return;
    }

    const storedToken = getStoredToken();
    const storedRefreshToken =
      typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

    // If both tokens are absent, the visitor is unauthenticated. Do NOT call /auth/refresh-token!
    if (!storedToken && !storedRefreshToken) {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return;
    }

    set({ isLoading: true });

    try {
      if (storedToken) {
        // Attempt GET /auth/me with existing access token
        const meResponse = await api.get<ApiResponse<{ user: User } | User>>("/auth/me");
        const userData =
          (meResponse.data?.data as any)?.user || meResponse.data?.data || (meResponse.data as any);
        if (userData && userData.id) {
          set({
            user: userData,
            accessToken: storedToken,
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }
      }

      // If storedToken is missing/expired, but storedRefreshToken is available, refresh:
      if (storedRefreshToken) {
        const refreshResponse = await axios.post<
          ApiResponse<{ accessToken: string; refreshToken?: string; user?: User }>
        >(
          `${BASE_URL}/auth/refresh-token`,
          { refreshToken: storedRefreshToken },
          { withCredentials: true },
        );
        const refData = refreshResponse.data?.data || (refreshResponse.data as any);
        const newToken = refData?.accessToken;
        const newRefreshToken = refData?.refreshToken;

        if (newToken) {
          set({ accessToken: newToken });
          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", newToken);
            if (newRefreshToken) {
              localStorage.setItem("refreshToken", newRefreshToken);
            }
          }

          // Fetch user profile with new token
          const meResponse = await api.get<ApiResponse<{ user: User } | User>>("/auth/me");
          const userData =
            (meResponse.data?.data as any)?.user ||
            meResponse.data?.data ||
            (meResponse.data as any);

          set({
            user: userData || refData?.user || null,
            accessToken: newToken,
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }
      }

      // Failed to restore session
      throw new Error("Unable to restore session");
    } catch {
      // Inactive or expired session
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  updateUserProfile: async (data: ProfileUpdateData) => {
    const response = await api.patch<ApiResponse<{ user: User } | User>>("/profile", data);
    const updatedUser =
      (response.data?.data as any)?.user || response.data?.data || (response.data as any);
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedUser } : updatedUser,
    }));
    return updatedUser;
  },
}));

// Bind store callbacks to Axios interceptor
bindAuthMethods(
  () => useAuthStore.getState().accessToken,
  (token) => useAuthStore.getState().setAccessToken(token),
  () => useAuthStore.getState().logout(),
);
