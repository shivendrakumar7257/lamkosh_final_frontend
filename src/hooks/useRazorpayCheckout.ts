import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  loadRazorpayScript,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getClientRazorpayKeyId,
  VerifyPaymentResponse,
} from "@/services/paymentService";
import {
  RazorpayOptions,
  RazorpaySuccessResponse,
  RazorpayErrorResponse,
} from "@/types/razorpay";

export interface CheckoutCustomerInfo {
  name: string;
  email?: string | null | undefined;
  contact: string;
}

export interface InitiatePaymentParams {
  /**
   * Amount in paise (e.g., ₹500.00 = 50000 paise).
   * Or if `isAmountInRupees` is true, it will be automatically converted to paise.
   */
  amount: number;
  isAmountInRupees?: boolean | undefined;
  currency?: string | undefined;
  receipt?: string | undefined;
  customer: CheckoutCustomerInfo;
  description?: string | undefined;
  themeColor?: string | undefined;
  onSuccess: (
    verifyResult: VerifyPaymentResponse,
    paymentResponse: RazorpaySuccessResponse,
  ) => Promise<void> | void;
  onDismiss?: (() => void) | undefined;
  onError?: ((errorMessage: string) => void) | undefined;
}

export function useRazorpayCheckout() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = useCallback(
    async ({
      amount,
      isAmountInRupees = false,
      currency = "INR",
      receipt,
      customer,
      description = "Order Payment",
      themeColor = "#3399cc",
      onSuccess,
      onDismiss,
      onError,
    }: InitiatePaymentParams) => {
      setError(null);
      setIsProcessing(true);

      try {
        // 1. Ensure Razorpay checkout script is loaded
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded || typeof window === "undefined" || !window.Razorpay) {
          const scriptError =
            "Failed to load Razorpay payment gateway. Please check your internet connection or ad-blocker.";
          toast.error(scriptError);
          setError(scriptError);
          setIsProcessing(false);
          onError?.(scriptError);
          return;
        }

        // 2. Normalize amount to paise
        const amountInPaise = Math.round(isAmountInRupees ? amount * 100 : amount);
        if (amountInPaise <= 0) {
          const invalidAmountError = "Invalid order amount for checkout.";
          toast.error(invalidAmountError);
          setError(invalidAmountError);
          setIsProcessing(false);
          onError?.(invalidAmountError);
          return;
        }

        // 3. Create Razorpay order on backend
        const orderData = await createRazorpayOrder({
          amount: amountInPaise,
          currency,
          receipt,
        });

        // 4. Resolve key: orderData.key_id || process.env.VITE_RAZORPAY_KEY_ID
        const resolvedKey = orderData.key_id || getClientRazorpayKeyId();

        if (orderData.isFallbackMode) {
          toast.info(
            "Backend order route not deployed yet. Opening Razorpay in test checkout mode...",
            { duration: 4000 },
          );
        }

        // 5. Open Razorpay original standard modal with options
        const options: RazorpayOptions = {
          key: resolvedKey,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "Lamkosh",
          description,
          ...(orderData.order_id ? { order_id: orderData.order_id } : {}),
          handler: async function (response: RazorpaySuccessResponse) {
            try {
              // Verify payment with backend signature verification
              const verifyResult = await verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id || "",
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature || "",
              });

              if (verifyResult.success) {
                await onSuccess(verifyResult, response);
              } else {
                const failMsg =
                  verifyResult.message || "Payment signature verification failed.";
                toast.error(failMsg);
                setError(failMsg);
                onError?.(failMsg);
              }
            } catch (verifyErr: any) {
              const msg =
                verifyErr?.response?.data?.message ||
                verifyErr?.message ||
                "Payment verification failed. Please contact support.";
              toast.error(msg);
              setError(msg);
              onError?.(msg);
            } finally {
              setIsProcessing(false);
            }
          },
          prefill: {
            name: customer.name || "",
            email: customer.email || "",
            contact: customer.contact || "",
          },
          theme: {
            color: themeColor,
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              toast.info("Payment was cancelled");
              onDismiss?.();
            },
          },
        };

        const rzp = new window.Razorpay(options);

        rzp.on("payment.failed", function (failResponse: RazorpayErrorResponse) {
          setIsProcessing(false);
          const errDesc =
            failResponse?.error?.description ||
            failResponse?.error?.reason ||
            "Payment failed. Please try again with a different payment method.";
          toast.error(errDesc);
          setError(errDesc);
          onError?.(errDesc);
        });

        rzp.open();
      } catch (err: any) {
        setIsProcessing(false);
        const errMsg =
          err?.response?.data?.message ||
          err?.message ||
          "Could not initialize Razorpay checkout. Please try again.";
        toast.error(errMsg);
        setError(errMsg);
        onError?.(errMsg);
      }
    },
    [],
  );

  return {
    initiatePayment,
    isProcessing,
    error,
  };
}
