import { useState } from "react";
import { createFileRoute, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signupSchema, SignupFormData } from "@/lib/validation/auth";
import { useAuthStore } from "@/lib/auth-store";
import { getErrorMessage, CustomAxiosError } from "@/lib/api";
import { PublicOnlyRoute } from "@/components/auth/RouteGuards";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create an Account — LaMoksh Fabrics" },
      {
        name: "description",
        content:
          "Create your personal account with LaMoksh for bespoke collections and private services.",
      },
    ],
  }),
  component: SignupPageWrapper,
});

function SignupPageWrapper() {
  return (
    <PublicOnlyRoute>
      <SignupPage />
    </PublicOnlyRoute>
  );
}

function SignupPage() {
  const navigate = useNavigate();
  const location = useRouterState({ select: (s) => s.location });
  const { signup, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const searchParams = new URLSearchParams(location.searchStr);
  const redirectUrl = searchParams.get("redirect") || "/account/profile";

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const passwordValue = watch("password");

  const onSubmit = async (data: SignupFormData) => {
    setServerError(null);
    try {
      // Format mobile with +91 if not prefixed
      let formattedMobile = data.mobile.trim().replace(/\s+/g, "");
      if (!formattedMobile.startsWith("+91")) {
        if (formattedMobile.startsWith("91") && formattedMobile.length === 12) {
          formattedMobile = `+${formattedMobile}`;
        } else {
          formattedMobile = `+91${formattedMobile}`;
        }
      }

      await signup({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        mobile: formattedMobile,
        password: data.password,
      });

      toast.success("Account created successfully. Welcome to LaMoksh.");
      navigate({ to: redirectUrl as any, replace: true });
    } catch (err: unknown) {
      const customErr = err as CustomAxiosError;
      if (customErr.response?.status === 422 && customErr.validationErrors) {
        Object.entries(customErr.validationErrors).forEach(([field, msg]) => {
          if (["name", "email", "mobile", "password", "confirmPassword"].includes(field)) {
            setError(field as any, { message: msg });
          }
        });
      }

      const msg = getErrorMessage(err, "Failed to create account. Please check your information.");
      setServerError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="container-lux py-16 md:py-24">
      <div className="mx-auto max-w-[550px] rounded-sm border border-ivory/10 bg-espresso p-8 text-ivory shadow-xl md:p-12">
        <Reveal>
          <div className="text-center">
            <p className="eyebrow text-xs uppercase tracking-[0.2em] text-ivory/70">
              JOIN LAMOKSH
            </p>
            <h1 className="mt-2 font-serif text-3xl font-normal text-ivory md:text-4xl">
              Create an Account
            </h1>
            <p className="body-lux mt-3 text-sm text-ivory/80">
              Preserve your personal measurements, bespoke pieces, and bespoke wishlist.
            </p>
          </div>

          {serverError && (
            <div className="mt-6 rounded-[2px] border border-red-500/30 bg-red-900/30 p-3.5 text-xs text-red-200">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
            {/* FULL NAME */}
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-ivory/90"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Ananya Sharma"
                {...register("name")}
                className={cn(
                  "h-12 w-full border-b border-ivory/30 bg-transparent py-2 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/30 focus:border-ivory",
                  errors.name && "border-red-400 focus:border-red-400",
                )}
              />
              {errors.name ? (
                <p className="mt-1 font-sans text-xs text-red-300">{errors.name.message}</p>
              ) : null}
            </div>

            {/* EMAIL ADDRESS */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-ivory/90"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@domain.com"
                {...register("email")}
                className={cn(
                  "h-12 w-full border-b border-ivory/30 bg-transparent py-2 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/30 focus:border-ivory",
                  errors.email && "border-red-400 focus:border-red-400",
                )}
              />
              {errors.email ? (
                <p className="mt-1 font-sans text-xs text-red-300">{errors.email.message}</p>
              ) : null}
            </div>

            {/* MOBILE NUMBER WITH +91 INDICATOR */}
            <div className="space-y-1.5">
              <label
                htmlFor="mobile"
                className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-ivory/90"
              >
                Mobile Number
              </label>
              <div className="relative flex items-center">
                <span className="flex h-12 items-center border-b border-ivory/30 pr-2 font-mono text-xs text-ivory/70">
                  🇮🇳 +91
                </span>
                <input
                  id="mobile"
                  type="tel"
                  autoComplete="tel-national"
                  placeholder="98765 43210"
                  {...register("mobile")}
                  className={cn(
                    "h-12 w-full border-b border-ivory/30 bg-transparent py-2 pl-2 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/30 focus:border-ivory",
                    errors.mobile && "border-red-400 focus:border-red-400",
                  )}
                />
              </div>
              {errors.mobile ? (
                <p className="mt-1 font-sans text-xs text-red-300">{errors.mobile.message}</p>
              ) : null}
            </div>

            {/* PASSWORD WITH REAL-TIME STRENGTH INDICATOR */}
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
                autoComplete="new-password"
                {...register("password")}
                className={cn(
                  "h-12 w-full border-b border-ivory/30 bg-transparent py-2 text-sm text-ivory outline-none transition-colors focus:border-ivory",
                  errors.password && "border-red-400 focus:border-red-400",
                )}
              />
              <PasswordStrengthIndicator password={passwordValue || ""} />
              {errors.password ? (
                <p className="mt-1 font-sans text-xs text-red-300">{errors.password.message}</p>
              ) : null}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="confirmPassword"
                  className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-ivory/90"
                >
                  Confirm Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="flex items-center gap-1 text-[0.65rem] font-medium uppercase tracking-wider text-ivory/70 transition-colors hover:text-ivory"
                >
                  {showConfirmPassword ? (
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
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                {...register("confirmPassword")}
                className={cn(
                  "h-12 w-full border-b border-ivory/30 bg-transparent py-2 text-sm text-ivory outline-none transition-colors focus:border-ivory",
                  errors.confirmPassword && "border-red-400 focus:border-red-400",
                )}
              />
              {errors.confirmPassword ? (
                <p className="mt-1 font-sans text-xs text-red-300">
                  {errors.confirmPassword.message}
                </p>
              ) : null}
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
                "Create Account"
              )}
            </button>

            {/* Terms Notice */}
            <p className="text-center text-[0.7rem] text-ivory/60">
              By registering, you agree to LaMoksh&apos;s{" "}
              <Link to="/terms" className="text-ivory underline hover:text-white">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-ivory underline hover:text-white">
                Privacy Policy
              </Link>
              .
            </p>

            {/* Existing account link */}
            <div className="pt-4 text-center">
              <p className="text-sm text-ivory/80">
                Already have an account?{" "}
                <Link
                  to="/login"
                  search={{
                    redirect: redirectUrl !== "/account/profile" ? redirectUrl : undefined,
                  }}
                  className="font-medium text-ivory underline transition-colors hover:text-white"
                >
                  Sign in &rarr;
                </Link>
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
