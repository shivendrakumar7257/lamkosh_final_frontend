import { useState, useEffect } from "react";
import { AlertCircle, Clock, X } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

export function AuthAlerts() {
  const { lockoutMessage, rateLimitMessage, setLockoutMessage, setRateLimitMessage } =
    useAuthStore();
  const [lockoutSeconds, setLockoutSeconds] = useState<number | null>(null);

  // Listen to custom window events triggered from api.ts
  useEffect(() => {
    const handleLockout = (e: Event) => {
      const customEvent = e as CustomEvent<{ message?: string; seconds?: number }>;
      setLockoutMessage(customEvent.detail?.message || "Account locked due to security policy.");
      setLockoutSeconds(customEvent.detail?.seconds || 300); // 5 min default countdown
    };

    const handleRateLimit = (e: Event) => {
      const customEvent = e as CustomEvent<{ message?: string }>;
      setRateLimitMessage(customEvent.detail?.message || "Rate limit exceeded. Please wait.");
    };

    window.addEventListener("auth:lockout", handleLockout);
    window.addEventListener("auth:ratelimit", handleRateLimit);

    return () => {
      window.removeEventListener("auth:lockout", handleLockout);
      window.removeEventListener("auth:ratelimit", handleRateLimit);
    };
  }, [setLockoutMessage, setRateLimitMessage]);

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutSeconds === null || lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev === null || prev <= 1) {
          setLockoutMessage(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds, setLockoutMessage]);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!lockoutMessage && !rateLimitMessage) return null;

  return (
    <div className="w-full">
      {/* 429 Rate Limit Warning Banner */}
      {rateLimitMessage && (
        <div className="relative border-b border-amber-500/30 bg-amber-950/80 px-4 py-3 text-amber-200">
          <div className="container-lux flex items-center justify-between text-xs tracking-wider">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
              <span>
                <strong>Rate Limit Notice:</strong> {rateLimitMessage}
              </span>
            </div>
            <button
              onClick={() => setRateLimitMessage(null)}
              className="p-1 hover:text-amber-100"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* 423 Account Lockout Countdown */}
      {lockoutMessage && (
        <div className="relative border-b border-red-500/40 bg-red-950/90 px-4 py-3 text-red-200">
          <div className="container-lux flex items-center justify-between text-xs tracking-wider">
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 shrink-0 text-red-400" />
              <span>
                <strong>Account Temporarily Locked:</strong> {lockoutMessage}
                {lockoutSeconds !== null && (
                  <span className="ml-2 font-mono font-semibold underline">
                    (Retry in {formatCountdown(lockoutSeconds)})
                  </span>
                )}
              </span>
            </div>
            <button
              onClick={() => setLockoutMessage(null)}
              className="p-1 hover:text-red-100"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
