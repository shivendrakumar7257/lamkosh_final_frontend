import { useState, useEffect } from "react";
import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { useAuthStore } from "@/lib/auth-store";
import { getErrorMessage, CustomAxiosError } from "@/lib/api";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account & Sign In — LaMoksh Fabrics" },
      {
        name: "description",
        content:
          "Sign in to your LaMoksh Fabrics account or create a new account to save your favourite pieces and manage orders.",
      },
      { property: "og:title", content: "Account & Sign In — LaMoksh Fabrics" },
      {
        property: "og:description",
        content: "Sign in or create an account for a personal LaMoksh experience.",
      },
      { property: "og:url", content: "/account" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/account" }],
  }),
  component: AccountPage,
});

type AuthMode = "signin" | "signup";

function AccountPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: isAuthLoading, login, signup } = useAuthStore();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Sign In Form State
  const [signInIdentifier, setSignInIdentifier] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInIdentifierError, setSignInIdentifierError] = useState("");
  const [signInPasswordError, setSignInPasswordError] = useState("");

  // Create Account Form State
  const [fullName, setFullName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpMobile, setSignUpMobile] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [fullNameError, setFullNameError] = useState("");
  const [signUpEmailError, setSignUpEmailError] = useState("");
  const [signUpMobileError, setSignUpMobileError] = useState("");
  const [signUpPasswordError, setSignUpPasswordError] = useState("");
  const [signUpTermsError, setSignUpTermsError] = useState("");

  // If accessing sub-route like /account/profile or /account/security, render Outlet
  if (pathname !== "/account") {
    return <Outlet />;
  }

  // Redirect to profile if authenticated
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && pathname === "/account") {
      navigate({ to: "/account/profile", replace: true });
    }
  }, [isAuthenticated, isAuthLoading, pathname, navigate]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    let valid = true;

    if (!signInIdentifier.trim()) {
      setSignInIdentifierError("Please enter your email or mobile number.");
      valid = false;
    } else {
      setSignInIdentifierError("");
    }

    if (!signInPassword) {
      setSignInPasswordError("Password is required.");
      valid = false;
    } else {
      setSignInPasswordError("");
    }

    if (!valid) return;

    setIsSubmitting(true);
    try {
      await login(signInIdentifier.trim(), signInPassword);
      toast.success("Welcome back to LaMoksh.");
      navigate({ to: "/account/profile", replace: true });
    } catch (err) {
      const customErr = err as CustomAxiosError;
      if (customErr.response?.status === 422 && customErr.validationErrors) {
        if (customErr.validationErrors.identifier) {
          setSignInIdentifierError(customErr.validationErrors.identifier);
        }
        if (customErr.validationErrors.password) {
          setSignInPasswordError(customErr.validationErrors.password);
        }
      }
      const msg = getErrorMessage(err, "Sign in failed. Please verify your credentials.");
      setServerError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    let valid = true;

    if (!fullName.trim() || fullName.trim().length < 2) {
      setFullNameError("Please enter your full name (at least 2 characters).");
      valid = false;
    } else {
      setFullNameError("");
    }

    if (!signUpEmail.trim() || !validateEmail(signUpEmail)) {
      setSignUpEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      setSignUpEmailError("");
    }

    const cleanMobile = signUpMobile.trim().replace(/\s+/g, "");
    if (!cleanMobile || !/^(?:\+91|91)?[6-9]\d{9}$/.test(cleanMobile)) {
      setSignUpMobileError("Please enter a valid 10-digit Indian mobile number.");
      valid = false;
    } else {
      setSignUpMobileError("");
    }

    if (!signUpPassword || signUpPassword.length < 8) {
      setSignUpPasswordError("Password must be at least 8 characters.");
      valid = false;
    } else {
      setSignUpPasswordError("");
    }

    if (!agreeTerms) {
      setSignUpTermsError("You must agree to the Terms of Service and Privacy Policy.");
      valid = false;
    } else {
      setSignUpTermsError("");
    }

    if (!valid) return;

    setIsSubmitting(true);
    try {
      let formattedMobile = cleanMobile;
      if (!formattedMobile.startsWith("+91")) {
        if (formattedMobile.startsWith("91") && formattedMobile.length === 12) {
          formattedMobile = `+${formattedMobile}`;
        } else {
          formattedMobile = `+91${formattedMobile}`;
        }
      }

      await signup({
        name: fullName.trim(),
        email: signUpEmail.trim().toLowerCase(),
        mobile: formattedMobile,
        password: signUpPassword,
      });

      toast.success("Account created successfully. Welcome to LaMoksh.");
      navigate({ to: "/account/profile", replace: true });
    } catch (err) {
      const customErr = err as CustomAxiosError;
      if (customErr.response?.status === 422 && customErr.validationErrors) {
        if (customErr.validationErrors.name) setFullNameError(customErr.validationErrors.name);
        if (customErr.validationErrors.email) setSignUpEmailError(customErr.validationErrors.email);
        if (customErr.validationErrors.mobile)
          setSignUpMobileError(customErr.validationErrors.mobile);
        if (customErr.validationErrors.password)
          setSignUpPasswordError(customErr.validationErrors.password);
      }
      const msg = getErrorMessage(err, "Account creation failed. Please verify your information.");
      setServerError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setServerError(null);
    setSignInIdentifierError("");
    setSignInPasswordError("");
    setFullNameError("");
    setSignUpEmailError("");
    setSignUpMobileError("");
    setSignUpPasswordError("");
    setSignUpTermsError("");
  };

  return (
    <div className="container-lux py-16 md:py-24">
      <div className="mx-auto max-w-[500px] rounded-sm border border-ivory/10 bg-espresso p-8 text-ivory shadow-xl md:p-12">
        {mode === "signin" ? (
          <div key="signin">
            <Reveal>
              <div className="text-center">
                <p className="eyebrow text-xs uppercase tracking-[0.2em] text-ivory/70">
                  WELCOME BACK
                </p>
                <h1 className="mt-2 font-serif text-3xl font-normal text-ivory md:text-4xl">
                  Sign In
                </h1>
                <p className="body-lux mt-3 text-sm text-ivory/80">
                  Sign in to access your wishlist, orders and personal details.
                </p>
              </div>

              {serverError && (
                <div className="mt-6 rounded-[2px] border border-red-500/30 bg-red-900/30 p-3.5 text-xs text-red-200">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSignInSubmit} className="mt-8 space-y-6" noValidate>
                {/* IDENTIFIER */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="signin-identifier"
                    className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-ivory/90"
                  >
                    EMAIL OR MOBILE NUMBER
                  </label>
                  <input
                    id="signin-identifier"
                    type="text"
                    autoComplete="username"
                    required
                    value={signInIdentifier}
                    onChange={(e) => {
                      setSignInIdentifier(e.target.value);
                      if (signInIdentifierError) setSignInIdentifierError("");
                    }}
                    className={cn(
                      "h-12 w-full border-b border-ivory/30 bg-transparent py-2 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/40 focus:border-ivory",
                      signInIdentifierError && "border-red-400 focus:border-red-400",
                    )}
                  />
                  {signInIdentifierError ? (
                    <p className="mt-1 font-sans text-xs text-red-300">{signInIdentifierError}</p>
                  ) : null}
                </div>

                {/* PASSWORD */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="signin-password"
                      className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-ivory/90"
                    >
                      PASSWORD
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="text-[0.65rem] font-medium uppercase tracking-wider text-ivory/70 transition-colors hover:text-ivory"
                    >
                      {showSignInPassword ? "HIDE" : "SHOW"}
                    </button>
                  </div>
                  <input
                    id="signin-password"
                    type={showSignInPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={signInPassword}
                    onChange={(e) => {
                      setSignInPassword(e.target.value);
                      if (signInPasswordError) setSignInPasswordError("");
                    }}
                    className={cn(
                      "h-12 w-full border-b border-ivory/30 bg-transparent py-2 text-sm text-ivory outline-none transition-colors focus:border-ivory",
                      signInPasswordError && "border-red-400 focus:border-red-400",
                    )}
                  />
                  {signInPasswordError ? (
                    <p className="mt-1 font-sans text-xs text-red-300">{signInPasswordError}</p>
                  ) : null}
                  <div className="pt-1 text-right">
                    <Link
                      to="/forgot-password"
                      className="text-xs text-ivory/70 transition-colors hover:text-ivory hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {/* SIGN IN BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 flex h-12 w-full items-center justify-center rounded-[2px] bg-ivory text-xs font-medium uppercase tracking-[0.15em] text-espresso transition-colors hover:bg-ivory/90 active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin text-espresso" />
                  ) : (
                    "SIGN IN"
                  )}
                </button>

                {/* Below form link */}
                <div className="pt-6 text-center">
                  <p className="text-sm text-ivory/80">
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("signup")}
                      className="font-medium text-ivory underline transition-colors hover:text-white"
                    >
                      Create one &rarr;
                    </button>
                  </p>
                </div>
              </form>
            </Reveal>
          </div>
        ) : (
          <div key="signup">
            <Reveal>
              <div className="text-center">
                <p className="eyebrow text-xs uppercase tracking-[0.2em] text-ivory/70">
                  WELCOME TO LAMOKSH
                </p>
                <h2 className="mt-2 font-serif text-3xl font-normal text-ivory md:text-4xl">
                  Create an Account
                </h2>
                <p className="body-lux mt-3 text-sm text-ivory/80">
                  Create your account to save your favourite pieces and make every LaMoksh
                  experience personal.
                </p>
              </div>

              {serverError && (
                <div className="mt-6 rounded-[2px] border border-red-500/30 bg-red-900/30 p-3.5 text-xs text-red-200">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSignUpSubmit} className="mt-8 space-y-6" noValidate>
                {/* FULL NAME */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="signup-fullname"
                    className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-ivory/90"
                  >
                    FULL NAME
                  </label>
                  <input
                    id="signup-fullname"
                    type="text"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (fullNameError) setFullNameError("");
                    }}
                    className={cn(
                      "h-12 w-full border-b border-ivory/30 bg-transparent py-2 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/40 focus:border-ivory",
                      fullNameError && "border-red-400 focus:border-red-400",
                    )}
                  />
                  {fullNameError ? (
                    <p className="mt-1 font-sans text-xs text-red-300">{fullNameError}</p>
                  ) : null}
                </div>

                {/* EMAIL ADDRESS */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="signup-email"
                    className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-ivory/90"
                  >
                    EMAIL ADDRESS
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => {
                      setSignUpEmail(e.target.value);
                      if (signUpEmailError) setSignUpEmailError("");
                    }}
                    className={cn(
                      "h-12 w-full border-b border-ivory/30 bg-transparent py-2 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/40 focus:border-ivory",
                      signUpEmailError && "border-red-400 focus:border-red-400",
                    )}
                  />
                  {signUpEmailError ? (
                    <p className="mt-1 font-sans text-xs text-red-300">{signUpEmailError}</p>
                  ) : null}
                </div>

                {/* MOBILE NUMBER */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="signup-mobile"
                    className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-ivory/90"
                  >
                    MOBILE NUMBER
                  </label>
                  <div className="relative flex items-center">
                    <span className="flex h-12 items-center border-b border-ivory/30 pr-2 font-mono text-xs text-ivory/70">
                      🇮🇳 +91
                    </span>
                    <input
                      id="signup-mobile"
                      type="tel"
                      autoComplete="tel-national"
                      placeholder="9876543210"
                      required
                      value={signUpMobile}
                      onChange={(e) => {
                        setSignUpMobile(e.target.value);
                        if (signUpMobileError) setSignUpMobileError("");
                      }}
                      className={cn(
                        "h-12 w-full border-b border-ivory/30 bg-transparent py-2 pl-2 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/40 focus:border-ivory",
                        signUpMobileError && "border-red-400 focus:border-red-400",
                      )}
                    />
                  </div>
                  {signUpMobileError ? (
                    <p className="mt-1 font-sans text-xs text-red-300">{signUpMobileError}</p>
                  ) : null}
                </div>

                {/* PASSWORD */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="signup-password"
                      className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-ivory/90"
                    >
                      PASSWORD
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="text-[0.65rem] font-medium uppercase tracking-wider text-ivory/70 transition-colors hover:text-ivory"
                    >
                      {showSignUpPassword ? "HIDE" : "SHOW"}
                    </button>
                  </div>
                  <input
                    id="signup-password"
                    type={showSignUpPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={signUpPassword}
                    onChange={(e) => {
                      setSignUpPassword(e.target.value);
                      if (signUpPasswordError) setSignUpPasswordError("");
                    }}
                    className={cn(
                      "h-12 w-full border-b border-ivory/30 bg-transparent py-2 text-sm text-ivory outline-none transition-colors focus:border-ivory",
                      signUpPasswordError && "border-red-400 focus:border-red-400",
                    )}
                  />
                  <PasswordStrengthIndicator password={signUpPassword} />
                  {signUpPasswordError ? (
                    <p className="mt-1 font-sans text-xs text-red-300">{signUpPasswordError}</p>
                  ) : null}
                </div>

                {/* TERMS CHECKBOX */}
                <div className="pt-2">
                  <label className="flex cursor-pointer items-start gap-3 text-xs text-ivory/80">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => {
                        setAgreeTerms(e.target.checked);
                        if (signUpTermsError) setSignUpTermsError("");
                      }}
                      className="mt-0.5 h-4 w-4 rounded-[2px] accent-ivory"
                    />
                    <span>
                      I agree to the{" "}
                      <Link to="/terms" className="text-ivory underline hover:text-white">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-ivory underline hover:text-white">
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>
                  {signUpTermsError ? (
                    <p className="mt-1.5 font-sans text-xs text-red-300">{signUpTermsError}</p>
                  ) : null}
                </div>

                {/* CREATE ACCOUNT BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 flex h-12 w-full items-center justify-center rounded-[2px] bg-ivory text-xs font-medium uppercase tracking-[0.15em] text-espresso transition-colors hover:bg-ivory/90 active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin text-espresso" />
                  ) : (
                    "CREATE ACCOUNT"
                  )}
                </button>

                {/* Below form link */}
                <div className="pt-6 text-center">
                  <p className="text-sm text-ivory/80">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("signin")}
                      className="font-medium text-ivory underline transition-colors hover:text-white"
                    >
                      Sign in &rarr;
                    </button>
                  </p>
                </div>
              </form>
            </Reveal>
          </div>
        )}
      </div>
    </div>
  );
}
