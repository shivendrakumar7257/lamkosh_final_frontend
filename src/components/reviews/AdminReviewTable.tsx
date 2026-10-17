import React, { useState } from 'react';
import {
  Star,
  Check,
  X,
  Trash2,
  Search,
  Filter,
  Loader2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Package,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import {
  useAdminReviews,
  useApproveReview,
  useRejectReview,
  useDeleteReview,
} from '@/hooks/useReviews';
import { Review, ReviewStatus, AdminReviewQuery } from '@/types/review.types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

export interface AdminReviewTableProps {
  className?: string;
}

export const AdminReviewTable: React.FC<AdminReviewTableProps> = ({ className }) => {
  // Query parameters state
  const [page, setPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'ALL'>('ALL');
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Rejection Dialog State
  const [rejectingReview, setRejectingReview] = useState<Review | null>(null);
  const [rejectFeedback, setRejectFeedback] = useState<string>('');

  // Deletion Dialog State
  const [deletingReview, setDeletingReview] = useState<Review | null>(null);

  // Queries & Mutations
  const queryParams: AdminReviewQuery = {
    page,
    limit: 10,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    rating: ratingFilter,
    search: searchQuery.trim() || undefined,
  };

  const { data, isLoading, isFetching, error, refetch } = useAdminReviews(queryParams);
  const approveMutation = useApproveReview();
  const rejectMutation = useRejectReview();
  const deleteMutation = useDeleteReview();

  const reviews = data?.reviews || [];
  const pagination = data?.pagination || { page: 1, limit: 10, totalCount: 0, totalPages: 1 };

  // Handlers
  const handleApprove = async (review: Review) => {
    await approveMutation.mutateAsync(review.id);
  };

  const handleOpenRejectDialog = (review: Review) => {
    setRejectingReview(review);
    setRejectFeedback('');
  };

  const handleConfirmReject = async () => {
    if (!rejectingReview) return;
    try {
      await rejectMutation.mutateAsync({
        reviewId: rejectingReview.id,
        adminFeedback: rejectFeedback.trim() || undefined,
      });
      setRejectingReview(null);
      setRejectFeedback('');
    } catch {
      // Error handled by mutation toast
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingReview) return;
    try {
      await deleteMutation.mutateAsync(deletingReview.id);
      setDeletingReview(null);
    } catch {
      // Error handled by mutation toast
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return format(parseISO(dateStr), 'dd MMM yyyy, HH:mm');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Moderation Filter Bar */}
      <div className="rounded-sm border border-[#E7E5E4] bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 border-b lg:border-b-0 pb-3 lg:pb-0 border-[#E7E5E4]">
            {(
              [
                { id: 'ALL', label: 'All Reviews' },
                { id: 'PENDING', label: 'Pending Moderation' },
                { id: 'APPROVED', label: 'Approved & Live' },
                { id: 'REJECTED', label: 'Rejected' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.id);
                  setPage(1);
                }}
                className={cn(
                  'rounded-sm px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors',
                  statusFilter === tab.id
                    ? 'bg-[#28201C] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-[#78716C] hover:bg-[#F5F2EC] hover:text-[#1C1917]'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Rating Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[220px] flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#78716C]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search reviewer, product, order..."
                className="w-full rounded-sm border border-[#E7E5E4] bg-[#FAF8F5] py-1.5 pl-8 pr-3 text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:border-[#6B1D2F] focus:outline-none"
              />
            </div>

            {/* Rating Filter Dropdown */}
            <select
              value={ratingFilter === undefined ? '' : ratingFilter}
              onChange={(e) => {
                const val = e.target.value;
                setRatingFilter(val === '' ? undefined : Number(val));
                setPage(1);
              }}
              className="rounded-sm border border-[#E7E5E4] bg-[#FAF8F5] px-3 py-1.5 text-xs text-[#1C1917] focus:border-[#6B1D2F] focus:outline-none"
              aria-label="Filter reviews by rating"
            >
              <option value="">All Star Ratings</option>
              <option value="5">5 Stars (Excellent)</option>
              <option value="4">4 Stars (Very Good)</option>
              <option value="3">3 Stars (Good)</option>
              <option value="2">2 Stars (Fair)</option>
              <option value="1">1 Star (Poor)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative overflow-hidden rounded-sm border border-[#E7E5E4] bg-white shadow-xs">
        {/* Loading Overlay */}
        {(isLoading || isFetching) && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
            <Loader2 className="h-6 w-6 animate-spin text-[#6B1D2F]" />
          </div>
        )}

        {/* Table View */}
        {reviews.length === 0 && !isLoading ? (
          <div className="p-12 text-center text-xs text-[#78716C]">
            <MessageSquare className="mx-auto h-8 w-8 text-[#A8A29E] mb-2" />
            <p className="font-semibold text-sm text-[#1C1917]">No reviews found</p>
            <p className="mt-1">Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E7E5E4] bg-[#FAF8F5] text-[11px] font-semibold uppercase tracking-wider text-[#78716C]">
                <tr>
                  <th scope="col" className="px-4 py-3.5">
                    Customer
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Product & Order
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Rating & Review
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Date
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E7E5E4]">
                {reviews.map((rev) => {
                  const isPendingAction =
                    approveMutation.isPending || rejectMutation.isPending || deleteMutation.isPending;

                  return (
                    <tr
                      key={rev.id}
                      className="transition-colors hover:bg-[#FAF8F5]/80"
                    >
                      {/* Customer Info */}
                      <td className="px-4 py-4 align-top">
                        <div className="font-medium text-[#1C1917]">
                          {rev.user?.name || 'Verified Buyer'}
                        </div>
                        {rev.user?.email && (
                          <div className="text-[11px] text-[#78716C]">{rev.user.email}</div>
                        )}
                        {rev.user?.mobile && (
                          <div className="text-[10px] text-[#A8A29E] font-mono">
                            {rev.user.mobile}
                          </div>
                        )}
                      </td>

                      {/* Product & Order */}
                      <td className="px-4 py-4 align-top">
                        <div className="font-medium text-[#6B1D2F] line-clamp-1">
                          {rev.product?.name || 'Item'}
                        </div>
                        {rev.orderNumber && (
                          <div className="text-[11px] font-mono text-[#78716C]">
                            Order #{rev.orderNumber}
                          </div>
                        )}
                        {rev.orderStatus && (
                          <span className="inline-block mt-0.5 text-[10px] uppercase text-[#78716C] bg-[#FAF8F5] px-1.5 py-0.5 rounded-[2px] border border-[#E7E5E4]">
                            {rev.orderStatus}
                          </span>
                        )}
                      </td>

                      {/* Rating & Review Comment */}
                      <td className="px-4 py-4 align-top max-w-sm">
                        <div className="flex items-center gap-1 text-amber-500 mb-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                'h-3.5 w-3.5',
                                star <= rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-stone-300'
                              )}
                            />
                          ))}
                          <span className="ml-1 text-[11px] font-semibold text-[#1C1917]">
                            {rev.rating}.0
                          </span>
                        </div>

                        <p className="text-xs text-[#57534E] leading-relaxed line-clamp-3">
                          "{rev.comment}"
                        </p>

                        {/* Admin Feedback note if present */}
                        {rev.adminFeedback && (
                          <div className="mt-2 text-[11px] text-rose-700 bg-rose-50 p-2 rounded-[2px] border border-rose-200">
                            <strong>Note:</strong> {rev.adminFeedback}
                          </div>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-4 align-top whitespace-nowrap">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                            rev.status === 'APPROVED' &&
                              'bg-emerald-100 text-emerald-800 border border-emerald-200',
                            rev.status === 'PENDING' &&
                              'bg-amber-100 text-amber-900 border border-amber-200',
                            rev.status === 'REJECTED' &&
                              'bg-rose-100 text-rose-800 border border-rose-200'
                          )}
                        >
                          {rev.status === 'APPROVED'
                            ? 'Approved'
                            : rev.status === 'PENDING'
                            ? 'Pending'
                            : 'Rejected'}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4 align-top whitespace-nowrap text-[#78716C] text-[11px]">
                        {formatDate(rev.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 align-top text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Approve Button */}
                          {rev.status !== 'APPROVED' && (
                            <button
                              type="button"
                              title="Approve Review"
                              aria-label="Approve Review"
                              disabled={isPendingAction}
                              onClick={() => handleApprove(rev)}
                              className="rounded-sm bg-emerald-50 p-1.5 text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-40"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}

                          {/* Reject Button */}
                          {rev.status !== 'REJECTED' && (
                            <button
                              type="button"
                              title="Reject Review"
                              aria-label="Reject Review"
                              disabled={isPendingAction}
                              onClick={() => handleOpenRejectDialog(rev)}
                              className="rounded-sm bg-rose-50 p-1.5 text-rose-700 transition hover:bg-rose-100 disabled:opacity-40"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}

                          {/* Delete Button */}
                          <button
                            type="button"
                            title="Delete Review"
                            aria-label="Delete Review"
                            disabled={isPendingAction}
                            onClick={() => setDeletingReview(rev)}
                            className="rounded-sm bg-[#FAF8F5] p-1.5 text-[#78716C] transition hover:bg-rose-50 hover:text-rose-700 disabled:opacity-40"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E7E5E4] px-4 py-3 bg-[#FAF8F5] text-xs">
            <span className="text-[#78716C]">
              Showing <span className="font-semibold text-[#1C1917]">{reviews.length}</span> of{' '}
              <span className="font-semibold text-[#1C1917]">{pagination.totalCount}</span> reviews
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-sm border border-[#E7E5E4] bg-white p-1.5 text-[#1C1917] disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="font-mono text-xs text-[#78716C]">
                Page {page} of {pagination.totalPages}
              </span>

              <button
                type="button"
                disabled={page >= pagination.totalPages || isLoading}
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                className="rounded-sm border border-[#E7E5E4] bg-white p-1.5 text-[#1C1917] disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Rejection Dialog with Optional Admin Feedback */}
      <Dialog
        open={Boolean(rejectingReview)}
        onOpenChange={(open) => !open && setRejectingReview(null)}
      >
        <DialogContent className="max-w-md border-[#E7E5E4] bg-white p-6 sm:rounded-sm">
          <DialogHeader className="text-left">
            <DialogTitle className="font-serif text-lg font-light text-[#1C1917]">
              Reject Product Review
            </DialogTitle>
            <DialogDescription className="text-xs text-[#78716C]">
              Explain the reason for rejecting this review. The customer will see this message in
              their account moderation dashboard.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-3">
            <div className="rounded-sm bg-[#FAF8F5] p-3 text-xs text-[#57534E] italic border border-[#E7E5E4]">
              "{rejectingReview?.comment}"
            </div>

            <div>
              <label
                htmlFor="reject-feedback"
                className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]"
              >
                Admin Feedback (Optional)
              </label>
              <textarea
                id="reject-feedback"
                rows={3}
                value={rejectFeedback}
                onChange={(e) => setRejectFeedback(e.target.value)}
                placeholder="e.g. Inappropriate language, mentions unrelated logistical issues, or lacks authentic purchase details..."
                className="mt-1.5 w-full rounded-sm border border-[#E7E5E4] bg-white p-2.5 text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:border-[#6B1D2F] focus:outline-none"
              />
            </div>
          </div>

          <DialogFooter className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setRejectingReview(null)}
              disabled={rejectMutation.isPending}
              className="rounded-sm border border-[#E7E5E4] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#1C1917] hover:bg-[#FAF8F5]"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={rejectMutation.isPending}
              onClick={handleConfirmReject}
              className="inline-flex items-center gap-1.5 rounded-sm bg-rose-700 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-rose-800 disabled:opacity-50"
            >
              {rejectMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Rejecting...</span>
                </>
              ) : (
                <span>Confirm Rejection</span>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog
        open={Boolean(deletingReview)}
        onOpenChange={(open) => !open && setDeletingReview(null)}
      >
        <AlertDialogContent className="max-w-md border-[#E7E5E4] bg-white p-6 sm:rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-lg font-light text-[#1C1917]">
              Permanently Delete Review?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-[#78716C] leading-relaxed">
              This action cannot be undone. The review and its historical rating impact will be
              permanently removed from the database and storefront.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex gap-2">
            <AlertDialogCancel
              disabled={deleteMutation.isPending}
              className="rounded-sm border-[#E7E5E4] text-xs uppercase"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteMutation.isPending}
              onClick={handleConfirmDelete}
              className="rounded-sm bg-rose-700 text-xs uppercase text-white hover:bg-rose-800"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Permanently'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
