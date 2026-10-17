import React, { useState } from 'react';
import {
  Star,
  MessageSquare,
  PenLine,
  Loader2,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { useProductReviews, useProductRatingSummary } from '@/hooks/useReviews';
import { RatingBreakdown } from '@/components/reviews/RatingBreakdown';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { WriteReviewModal } from '@/components/reviews/WriteReviewModal';
import { ProductReviewQuery } from '@/types/review.types';
import { cn } from '@/lib/utils';

interface ProductReviewsProps {
  productId: string;
  productName?: string;
  orderId?: string; // Optional if navigated from a specific order
}

export function ProductReviews({
  productId,
  productName = 'Handcrafted Atelier Piece',
  orderId,
}: ProductReviewsProps) {
  const [page, setPage] = useState<number>(1);
  const [selectedRating, setSelectedRating] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<ProductReviewQuery['sortBy']>('newest');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // Queries
  const { data: summaryData, isLoading: isLoadingSummary } = useProductRatingSummary(productId);
  const { data: reviewsData, isLoading: isLoadingReviews, isFetching } = useProductReviews(
    productId,
    {
      page,
      limit: 10,
      rating: selectedRating,
      sortBy,
    }
  );

  const reviews = reviewsData?.reviews || [];
  const pagination = reviewsData?.pagination || { page: 1, limit: 10, totalCount: 0, totalPages: 1 };

  // Fallback summary if loading or empty
  const summary = summaryData || {
    productId,
    productName,
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  const handleRatingFilter = (rating?: number) => {
    setSelectedRating(rating);
    setPage(1);
  };

  return (
    <div className="mt-14 border-t border-[#E7E5E4] pt-8 max-w-4xl mx-auto space-y-6" id="product-reviews-section">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#E7E5E4]/80">
        <div>
          <span className="eyebrow text-[#6B1D2F]">Client Feedback</span>
          <h2 className="display-sm mt-0.5 text-xl sm:text-2xl">Customer Reviews & Ratings</h2>
        </div>

        <button
          type="button"
          onClick={() => setIsWriteModalOpen(true)}
          className="btn-lux text-xs px-4 py-2 self-start sm:self-auto inline-flex items-center gap-1.5 shadow-2xs"
        >
          <PenLine className="h-3.5 w-3.5" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* A. Rating Breakdown Summary Widget (Compact & Refined) */}
      <RatingBreakdown
        summary={summary}
        selectedRating={selectedRating}
        onSelectRating={handleRatingFilter}
        onWriteReview={() => setIsWriteModalOpen(true)}
      />

      {/* Filtering & Sorting Controls Bar (Only shown when there are reviews or an active filter) */}
      {(pagination.totalCount > 0 || selectedRating !== undefined) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E5E4] pb-3 text-xs">
          <div className="flex items-center gap-2 text-[#78716C]">
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#1C1917]" />
            <span>
              Showing <strong className="text-[#1C1917] font-semibold">{reviews.length}</strong> of{' '}
              <strong className="text-[#1C1917] font-semibold">{pagination.totalCount}</strong> reviews
              {selectedRating && (
                <span className="ml-1 text-[#6B1D2F] font-medium">
                  ({selectedRating} stars)
                </span>
              )}
            </span>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="review-sort" className="text-xs text-[#78716C]">
              Sort by:
            </label>
            <select
              id="review-sort"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as ProductReviewQuery['sortBy']);
                setPage(1);
              }}
              className="rounded border border-[#E7E5E4] bg-white px-2.5 py-1 text-xs text-[#1C1917] focus:border-[#6B1D2F] focus:outline-none"
            >
              <option value="newest">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="rating_high">Highest Rated</option>
              <option value="rating_low">Lowest Rated</option>
            </select>
          </div>
        </div>
      )}

      {/* B. Reviews List / Cards */}
      <div className="relative min-h-[100px] space-y-3">
        {isLoadingReviews ? (
          <div className="flex min-h-[140px] flex-col items-center justify-center gap-2 text-[#78716C] text-xs">
            <Loader2 className="h-4 w-4 animate-spin text-[#6B1D2F]" />
            <span>Loading verified customer reviews...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-sm border border-dashed border-[#E7E5E4] bg-[#FAF8F5]/50 p-6 sm:p-8 text-center max-w-2xl mx-auto">
            <MessageSquare className="mx-auto h-6 w-6 text-[#A8A29E] mb-2" />
            <h3 className="font-serif text-base font-normal text-[#1C1917]">
              {selectedRating
                ? `No ${selectedRating}-star reviews found`
                : 'No client reviews yet'}
            </h3>
            <p className="mt-1 text-xs text-[#78716C] max-w-sm mx-auto">
              {selectedRating
                ? 'Try clearing the star filter to view all verified feedback.'
                : 'Be the first to share your experience regarding fit, fabric drape, and hand finishing.'}
            </p>
            {selectedRating ? (
              <button
                type="button"
                onClick={() => setSelectedRating(undefined)}
                className="mt-3 text-xs text-[#6B1D2F] underline hover:opacity-80"
              >
                Show All Reviews
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsWriteModalOpen(true)}
                className="btn-lux text-xs mt-4 px-4 py-1.5 inline-block"
              >
                Write First Review
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              type="button"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded border border-[#E7E5E4] p-1.5 text-[#1C1917] disabled:opacity-40 hover:bg-[#FAF8F5]"
              aria-label="Previous page of reviews"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="font-mono text-xs text-[#78716C]">
              Page {page} of {pagination.totalPages}
            </span>
            <button
              type="button"
              disabled={page >= pagination.totalPages || isFetching}
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              className="rounded border border-[#E7E5E4] p-1.5 text-[#1C1917] disabled:opacity-40 hover:bg-[#FAF8F5]"
              aria-label="Next page of reviews"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* C. Write Review Modal */}
      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        productId={productId}
        orderId={orderId || ''}
        productName={productName}
      />
    </div>
  );
}

export default ProductReviews;
