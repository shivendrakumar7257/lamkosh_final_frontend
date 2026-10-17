import React, { useState, useEffect } from 'react';
import { Star, Loader2, AlertCircle, CheckCircle2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useSubmitReview } from '@/hooks/useReviews';
import { cn } from '@/lib/utils';

export interface WriteReviewModalProps {
  productId: string;
  orderId: string;
  productName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  productId,
  orderId,
  productName,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<{ rating?: string; comment?: string }>({});
  const [alertError, setAlertError] = useState<{
    type: 'warning' | 'error' | 'conflict';
    message: string;
  } | null>(null);

  const submitMutation = useSubmitReview(productId);

  // Reset state when opened or closed
  useEffect(() => {
    if (isOpen) {
      setRating(5);
      setHoverRating(0);
      setComment('');
      setFieldErrors({});
      setAlertError(null);
    }
  }, [isOpen]);

  const activeRating = hoverRating || rating;

  const validateForm = (): boolean => {
    const errors: { rating?: string; comment?: string } = {};

    if (!rating || rating < 1 || rating > 5) {
      errors.rating = 'Please choose a rating between 1 and 5 stars.';
    }

    const trimmedComment = comment.trim();
    if (!trimmedComment) {
      errors.comment = 'Please provide a comment sharing your thoughts.';
    } else if (trimmedComment.length > 2000) {
      errors.comment = 'Your review exceeds the maximum length of 2000 characters.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await submitMutation.mutateAsync({
        productId,
        orderId,
        rating,
        comment: comment.trim(),
      });

      onSuccess?.();
      onClose();
    } catch (err: any) {
      const status = err?.response?.status;
      const backendData = err?.response?.data;
      const backendMsg = backendData?.message;

      if (status === 409) {
        setAlertError({
          type: 'conflict',
          message:
            backendMsg ||
            "You've already submitted a review for this purchase. Multiple reviews per order item are not permitted.",
        });
      } else if (status === 400) {
        setAlertError({
          type: 'warning',
          message:
            backendMsg ||
            'Reviews can only be submitted once your order is marked DELIVERED.',
        });
      } else if (status === 403) {
        setAlertError({
          type: 'error',
          message:
            backendMsg || 'Access denied. You can only review your own purchases.',
        });
      } else if (status === 401) {
        setAlertError({
          type: 'error',
          message: 'Your session has expired. Please sign in to submit your review.',
        });
      } else if (status === 422) {
        const errors = backendData?.errors;
        const newFieldErrors: { rating?: string; comment?: string } = {};

        if (Array.isArray(errors)) {
          errors.forEach((errItem) => {
            if (typeof errItem === 'object' && errItem.field) {
              if (errItem.field === 'rating') newFieldErrors.rating = errItem.message;
              if (errItem.field === 'comment') newFieldErrors.comment = errItem.message;
            }
          });
        }

        setFieldErrors(newFieldErrors);
        setAlertError({
          type: 'error',
          message:
            backendMsg || 'Validation error. Please verify the rating and comment fields.',
        });
      } else {
        setAlertError({
          type: 'error',
          message:
            backendMsg || 'Unable to submit your review right now. Please try again shortly.',
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md border-border bg-background p-6 shadow-xl sm:rounded-sm">
        <DialogHeader className="text-left">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B1D2F]">
            Verified Client Feedback
          </span>
          <DialogTitle className="font-serif text-xl font-light text-foreground sm:text-2xl">
            Review Your Purchase
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground line-clamp-1">
            {productName}
          </DialogDescription>
        </DialogHeader>

        {/* Global Alert Notification (409, 400, 403, 401, 500) */}
        {alertError && (
          <div
            className={cn(
              'mt-3 flex items-start gap-2.5 rounded-sm p-3.5 text-xs',
              alertError.type === 'conflict' &&
                'border border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200',
              alertError.type === 'warning' &&
                'border border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200',
              alertError.type === 'error' &&
                'border border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200'
            )}
            role="alert"
          >
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-current" />
            <div className="leading-relaxed">
              <strong className="block font-semibold">
                {alertError.type === 'conflict'
                  ? 'Duplicate Review'
                  : alertError.type === 'warning'
                  ? 'Order Ineligible'
                  : 'Notice'}
              </strong>
              <span>{alertError.message}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          {/* 5-Star Interactive Rating Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-foreground">
              Overall Rating <span className="text-rose-600">*</span>
            </label>

            <div className="mt-2.5 flex items-center gap-3">
              <div
                className="flex items-center gap-1.5"
                role="radiogroup"
                aria-label="Star rating options"
              >
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const isFilled = starValue <= activeRating;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      role="radio"
                      aria-checked={rating === starValue}
                      aria-label={`${starValue} star - ${RATING_LABELS[starValue]}`}
                      className="group cursor-pointer rounded p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#6B1D2F]"
                      onClick={() => {
                        setRating(starValue);
                        setFieldErrors((prev) => ({ ...prev, rating: undefined }));
                      }}
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star
                        className={cn(
                          'h-6 w-6 transition-colors duration-150',
                          isFilled
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-300 group-hover:text-amber-200 dark:text-stone-700'
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>

              {/* Active Rating Label */}
              <span className="font-serif text-sm font-medium text-foreground">
                {RATING_LABELS[activeRating] || ''}
              </span>
            </div>

            {fieldErrors.rating && (
              <p className="mt-1 text-xs text-rose-600 font-medium" role="alert">
                {fieldErrors.rating}
              </p>
            )}
          </div>

          {/* Review Textarea */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="review-comment"
                className="text-xs font-semibold uppercase tracking-wider text-foreground"
              >
                Your Review <span className="text-rose-600">*</span>
              </label>

              {/* Character Counter */}
              <span
                className={cn(
                  'font-mono text-[11px]',
                  comment.length > 2000
                    ? 'font-bold text-rose-600'
                    : comment.length > 1800
                    ? 'text-amber-600'
                    : 'text-muted-foreground'
                )}
                aria-live="polite"
              >
                {comment.length} / 2000
              </span>
            </div>

            <textarea
              id="review-comment"
              rows={4}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                if (fieldErrors.comment) {
                  setFieldErrors((prev) => ({ ...prev, comment: undefined }));
                }
              }}
              placeholder="Share your experience regarding fabric feel, fit, color, and delivery..."
              className={cn(
                'mt-2 w-full rounded-sm border bg-background p-3 text-xs leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#6B1D2F] sm:text-sm',
                fieldErrors.comment ? 'border-rose-500 ring-1 ring-rose-500' : 'border-border'
              )}
              maxLength={2200}
            />

            {fieldErrors.comment && (
              <p className="mt-1 text-xs text-rose-600 font-medium" role="alert">
                {fieldErrors.comment}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/80">
            <button
              type="button"
              onClick={onClose}
              disabled={submitMutation.isPending}
              className="rounded-sm border border-border px-4 py-2 text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitMutation.isPending || (alertError && alertError.type === 'conflict')}
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#28201C] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#FAF8F5] transition-all hover:bg-black focus:outline-none focus:ring-2 focus:ring-[#6B1D2F] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Review</span>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
