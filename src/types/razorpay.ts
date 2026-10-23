export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayErrorDetail {
  code: string;
  description: string;
  source: string;
  step: string;
  reason: string;
  metadata?: Record<string, unknown>;
}

export interface RazorpayErrorResponse {
  error: RazorpayErrorDetail;
}

export interface RazorpayPrefill {
  name?: string | undefined;
  email?: string | undefined;
  contact?: string | undefined;
  method?: ("card" | "netbanking" | "wallet" | "emi" | "upi") | undefined;
}

export interface RazorpayTheme {
  color?: string | undefined;
  backdrop_color?: string | undefined;
  hide_topbar?: boolean | undefined;
}

export interface RazorpayModal {
  backdropclose?: boolean | undefined;
  escape?: boolean | undefined;
  handleback?: boolean | undefined;
  confirm_close?: boolean | undefined;
  ondismiss?: (() => void) | undefined;
  animation?: boolean | undefined;
}

export interface RazorpayOptions {
  key: string;
  amount: number; // In paise (e.g. ₹500.00 = 50000 paise)
  currency: string;
  name: string;
  description?: string | undefined;
  image?: string | undefined;
  order_id?: string | undefined;
  handler: (response: RazorpaySuccessResponse) => void | Promise<void>;
  prefill?: RazorpayPrefill | undefined;
  notes?: Record<string, string> | undefined;
  theme?: RazorpayTheme | undefined;
  modal?: RazorpayModal | undefined;
  timeout?: number | undefined;
}

export interface RazorpayInstance {
  open: () => void;
  on: (
    event: "payment.failed",
    handler: (response: RazorpayErrorResponse) => void,
  ) => void;
  close?: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
