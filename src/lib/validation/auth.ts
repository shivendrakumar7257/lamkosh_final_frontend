import { z } from "zod";

/**
 * Regex Definitions
 */
export const INDIAN_MOBILE_REGEX = /^(?:\+91|91)?[6-9]\d{9}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const OTP_REGEX = /^\d{6}$/;

export const PASSWORD_REGEX = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  digit: /[0-9]/,
  special: /[^A-Za-z0-9]/,
};

/**
 * Helper to assess password strength rules
 */
export function checkPasswordStrength(password: string) {
  return {
    minLength: password.length >= 8,
    maxLength: password.length <= 128 && password.length > 0,
    hasUppercase: PASSWORD_REGEX.uppercase.test(password),
    hasLowercase: PASSWORD_REGEX.lowercase.test(password),
    hasDigit: PASSWORD_REGEX.digit.test(password),
    hasSpecial: PASSWORD_REGEX.special.test(password),
  };
}

export function getPasswordScore(password: string): number {
  if (!password) return 0;
  const checks = checkPasswordStrength(password);
  let score = 0;
  if (checks.minLength) score += 20;
  if (password.length >= 12) score += 10;
  if (checks.hasUppercase) score += 20;
  if (checks.hasLowercase) score += 20;
  if (checks.hasDigit) score += 15;
  if (checks.hasSpecial) score += 15;
  return Math.min(100, score);
}

/**
 * Field Validators
 */
export const identifierSchema = z
  .string()
  .trim()
  .min(1, "Please enter your email or mobile number")
  .refine(
    (val) => {
      const cleanVal = val.replace(/\s+/g, "");
      return EMAIL_REGEX.test(cleanVal) || INDIAN_MOBILE_REGEX.test(cleanVal);
    },
    {
      message: "Please enter a valid email address or 10-digit Indian mobile number",
    },
  );

export const mobileSchema = z
  .string()
  .trim()
  .min(1, "Mobile number is required")
  .refine(
    (val) => {
      const cleanVal = val.replace(/\s+/g, "");
      return INDIAN_MOBILE_REGEX.test(cleanVal);
    },
    {
      message: "Please enter a valid 10-digit Indian mobile number starting with 6-9",
    },
  );

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password cannot exceed 128 characters")
  .regex(PASSWORD_REGEX.uppercase, "Password must contain at least 1 uppercase letter")
  .regex(PASSWORD_REGEX.lowercase, "Password must contain at least 1 lowercase letter")
  .regex(PASSWORD_REGEX.digit, "Password must contain at least 1 digit")
  .regex(PASSWORD_REGEX.special, "Password must contain at least 1 special character");

export const otpSchema = z.string().trim().regex(OTP_REGEX, "OTP must be exactly 6 numeric digits");

/**
 * Form Schemas
 */
export const loginSchema = z.object({
  identifier: identifierSchema,
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Full name must be at least 2 characters"),
    email: z.string().trim().email("Please enter a valid email address"),
    mobile: mobileSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  identifier: identifierSchema,
});

export const resetPasswordSchema = z
  .object({
    identifier: identifierSchema.optional(),
    otp: otpSchema,
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  address: z.string().optional().default(""),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"], {
    errorMap: () => ({ message: "Please select a valid gender" }),
  }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
