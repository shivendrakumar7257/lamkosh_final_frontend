import { apiClient } from "@/api/apiClient";
import { dbStore } from "@/lib/db/store";
import { useAuthStore } from "@/lib/auth-store";

export interface AdminSession {
  id: string;
  email: string;
  fullName: string;
  role: "super_admin" | "admin" | "editor";
  token: string;
  expiresAt: number;
}

const ADMIN_SESSION_KEY = "lamoksh_admin_session";
const LEGACY_SESSION_KEY = "manmayi_admin_session";

export async function loginAdmin(
  emailInput: string,
  passwordInput: string,
  rememberMe = false,
): Promise<{ success: boolean; session?: AdminSession; error?: string }> {
  const email = emailInput.trim().toLowerCase();
  const password = passwordInput.trim();

  if (!email || !password) {
    return { success: false, error: "Please provide both email address and password." };
  }

  try {
    // Authenticate through the live backend API
    const response = await apiClient.post("/auth/login", {
      identifier: email,
      password,
    });

    const resData = response.data?.data || (response.data as any);
    const user = resData?.user;
    const accessToken = resData?.accessToken || resData?.token;
    const refreshToken = resData?.refreshToken;

    if (!user || !accessToken) {
      return {
        success: false,
        error: response.data?.message || "Invalid response received from authentication server.",
      };
    }

    // Role privilege verification
    const roleStr = String(user.role || "").toUpperCase();
    const isExplicitUser = roleStr === "USER" && !user.isAdmin && !(user as any).is_admin;

    if (isExplicitUser) {
      dbStore.addAuditLog("UNAUTHORIZED_ADMIN_ACCESS_ATTEMPT", "auth", user.id || "none", { email });
      return {
        success: false,
        error: "Access denied. Your account is not authorized with administrator privileges.",
      };
    }

    const session: AdminSession = {
      id: user.id || "admin-1",
      email: user.email || email,
      fullName: user.name || (user as any).fullName || "Store Administrator",
      role: roleStr.includes("SUPER") ? "super_admin" : "admin",
      token: accessToken,
      expiresAt: Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000),
    };

    saveAdminSession(session, rememberMe);

    // Save tokens and update shared auth store state
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
    }
    useAuthStore.getState().setAccessToken(accessToken);
    useAuthStore.getState().setUser(user);

    dbStore.addAuditLog("ADMIN_LOGIN", "auth", session.id, { email, method: "api_verified" });
    return { success: true, session };
  } catch (err: any) {
    const errorMsg =
      err?.response?.data?.message ||
      (Array.isArray(err?.response?.data?.errors) && err.response.data.errors[0]?.message) ||
      err?.message ||
      "Authentication failed. Please verify credentials.";

    dbStore.addAuditLog("FAILED_LOGIN_ATTEMPT", "auth", "none", { email, reason: errorMsg });
    return { success: false, error: errorMsg };
  }
}

export function saveAdminSession(session: AdminSession, remember = false): void {
  if (typeof window === "undefined") return;
  try {
    const data = JSON.stringify(session);
    if (remember) {
      localStorage.setItem(ADMIN_SESSION_KEY, data);
      localStorage.setItem(LEGACY_SESSION_KEY, data);
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      sessionStorage.removeItem(LEGACY_SESSION_KEY);
    } else {
      sessionStorage.setItem(ADMIN_SESSION_KEY, data);
      sessionStorage.setItem(LEGACY_SESSION_KEY, data);
      localStorage.removeItem(ADMIN_SESSION_KEY);
      localStorage.removeItem(LEGACY_SESSION_KEY);
    }
  } catch (e) {
    console.error("Error storing session:", e);
  }
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw =
      sessionStorage.getItem(ADMIN_SESSION_KEY) ||
      localStorage.getItem(ADMIN_SESSION_KEY) ||
      sessionStorage.getItem(LEGACY_SESSION_KEY) ||
      localStorage.getItem(LEGACY_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AdminSession;
    if (Date.now() > session.expiresAt) {
      logoutAdmin();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function logoutAdmin(): void {
  if (typeof window === "undefined") return;
  const current = getAdminSession();
  if (current) {
    dbStore.addAuditLog("ADMIN_LOGOUT", "auth", current.id, { email: current.email });
  }
  localStorage.removeItem(ADMIN_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  localStorage.removeItem(LEGACY_SESSION_KEY);
  sessionStorage.removeItem(LEGACY_SESSION_KEY);
}

export function isAuthenticatedAdmin(): boolean {
  const session = getAdminSession();
  return Boolean(session && session.role && Date.now() < session.expiresAt);
}
