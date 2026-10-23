import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  Star,
  Package,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  ShoppingBag,
  Loader2,
} from 'lucide-react';
import { useUserReviews } from '@/hooks/useReviews';
import { Review, ReviewStatus } from '@/types/review.types';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

export interface CustomerReviewsTabProps {
  className?: string;
}

type FilterStatus = 'ALL' | ReviewStatus;

export const CustomerReviewsTab: React.FC<CustomerReviewsTabProps> = ({ className }) => {
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<FilterStatus>('ALL');
  const [expandedFeedbackId, setExpandedFeedbackId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useUserReviews(page, 10);

  const reviews = data?.reviews || [];
  const pagination = data?.pagination || { page: 1, limit: 10, totalCount: 0, totalPages: 1 };

  const filteredReviews = reviews.filter((rev) => {
    if (filter === 'ALL') return true;
    return rev.status === filter;
  });

  const toggleFeedback = (reviewId: string) => {
    setExpandedFeedbackId((current) => (current === reviewId ? null : reviewId));
  };

  const getStatusBadge = (status: ReviewStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
            <CheckCircle className="h-3 w-3 text-emerald-600" />
            <span>Live on Store</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-900 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300">
            <Clock className="h-3 w-3 text-amber-600" />
            <span>Pending Review</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300">
            <XCircle className="h-3 w-3 text-rose-600" />
            <span>Rejected</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header & Status Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <h2 className="font-serif text-2xl font-light text-foreground">My Reviews & Ratings</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Track moderation status and feedback on your shared LaMoksh experiences.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { id: 'ALL', label: 'All Reviews' },
            { id: 'APPROVED', label: 'Approved' },
            { id: 'PENDING', label: 'Pending' },
            { id: 'REJECTED', label: 'Rejected' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setFilter(tab.id as FilterStatus);
                setPage(1);
              }}
              className={cn(
                'rounded-full px-3.5 py-1 text-xs font-medium transition-all',
                filter === tab.id
                  ? 'bg-foreground text-background shadow-xs'
                  : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-espresso" />
          <p className="text-xs">Loading your reviews...</p>
        </div>
      ) : isError ? (
        <div className="rounded-sm border border-rose-200 bg-rose-50 p-6 text-center text-xs text-rose-800">
          <AlertTriangle className="mx-auto h-6 w-6 text-rose-600 mb-2" />
          <p className="font-medium">Failed to load reviews.</p>
          <p className="mt-1 text-muted-foreground">
            {(error as any)?.response?.data?.message || 'Please refresh or try again later.'}
          </p>
        </div>
      ) : filteredReviews.length === 0 ? (
        /* Empty State */
        <div className="rounded-sm border border-dashed border-border bg-card/60 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-serif text-lg font-light text-foreground mt-4">
            {filter === 'ALL'
              ? 'No reviews submitted yet'
              : `No ${filter.toLowerCase()} reviews found`}
          </h3>
          <p className="mt-1.5 text-xs text-muted-foreground max-w-sm mx-auto">
            {filter === 'ALL'
              ? 'Share your experience on delivered orders to help fellow connoisseurs and receive LaMoksh benefits.'
              : 'Try selecting a different filter above.'}
          </p>
          <div className="mt-6">
            <Link
              to="/account/orders"
              className="inline-block bg-[#28201C] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FAF8F5] transition-colors hover:bg-black"
            >
              View Delivered Orders
            </Link>
          </div>
        </div>
      ) : (
        /* Review List */
        <div className="space-y-4">
          {filteredReviews.map((rev) => {
            const hasFeedback = Boolean(rev.adminFeedback);
            const isFeedbackOpen = expandedFeedbackId === rev.id;

            let formattedDate = '';
            try {
              if (rev.createdAt) {
                formattedDate = format(parseISO(rev.createdAt), 'dd MMMM yyyy');
              }
            } catch {
              formattedDate = rev.createdAt;
            }

            return (
              <div
                key={rev.id}
                className="rounded-sm border border-border bg-card p-5 shadow-xs transition hover:border-espresso/40 sm:p-6"
              >
                {/* Top: Product Snapshot & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                  <div className="flex items-center gap-3">
                    {rev.product?.media?.[0]?.url ? (
                      <img
                        src={rev.product.media[0].url}
                        alt={rev.product.name}
                        className="h-12 w-10 rounded-[2px] object-cover border border-border/50"
                      />
                    ) : (
                      <div className="flex h-12 w-10 items-center justify-center rounded-[2px] bg-muted">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-sm text-foreground">
                        {rev.product?.name || 'Handcrafted Apparel'}
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        {rev.orderNumber && (
                          <span className="font-mono">Order #{rev.orderNumber} &bull; </span>
                        )}
                        <span>Submitted {formattedDate}</span>
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">{getStatusBadge(rev.status)}</div>
                </div>

                {/* Rating & Review Comment */}
                <div className="pt-4">
                  <div className="flex items-center gap-1.5" aria-label={`Rating: ${rev.rating} of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          'h-4 w-4',
                          star <= rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-muted-foreground/30'
                        )}
                      />
                    ))}
                    <span className="ml-1 text-xs font-semibold text-foreground">
                      {rev.rating}.0
                    </span>
                  </div>

                  <p className="mt-2.5 text-xs text-foreground/90 leading-relaxed whitespace-pre-line sm:text-sm">
                    {rev.comment}
                  </p>
                </div>

                {/* Collapsible Admin Feedback for Rejected or Flagged Reviews */}
                {rev.status === 'REJECTED' && hasFeedback && (
                  <div className="mt-4 border-t border-border/60 pt-3">
                    <button
                      type="button"
                      onClick={() => toggleFeedback(rev.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-700 hover:text-rose-800"
                    >
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>
                        {isFeedbackOpen ? 'Hide Moderator Reason' : 'View Rejection Reason'}
                      </span>
                      {isFeedbackOpen ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>

                    {isFeedbackOpen && (
                      <div className="mt-2 rounded-sm border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-900 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
                        <strong className="block font-semibold">Moderation Feedback:</strong>
                        <p className="mt-1 leading-relaxed">{rev.adminFeedback}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-[2px] border border-border p-2 text-foreground disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-mono text-muted-foreground">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                type="button"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                className="rounded-[2px] border border-border p-2 text-foreground disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
