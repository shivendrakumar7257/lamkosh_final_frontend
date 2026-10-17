import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail, ShieldAlert, ArrowRight } from "lucide-react";
import { loginAdmin, isAuthenticatedAdmin } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  useEffect(() => {
    if (isAuthenticatedAdmin()) {
      navigate({ to: "/admin", replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const result = await loginAdmin(email, password, rememberMe);
      if (result.success) {
        navigate({ to: "/admin", replace: true });
      } else {
        setErrorMessage(result.error || "Authentication failed. Please verify credentials.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FAF8F5] px-4 py-12">
      {/* Luxury Brand Card Header */}
      <div className="w-full max-w-md bg-white border border-[#E7E5E4] p-8 md:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#6B1D2F]" />

        <div className="text-center">
          <div className="inline-grid h-14 w-14 place-items-center bg-[#6B1D2F] font-serif text-2xl font-bold text-white shadow-sm mb-4">
            L
          </div>
          <p className="eyebrow text-[#6B1D2F] tracking-[0.24em]">LAMOKSH FABRICS</p>
          <h1 className="font-serif text-2xl md:text-3xl font-normal text-[#1C1917] mt-1">
            Administration Portal
          </h1>
          <p className="text-xs text-[#57534E] mt-2 font-sans">
            Secure authentication portal for authorized store administrators.
          </p>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="mt-6 flex items-start gap-3 border border-red-200 bg-red-50 p-4 text-xs text-red-800">
            <ShieldAlert className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
            <div>
              <p className="font-semibold">Authentication Error</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Email Address */}
          <div>
            <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
              Admin Email Address
            </label>
            <div className="relative mt-2">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#57534E]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@domain.com"
                className="w-full border border-[#E7E5E4] bg-[#FAF8F5] py-3 pl-10 pr-4 text-xs font-sans outline-none focus:border-[#6B1D2F] focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                Password
              </label>
              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-[0.7rem] font-medium text-[#6B1D2F] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative mt-2">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#57534E]" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full border border-[#E7E5E4] bg-[#FAF8F5] py-3 pl-10 pr-10 text-xs font-sans outline-none focus:border-[#6B1D2F] focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#57534E] hover:text-[#1C1917]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me Toggle */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer font-sans text-xs text-[#57534E]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 accent-[#6B1D2F]"
              />
              <span>Remember administrator session</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#6B1D2F] py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#4D1220] transition-colors disabled:opacity-50"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Admin Panel"}</span>
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white border border-[#E7E5E4] p-6 shadow-2xl relative">
            <h2 className="font-serif text-xl font-normal text-[#1C1917]">
              Password Reset Request
            </h2>
            <p className="text-xs text-[#57534E] mt-2">
              Enter your verified administrator email address. We will send a secure reset link to
              verify ownership.
            </p>

            {forgotSent ? (
              <div className="mt-6 border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 text-center space-y-2">
                <p className="font-semibold">Reset Email Dispatched</p>
                <p>
                  Instructions sent to <strong>{forgotEmail}</strong>. Please check your inbox.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForgotModalOpen(false);
                    setForgotSent(false);
                  }}
                  className="mt-2 btn-lux text-[0.65rem] py-2 px-4"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (forgotEmail) setForgotSent(true);
                }}
                className="mt-6 space-y-4"
              >
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="admin@lamkosh.com"
                  className="w-full border border-[#E7E5E4] bg-[#FAF8F5] p-3 text-xs outline-none focus:border-[#6B1D2F]"
                />
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-[#57534E] hover:text-[#1C1917]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#6B1D2F] px-5 py-2 font-sans text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#4D1220]"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
