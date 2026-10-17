import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Clock, Eye, EyeOff, Loader2, RotateCw } from "lucide-react";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  ForgotPasswordFormData,
  ResetPasswordFormData,
} from "@/lib/validation/auth";
import { api, getErrorMessage, CustomAxiosError } from "@/lib/api";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — LaMoksh Fabrics" },
      {
        name: "description",
        content: "Reset your LaMoksh account password securely with OTP verification.",
      },
    ],
  }),
  component: ForgotPasswordPage,
});

type Step = "REQUEST_OTP" | "VERIFY_AND_RESET";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("REQUEST_OTP");
  const [identifier, setIdentifier] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // 10 minutes OTP countdown timer (600 seconds)
  const [timeLeft, setTimeLeft] = useState(600);
  const [isResending, setIsResending] = useState(false);

  // Step 1 Form
  const {
    register: registerRequest,
    handleSubmit: handleSubmitRequest,
    formState: { errors: errorsRequest, isSubmitting: isSubmittingRequest },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // Step 2 Form
  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    watch: watchReset,
    setError: setErrorReset,
    formState: { errors: errorsReset, isSubmitting: isSubmittingReset },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const newPasswordValue = watchReset("newPassword");

  // Countdown timer effect during Step 2
  useEffect(() => {
    if (step !== "VERIFY_AND_RESET" || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step, timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Handler for Step 1: Request OTP
  const onRequestOtp = async (data: ForgotPasswordFormData) => {
    setServerError(null);
    try {
      await api.post("/auth/forgot-password", {
        identifier: data.identifier.trim(),
      });
      setIdentifier(data.identifier.trim());
      setStep("VERIFY_AND_RESET");
      setTimeLeft(600); // 10 minutes
      toast.success("A 6-digit verification code has been dispatched.");
    } catch (err) {
      const msg = getErrorMessage(
        err,
        "Failed to send verification code. Please check your identifier.",
      );
      setServerError(msg);
      toast.error(msg);
    }
  };

  // Handler for Resend OTP
  const onResendOtp = async () => {
    if (timeLeft > 540) {
      toast.info("Please wait a moment before requesting another code.");
      return;
    }
    setIsResending(true);
    setServerError(null);
    try {
      await api.post("/auth/forgot-password", {
        identifier,
      });
      setTimeLeft(600); // reset to 10 mins
      toast.success("A fresh verification code has been dispatched.");
    } catch (err) {
      const msg = getErrorMessage(err, "Failed to resend code. Please try again.");
      setServerError(msg);
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };

  // Handler for Step 2: Verify OTP and Reset Password
  const onResetPassword = async (data: ResetPasswordFormData) => {
    setServerError(null);
    try {
      await api.post("/auth/reset-password", {
        identifier,
        otp: data.otp.trim(),
        newPassword: data.newPassword,
      });
      toast.success("Password reset successfully. Please sign in with your new password.");
      navigate({ to: "/login", replace: true });
    } catch (err) {
      const customErr = err as CustomAxiosError;
      if (customErr.response?.status === 422 && customErr.validationErrors) {
        Object.entries(customErr.validationErrors).forEach(([field, msg]) => {
          if (["otp", "newPassword", "confirmPassword"].includes(field)) {
            setErrorReset(field as any, { message: msg });
          }
        });
      }

      const msg = getErrorMessage(err, "Failed to reset password. Please verify the OTP.");
      setServerError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="container-lux py-16 md:py-24">
      <div className="mx-auto max-w-[500px] rounded-sm border border-ivory/10 bg-espresso p-8 text-ivory shadow-xl md:p-12">
        <Reveal>
          <div className="mb-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-ivory/70 transition-colors hover:text-ivory"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
            </Link>
          </div>

          <div className="text-center">
            <p className="eyebrow text-xs uppercase tracking-[0.2em] text-ivory/70">
              ACCOUNT RECOVERY
            </p>
            <h1 className="mt-2 font-serif text-3xl font-normal text-ivory md:text-4xl">
              {step === "REQUEST_OTP" ? "Forgot Password" : "Reset Password"}
            </h1>
            <p className="body-lux mt-3 text-sm text-ivory/80">
              {step === "REQUEST_OTP"
                ? "Enter your registered email address or mobile number to receive a 6-digit one-time verification code."
                : `Enter the 6-digit OTP sent to ${identifier} and choose your new password.`}
            </p>
          </div>

          {serverError && (
            <div className="mt-6 rounded-[2px] border border-red-500/30 bg-red-900/30 p-3.5 text-xs text-red-200">
              {serverError}
            </div>
          )}

          {step === "REQUEST_OTP" ? (
            /* STEP 1: REQUEST OTP */
            <form
              onSubmit={handleSubmitRequest(onRequestOtp)}
              className="mt-8 space-y-6"
              noValidate
            >
              <div className="space-y-1.5">
                <label
                  htmlFor="req-identifier"
                  className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-ivory/90"
                >
                  Email or Mobile Number
                </label>
                <input
                  id="req-identifier"
                  type="text"
                  autoComplete="username"
                  placeholder="e.g. you@domain.com or 9876543210"
                  {...registerRequest("identifier")}
                  className={cn(
                    "h-12 w-full border-b border-ivory/30 bg-transparent py-2 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/30 focus:border-ivory",
                    errorsRequest.identifier && "border-red-400 focus:border-red-400",
                  )}
                />
                {errorsRequest.identifier ? (
                  <p className="mt-1 font-sans text-xs text-red-300">
                    {errorsRequest.identifier.message}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={isSubmittingRequest}
                className="mt-6 flex h-12 w-full items-center justify-center rounded-[2px] bg-ivory text-xs font-medium uppercase tracking-[0.15em] text-espresso transition-colors hover:bg-ivory/90 disabled:opacity-50"
              >
                {isSubmittingRequest ? (
                  <Loader2 className="h-4 w-4 animate-spin text-espresso" />
                ) : (
                  "Send Verification Code"
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: VERIFY OTP & RESET */
            <form
              onSubmit={handleSubmitReset(onResetPassword)}
              className="mt-8 space-y-5"
              noValidate
            >
              {/* OTP CODE */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="otp"
                    className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-ivory/90"
                  >
                    6-Digit Verification Code
                  </label>
                  <div className="flex items-center gap-1 font-mono text-[0.7rem] text-ivory/80">
                    <Clock className="h-3 w-3 text-amber-300" />
                    <span>Expires in {formatTimer(timeLeft)}</span>
                  </div>
                </div>
                <input
                  id="otp"
                  type="text"
                  maxLength={6}
                  inputMode="numeric"
                  placeholder="123456"
                  {...registerReset("otp")}
                  className={cn(
                    "h-12 w-full border-b border-ivory/30 bg-transparent py-2 text-center font-mono text-lg tracking-[0.5em] text-ivory outline-none transition-colors placeholder:text-ivory/30 focus:border-ivory",
                    errorsReset.otp && "border-red-400 focus:border-red-400",
                  )}
                />
                {errorsReset.otp ? (
                  <p className="mt-1 font-sans text-xs text-red-300">{errorsReset.otp.message}</p>
                ) : null}

                {/* Resend button */}
                <div className="pt-1 text-right">
                  <button
                    type="button"
                    disabled={isResending || timeLeft > 540}
                    onClick={onResendOtp}
                    className="inline-flex items-center gap-1 text-[0.7rem] uppercase tracking-wider text-ivory/70 transition-colors hover:text-ivory disabled:opacity-40"
                  >
                    <RotateCw className={cn("h-3 w-3", isResending && "animate-spin")} />
                    Resend Code
                  </button>
                </div>
              </div>

              {/* NEW PASSWORD */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="newPassword"
                    className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-ivory/90"
                  >
                    New Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="flex items-center gap-1 text-[0.65rem] font-medium uppercase tracking-wider text-ivory/70 transition-colors hover:text-ivory"
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
                  {...registerReset("newPassword")}
                  className={cn(
                    "h-12 w-full border-b border-ivory/30 bg-transparent py-2 text-sm text-ivory outline-none transition-colors focus:border-ivory",
                    errorsReset.newPassword && "border-red-400 focus:border-red-400",
                  )}
                />
                <PasswordStrengthIndicator password={newPasswordValue || ""} />
                {errorsReset.newPassword ? (
                  <p className="mt-1 font-sans text-xs text-red-300">
                    {errorsReset.newPassword.message}
                  </p>
                ) : null}
              </div>

              {/* CONFIRM NEW PASSWORD */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-ivory/90"
                  >
                    Confirm New Password
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
                  {...registerReset("confirmPassword")}
                  className={cn(
                    "h-12 w-full border-b border-ivory/30 bg-transparent py-2 text-sm text-ivory outline-none transition-colors focus:border-ivory",
                    errorsReset.confirmPassword && "border-red-400 focus:border-red-400",
                  )}
                />
                {errorsReset.confirmPassword ? (
                  <p className="mt-1 font-sans text-xs text-red-300">
                    {errorsReset.confirmPassword.message}
                  </p>
                ) : null}
              </div>

              {/* SUBMIT RESET */}
              <button
                type="submit"
                disabled={isSubmittingReset}
                className="mt-6 flex h-12 w-full items-center justify-center rounded-[2px] bg-ivory text-xs font-medium uppercase tracking-[0.15em] text-espresso transition-colors hover:bg-ivory/90 disabled:opacity-50"
              >
                {isSubmittingReset ? (
                  <Loader2 className="h-4 w-4 animate-spin text-espresso" />
                ) : (
                  "Reset Password"
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setStep("REQUEST_OTP")}
                  className="text-xs text-ivory/70 underline hover:text-ivory"
                >
                  Change identifier / Request new code
                </button>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </div>
  );
}
