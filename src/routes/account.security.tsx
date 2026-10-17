import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { changePasswordSchema, ChangePasswordFormData } from "@/lib/validation/auth";
import { useAuthStore } from "@/lib/auth-store";
import { api, getErrorMessage, CustomAxiosError } from "@/lib/api";
import { ProtectedRoute } from "@/components/auth/RouteGuards";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/security")({
  head: () => ({
    meta: [
      { title: "Account Security — LaMoksh Fabrics" },
      {
        name: "description",
        content: "Update your security password and manage account protection.",
      },
    ],
  }),
  component: SecurityPageWrapper,
});

function SecurityPageWrapper() {
  return (
    <ProtectedRoute>
      <SecurityPage />
    </ProtectedRoute>
  );
}

function SecurityPage() {
  const { user, logout } = useAuthStore();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = watch("newPassword");

  const onSubmit = async (data: ChangePasswordFormData) => {
    setServerError(null);
    try {
      await api.post("/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast.success("Password changed successfully. Your account is secured.");
      reset();
    } catch (err) {
      const customErr = err as CustomAxiosError;
      if (customErr.response?.status === 422 && customErr.validationErrors) {
        Object.entries(customErr.validationErrors).forEach(([field, msg]) => {
          if (["currentPassword", "newPassword", "confirmPassword"].includes(field)) {
            setError(field as any, { message: msg });
          }
        });
      }

      const msg = getErrorMessage(
        err,
        "Failed to change password. Please verify your current password.",
      );
      setServerError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="container-lux py-12 md:py-20">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          {/* Header & Tabs */}
          <div className="border-b border-border pb-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="eyebrow text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  LA MOKSH ATELIER ACCOUNT
                </p>
                <h1 className="mt-2 font-serif text-3xl font-normal md:text-4xl text-foreground">
                  Security & Access
                </h1>
                <p className="body-lux mt-2 text-sm text-muted-foreground">
                  Maintain the safety of your account, payment credentials, and bespoke orders.
                </p>
              </div>
              <button
                type="button"
                onClick={() => logout()}
                className="text-xs font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-red-700"
              >
                Sign Out
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="mt-8 flex gap-8 border-b border-border/60">
              <Link
                to="/account/profile"
                className="border-b-2 border-transparent pb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                Personal Profile
              </Link>
              <Link
                to="/account/orders"
                className="border-b-2 border-transparent pb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                My Orders
              </Link>
              <Link
                to="/account/reviews"
                className="border-b-2 border-transparent pb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                My Reviews
              </Link>
              <Link
                to="/account/security"
                className="border-b-2 border-espresso pb-3 text-xs font-semibold uppercase tracking-wider text-espresso"
              >
                Security & Password
              </Link>
              <Link
                to="/wishlist"
                className="border-b-2 border-transparent pb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                Saved Wishlist
              </Link>
            </div>
          </div>

          {/* Security Form Card */}
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {/* Left security tips column */}
            <div className="space-y-6">
              <div className="rounded-sm border border-border/80 bg-champagne p-6">
                <div className="flex items-center gap-2 font-medium uppercase tracking-wider text-foreground">
                  <ShieldCheck className="h-5 w-5 text-espresso" />
                  <span className="text-sm font-serif">Security Hygiene</span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  We recommend using a unique password of 12+ characters containing a combination of
                  uppercase letters, numerals, and special symbols.
                </p>
                <div className="mt-4 border-t border-border/60 pt-3 text-[0.7rem] text-muted-foreground space-y-1.5">
                  <p>• Avoid using names, birthdays, or public handles.</p>
                  <p>• We never ask for your password via email or telephone.</p>
                  <p>• Periodic updates help safeguard your order history.</p>
                </div>
              </div>
            </div>

            {/* Right change password form column */}
            <div className="md:col-span-2">
              <div className="rounded-sm border border-border/80 bg-background p-8 shadow-sm">
                <h3 className="font-serif text-2xl font-normal text-foreground">Change Password</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Enter your current password followed by your chosen replacement.
                </p>

                {serverError && (
                  <div className="mt-4 rounded-[2px] border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                    {serverError}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6" noValidate>
                  {/* CURRENT PASSWORD */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="currentPassword"
                        className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-foreground"
                      >
                        Current Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="flex items-center gap-1 text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
                      >
                        {showCurrentPassword ? (
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
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      autoComplete="current-password"
                      {...register("currentPassword")}
                      className={cn(
                        "h-11 w-full rounded-[2px] border border-border bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-espresso",
                        errors.currentPassword && "border-red-400 focus:border-red-400",
                      )}
                    />
                    {errors.currentPassword ? (
                      <p className="mt-1 text-xs text-red-600">{errors.currentPassword.message}</p>
                    ) : null}
                  </div>

                  {/* NEW PASSWORD */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="newPassword"
                        className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-foreground"
                      >
                        New Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="flex items-center gap-1 text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
                      >
                        {showNewPassword ? (
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
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      autoComplete="new-password"
                      {...register("newPassword")}
                      className={cn(
                        "h-11 w-full rounded-[2px] border border-border bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-espresso",
                        errors.newPassword && "border-red-400 focus:border-red-400",
                      )}
                    />
                    {/* Password Strength Indicator inside light container */}
                    <div className="rounded-[2px] bg-muted/40 p-1">
                      <PasswordStrengthIndicator password={newPasswordValue || ""} />
                    </div>
                    {errors.newPassword ? (
                      <p className="mt-1 text-xs text-red-600">{errors.newPassword.message}</p>
                    ) : null}
                  </div>

                  {/* CONFIRM NEW PASSWORD */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="confirmPassword"
                        className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-foreground"
                      >
                        Confirm New Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="flex items-center gap-1 text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
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
                        "h-11 w-full rounded-[2px] border border-border bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-espresso",
                        errors.confirmPassword && "border-red-400 focus:border-red-400",
                      )}
                    />
                    {errors.confirmPassword ? (
                      <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
                    ) : null}
                  </div>

                  {/* SUBMIT BUTTON */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-lux flex h-11 items-center justify-center gap-2 px-8 text-xs disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Updating Credentials...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
