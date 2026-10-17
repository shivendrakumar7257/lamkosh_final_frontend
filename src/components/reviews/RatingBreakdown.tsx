import React from 'react';
import { Star, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { ProductRatingSummary } from '@/types/review.types';
import { cn } from '@/lib/utils';

export interface RatingBreakdownProps {
  summary: ProductRatingSummary;
  selectedRating?: number;
  onSelectRating?: (rating?: number) => void;
  className?: string;
  onWriteReview?: () => void;
}

export const RatingBreakdown: React.FC<RatingBreakdownProps> = ({
  summary,
  selectedRating,
  onSelectRating,
  className,
  onWriteReview,
}) => {
  const average = Number(summary?.averageRating || 0);
  const totalReviews = Number(summary?.totalReviews || 0);
  const distribution = summary?.ratingDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  const starLevels: Array<5 | 4 | 3 | 2 | 1> = [5, 4, 3, 2, 1];

  const handleBarClick = (stars: number) => {
    if (!onSelectRating) return;
    if (selectedRating === stars) {
      onSelectRating(undefined);
    } else {
      onSelectRating(stars);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, stars: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleBarClick(stars);
    }
  };

  return (
    <div
      className={cn(
        'rounded-sm border border-[#E7E5E4] bg-[#FAF8F5]/70 p-5 sm:p-6 shadow-xs transition-all max-w-3xl mx-auto',
        className
      )}
      aria-label="Product rating summary and breakdown"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-12 sm:items-center">
        {/* Compact Numerical Average Rating Section */}
        <div className="flex flex-col items-center justify-center text-center sm:col-span-5 sm:border-r sm:border-[#E7E5E4] sm:pr-6">
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#1C1917]">
              {average.toFixed(1)}
            </span>
            <span className="font-sans text-xs font-medium text-[#78716C]">/ 5.0</span>
          </div>

          {/* Star Icons */}
          <div
            className="mt-2 flex items-center gap-1"
            aria-label={`Average rating ${average.toFixed(1)} out of 5 stars`}
          >
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = star <= Math.round(average) && totalReviews > 0;
              return (
                <Star
                  key={star}
                  className={cn(
                    'h-4 w-4 transition-transform duration-200',
                    isFilled
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-[#D6D3D1]'
                  )}
                  aria-hidden="true"
                />
              );
            })}
          </div>

          {/* Total Review Count Badge */}
          <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#E7E5E4] bg-white px-2.5 py-0.5 text-[11px] text-[#78716C] shadow-2xs">
            <CheckCircle2 className="h-3 w-3 text-emerald-700" aria-hidden="true" />
            <span>
              {totalReviews > 0 ? (
                <>
                  Based on{' '}
                  <strong className="font-semibold text-[#1C1917]">
                    {totalReviews.toLocaleString()}
                  </strong>{' '}
                  {totalReviews === 1 ? 'verified review' : 'verified reviews'}
                </>
              ) : (
                'No verified reviews yet'
              )}
            </span>
          </div>

          {selectedRating !== undefined && onSelectRating && (
            <button
              type="button"
              onClick={() => onSelectRating(undefined)}
              className="mt-2 inline-flex items-center gap-1 text-[11px] text-[#6B1D2F] underline hover:opacity-80"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset filter</span>
            </button>
          )}
        </div>

        {/* 5 Compact Progress Bars (5 down to 1 star) */}
        <div className="space-y-1.5 sm:col-span-7">
          <p className="sr-only">Rating breakdown by star levels</p>
          {starLevels.map((stars) => {
            const count = distribution[stars] || 0;
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            const isSelected = selectedRating === stars;
            const isClickable = Boolean(onSelectRating);

            return (
              <div
                key={stars}
                role={isClickable ? 'button' : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onClick={() => isClickable && handleBarClick(stars)}
                onKeyDown={(e) => isClickable && handleKeyDown(e, stars)}
                aria-pressed={isClickable ? isSelected : undefined}
                aria-label={`Filter by ${stars} stars: ${count} reviews (${percentage} percent)`}
                className={cn(
                  'group flex items-center gap-2 rounded px-2 py-0.5 text-xs transition-colors',
                  isClickable && 'cursor-pointer hover:bg-white/80',
                  isSelected && 'bg-amber-100/70 ring-1 ring-amber-300'
                )}
              >
                {/* Star Label */}
                <div className="flex w-10 shrink-0 items-center justify-between font-medium text-[#1C1917] text-[11px]">
                  <span>{stars}</span>
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                </div>

                {/* Compact Progress Bar Track */}
                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-[#E7E5E4]">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500 ease-out',
                      isSelected ? 'bg-amber-500' : 'bg-amber-400 group-hover:bg-amber-500'
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Count & Percentage */}
                <div className="flex w-14 shrink-0 items-center justify-end gap-1 text-right font-mono text-[10px] text-[#78716C]">
                  <span className="font-semibold text-[#1C1917]">{count}</span>
                  <span className="opacity-60">({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RatingBreakdown;
