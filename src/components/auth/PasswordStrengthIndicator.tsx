import { checkPasswordStrength, getPasswordScore } from "@/lib/validation/auth";
import { Check, X } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const checks = checkPasswordStrength(password);
  const score = getPasswordScore(password);

  const getStrengthLabel = () => {
    if (score < 40) return { label: "Weak", color: "bg-red-500", text: "text-red-400" };
    if (score < 75) return { label: "Moderate", color: "bg-amber-500", text: "text-amber-400" };
    return { label: "Strong", color: "bg-emerald-500", text: "text-emerald-400" };
  };

  const strength = getStrengthLabel();

  const rules = [
    { label: "8+ characters", met: checks.minLength },
    { label: "Uppercase letter (A-Z)", met: checks.hasUppercase },
    { label: "Lowercase letter (a-z)", met: checks.hasLowercase },
    { label: "Number (0-9)", met: checks.hasDigit },
    { label: "Special character (!@#$)", met: checks.hasSpecial },
  ];

  return (
    <div className="mt-2 space-y-2.5 rounded-[2px] border border-ivory/10 bg-ivory/5 p-3 text-xs">
      {/* Strength progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-wider text-ivory/70">
          <span>Security Strength</span>
          <span className={strength.text}>{strength.label}</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-ivory/20">
          <div
            className={`h-full transition-all duration-300 ${strength.color}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Rules list */}
      <div className="grid grid-cols-1 gap-1.5 pt-1 sm:grid-cols-2">
        {rules.map((rule) => (
          <div
            key={rule.label}
            className={`flex items-center gap-1.5 text-[0.7rem] transition-colors ${
              rule.met ? "text-emerald-300 font-medium" : "text-ivory/50"
            }`}
          >
            {rule.met ? (
              <Check className="h-3 w-3 shrink-0 text-emerald-400" />
            ) : (
              <X className="h-3 w-3 shrink-0 text-ivory/40" />
            )}
            <span>{rule.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
