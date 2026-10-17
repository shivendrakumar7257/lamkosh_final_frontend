import { ReactNode, useEffect } from "react";
import { useNavigate, useRouterState, Link } from "@tanstack/react-router";
import { useAuthStore } from "@/lib/auth-store";
import { ShieldAlert, Loader2 } from "lucide-react";

interface RouteGuardProps {
  children: ReactNode;
}

/**
 * Loading state during auth hydration
 */
export function AuthLoadingScreen() {
  return (
    <div className="container-lux flex min-h-[60vh] flex-col items-center justify-center text-center">
      <Loader2 className="h-8 w-8 animate-spin text-espresso" />
      <p className="eyebrow mt-4 tracking-[0.2em] text-muted-foreground">
        Authenticating session...
      </p>
    </div>
  );
}

/**
 * ProtectedRoute:
 * Requires authentication. If unauthenticated, records current pathname and query
 * and redirects user to /login?redirect=...
 */
export function ProtectedRoute({ children }: RouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useRouterState({ select: (s) => s.location });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const currentPath = location.pathname + (location.searchStr ? `?${location.searchStr}` : "");
      navigate({
        to: "/login",
        search: { redirect: currentPath } as any,
        replace: true,
      });
    }
  }, [isAuthenticated, isLoading, location, navigate]);

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

/**
 * AdminRoute:
 * Requires authentication AND role of 'ADMIN' or 'SUPER_ADMIN'.
 * Shows a refined 403 Forbidden state or redirects if unauthorized.
 */
export function AdminRoute({ children }: RouteGuardProps) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useRouterState({ select: (s) => s.location });

  const isAdmin = user && (user.role === "ADMIN" || user.role === "SUPER_ADMIN");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const currentPath = location.pathname + (location.searchStr ? `?${location.searchStr}` : "");
      navigate({
        to: "/admin/login",
        search: { redirect: currentPath } as any,
        replace: true,
      });
    }
  }, [isAuthenticated, isLoading, location, navigate]);

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="container-lux flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <p className="eyebrow mt-6 text-xs uppercase tracking-[0.2em] text-red-600">
          403 Forbidden
        </p>
        <h1 className="display-sm mt-2 text-2xl font-serif text-foreground">Restricted Access</h1>
        <p className="body-lux mt-3 max-w-md text-sm text-muted-foreground">
          You do not have administrative privileges to access this sector of the atelier.
        </p>
        <div className="mt-8 flex gap-4">
          <Link to="/" className="btn-lux">
            Return to Store
          </Link>
          <Link
            to="/account/profile"
            className="inline-flex items-center justify-center border border-border px-6 py-2.5 text-xs uppercase tracking-wider transition-colors hover:bg-muted"
          >
            My Account
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * PublicOnlyRoute:
 * Redirects already-authenticated users away from /login and /signup
 * to their account profile or the query redirect location.
 */
export function PublicOnlyRoute({ children }: RouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useRouterState({ select: (s) => s.location });

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const searchParams = new URLSearchParams(location.searchStr);
      const redirectUrl = searchParams.get("redirect") || "/account/profile";
      navigate({
        to: redirectUrl as any,
        replace: true,
      });
    }
  }, [isAuthenticated, isLoading, location, navigate]);

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
