import { useState } from "react";
import { createFileRoute, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginSchema, LoginFormData } from "@/lib/validation/auth";
import { useAuthStore } from "@/lib/auth-store";
import { getErrorMessage, CustomAxiosError } from "@/lib/api";
import { PublicOnlyRoute } from "@/components/auth/RouteGuards";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — LaMoksh Fabrics" },
      {
        name: "description",
        content: "Sign in to access your LaMoksh account, wishlist, and bespoke orders.",
      },
    ],
  }),
  component: LoginPageWrapper,
});

function LoginPageWrapper() {
  return (
    <PublicOnlyRoute>
      <LoginPage />
    </PublicOnlyRoute>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const location = useRouterState({ select: (s) => s.location });
  const { login, isLoading, lockoutMessage } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const searchParams = new URLSearchParams(location.searchStr);
  const redirectUrl = searchParams.get("redirect") || "/account/profile";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      await login(data.identifier, data.password, data.rememberMe ?? true);
      toast.success("Welcome back to LaMoksh.");
      navigate({ to: redirectUrl as any, replace: true });
    } catch (err: unknown) {
      const customErr = err as CustomAxiosError;
      if (customErr.response?.status === 422 && customErr.validationErrors) {
        Object.entries(customErr.validationErrors).forEach(([field, msg]) => {
          if (field === "identifier" || field === "password") {
            setError(field as any, { message: msg });
          }
        });
      }

      const msg = getErrorMessage(err, "Sign in failed. Please verify your credentials.");
      setServerError(msg);
      toast.error(msg);
    }
  };

  const handleGuestContinue = () => {
    navigate({ to: redirectUrl !== "/account/profile" ? (redirectUrl as any) : "/" });
  };

  return (
    <div className="container-lux py-16 md:py-24">
      <div className="mx-auto max-w-[500px] rounded-sm border border-ivory/10 bg-espresso p-8 text-ivory shadow-xl md:p-12">
        <Reveal>
          <div className="text-center">
            <p className="eyebrow text-xs uppercase tracking-[0.2em] text-ivory/70">WELCOME BACK</p>
            <h1 className="mt-2 font-serif text-3xl font-normal text-ivory md:text-4xl">Sign In</h1>
            <p className="body-lux mt-3 text-sm text-ivory/80">
              Sign in to access your saved wardrobe, order history and bespoke textile selections.
            </p>
          </div>

          {/* Account Lockout Notice if 423 */}
          {lockoutMessage && (
            <div className="mt-6 rounded-[2px] border border-red-500/40 bg-red-950/60 p-4 text-xs text-red-200">
              <p className="font-semibold uppercase tracking-wider text-red-300">Account Locked</p>
              <p className="mt-1">{lockoutMessage}</p>
            </div>
          )}

          {/* General Server Error Display */}
          {serverError && !lockoutMessage && (
            <div className="mt-6 rounded-[2px] border border-red-500/30 bg-red-900/30 p-3.5 text-xs text-red-200">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6" noValidate>
            {/* IDENTIFIER: Email or Mobile */}
            <div className="space-y-1.5">
              <label
                htmlFor="identifier"
                className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-ivory/90"
              >
                Email or Mobile Number
              </label>
              <input
                id="identifier"
                type="text"
                autoComplete="username"
                placeholder="you@domain.com or 9876543210"
                {...register("identifier")}
                className={cn(
                  "h-12 w-full border-b border-ivory/30 bg-transparent py-2 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/30 focus:border-ivory",
                  errors.identifier && "border-red-400 focus:border-red-400",
                )}
              />
              {errors.identifier ? (
                <p className="mt-1 font-sans text-xs text-red-300">{errors.identifier.message}</p>
              ) : null}
            </div>

            {/* PASSWORD */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-ivory/90"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex items-center gap-1 text-[0.65rem] font-medium uppercase tracking-wider text-ivory/70 transition-colors hover:text-ivory"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="h-3 w-3" /> Hide
                    </>
                  ) : (
                    <>
                      <Eye className="h-3 w-3" /> Show
                    </>
                  )}
                </button>
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                {...register("password")}
                className={cn(
                  "h-12 w-full border-b border-ivory/30 bg-transparent py-2 text-sm text-ivory outline-none transition-colors focus:border-ivory",
                  errors.password && "border-red-400 focus:border-red-400",
                )}
              />
              {errors.password ? (
                <p className="mt-1 font-sans text-xs text-red-300">{errors.password.message}</p>
              ) : null}
              <div className="flex items-center justify-between pt-1">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-ivory/80">
                  <input
                    type="checkbox"
                    {...register("rememberMe")}
                    className="h-3.5 w-3.5 rounded-[2px] accent-ivory"
                  />
                  <span>Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-ivory/70 transition-colors hover:text-ivory hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-[2px] bg-ivory text-xs font-medium uppercase tracking-[0.15em] text-espresso transition-colors hover:bg-ivory/90 disabled:opacity-50"
            >
              {isSubmitting || isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-espresso" />
              ) : (
                "Sign In"
              )}
            </button>

            {/* Subtle Divider */}
            <div className="relative pt-2 text-center">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-ivory/20" />
              </div>
              <div className="relative inline-block bg-espresso px-4">
                <span className="text-xs font-medium uppercase tracking-widest text-ivory/70">
                  OR
                </span>
              </div>
            </div>

            {/* Social / Google Option */}
            <button
              type="button"
              onClick={() => {
                toast.info("Google Authentication is connecting to atelier services...");
              }}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-[2px] border border-ivory/30 bg-transparent text-xs font-medium uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-ivory/10"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Guest Checkout Option */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleGuestContinue}
                className="text-xs uppercase tracking-widest text-ivory/60 hover:text-ivory hover:underline"
              >
                Continue as Guest &rarr;
              </button>
            </div>

            {/* Create account link */}
            <div className="pt-4 text-center">
              <p className="text-sm text-ivory/80">
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  search={{
                    redirect: redirectUrl !== "/account/profile" ? redirectUrl : undefined,
                  }}
                  className="font-medium text-ivory underline transition-colors hover:text-white"
                >
                  Create one &rarr;
                </Link>
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
