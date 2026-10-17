import React, { useState } from 'react';
import { Star, CheckCircle, AlertTriangle, ChevronDown, ChevronUp, Package } from 'lucide-react';
import { Review } from '@/types/review.types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow, format, parseISO } from 'date-fns';

export interface ReviewCardProps {
  review: Review;
  showAdminFeedback?: boolean;
  showProductInfo?: boolean;
  className?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  showAdminFeedback = true,
  showProductInfo = false,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const comment = review.comment || '';
  const isLongComment = comment.length > 300;

  // Reviewer Name & Initials
  const reviewerName = review.user?.name || 'Verified Customer';
  const getInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (name[0] || 'V').toUpperCase();
  };

  // Formatted Date
  const formattedDate = (() => {
    try {
      if (!review.createdAt) return '';
      const date = parseISO(review.createdAt);
      // If within 30 days, show relative distance, otherwise formatted date
      const diffDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays < 30) {
        return formatDistanceToNow(date, { addSuffix: true });
      }
      return format(date, 'MMM d, yyyy');
    } catch {
      return '';
    }
  })();

  const isRejected = review.status === 'REJECTED';
  const isPending = review.status === 'PENDING';

  return (
    <article
      className={cn(
        'rounded-sm border border-border bg-card p-5 text-card-foreground shadow-sm transition-all sm:p-6',
        className
      )}
      aria-label={`Review by ${reviewerName} with ${review.rating} out of 5 stars`}
    >
      {/* Product snapshot if enabled */}
      {showProductInfo && (review.product || review.orderNumber) && (
        <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3 text-xs">
          <div className="flex items-center gap-2.5">
            {review.product?.media?.[0]?.url ? (
              <img
                src={review.product.media[0].url}
                alt={review.product.name}
                className="h-10 w-8 rounded-[2px] object-cover border border-border/50"
              />
            ) : (
              <div className="flex h-10 w-8 items-center justify-center rounded-[2px] bg-muted">
                <Package className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <div>
              <p className="font-medium text-foreground">
                {review.product?.name || 'Handcrafted Apparel'}
              </p>
              {review.orderNumber && (
                <p className="text-[11px] text-muted-foreground font-mono">
                  Order #{review.orderNumber}
                </p>
              )}
            </div>
          </div>

          {/* Status Badge */}
          {review.status && (
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                review.status === 'APPROVED' &&
                  'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
                review.status === 'PENDING' &&
                  'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300',
                review.status === 'REJECTED' &&
                  'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              )}
            >
              {review.status === 'APPROVED'
                ? 'Live on Store'
                : review.status === 'PENDING'
                ? 'Pending Review'
                : 'Rejected'}
            </span>
          )}
        </div>
      )}

      {/* Top Header Row: Reviewer Avatar, Name, Badge, Date */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar with Initials */}
          <div
            className="flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full bg-[#28201C] font-mono text-xs font-semibold text-[#FAF8F5] shadow-inner"
            aria-hidden="true"
          >
            {getInitials(reviewerName)}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{reviewerName}</span>

              {/* Verified Buyer Badge */}
              <span className="inline-flex items-center gap-1 rounded-[2px] bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300">
                <CheckCircle className="h-3 w-3 text-emerald-600" aria-hidden="true" />
                <span>Verified Buyer</span>
              </span>
            </div>

            {/* Formatted Date */}
            {formattedDate && (
              <time
                dateTime={review.createdAt}
                className="block text-[11px] text-muted-foreground mt-0.5"
              >
                {formattedDate}
              </time>
            )}
          </div>
        </div>

        {/* Rating Stars */}
        <div
          className="flex items-center gap-1"
          aria-label={`Rating: ${review.rating} out of 5 stars`}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                'h-4 w-4',
                star <= review.rating
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-muted-foreground/30'
              )}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      {/* Review Body Text with Read More toggle */}
      <div className="mt-4 text-xs leading-relaxed text-foreground/90 sm:text-sm">
        <p className="whitespace-pre-line font-sans">
          {isLongComment && !isExpanded ? `${comment.slice(0, 300)}...` : comment}
        </p>

        {isLongComment && (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#6B1D2F] underline hover:opacity-80 focus:outline-none"
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? 'Show less' : 'Read more'}</span>
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Status Warning for Customer Dashboard */}
      {!showProductInfo && (isPending || isRejected) && (
        <div className="mt-3 flex items-center gap-2">
          {isPending && (
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-200">
              Pending Moderation
            </span>
          )}
          {isRejected && (
            <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-800 border border-rose-200">
              Rejected
            </span>
          )}
        </div>
      )}

      {/* Admin Feedback Alert Box (if REJECTED) */}
      {showAdminFeedback && isRejected && review.adminFeedback && (
        <div
          className="mt-4 rounded-sm border border-rose-200 bg-rose-50/80 p-3.5 text-xs text-rose-900 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300"
          role="alert"
        >
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <div>
              <strong className="block font-semibold">Moderation Notice:</strong>
              <p className="mt-0.5 leading-relaxed">{review.adminFeedback}</p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
