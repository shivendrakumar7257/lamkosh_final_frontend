import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewApi } from '../services/reviewApi';
import {
  CreateReviewPayload,
  ProductReviewQuery,
  AdminReviewQuery,
  ModerateReviewPayload,
} from '../types/review.types';
import { toast } from 'sonner';

/**
 * Hook to fetch paginated reviews for a specific product
 */
export function useProductReviews(productId: string, query?: ProductReviewQuery) {
  return useQuery({
    queryKey: ['reviews', 'product', productId, query],
    queryFn: () => reviewApi.getProductReviews(productId, query),
    enabled: Boolean(productId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch aggregated rating summary and distribution for a product
 */
export function useProductRatingSummary(productId: string) {
  return useQuery({
    queryKey: ['reviews', 'summary', productId],
    queryFn: () => reviewApi.getProductRatingSummary(productId),
    enabled: Boolean(productId),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Helper to get human-friendly message for specific HTTP status codes
 */
export function getReviewErrorMessage(error: any): string {
  const status = error?.response?.status;
  const backendMsg = error?.response?.data?.message;

  if (status === 400) {
    return backendMsg || 'Reviews can only be submitted once your order is marked DELIVERED.';
  }
  if (status === 401) {
    return 'Please sign in to submit a review.';
  }
  if (status === 403) {
    return backendMsg || 'Access denied. You can only review your own purchases.';
  }
  if (status === 409) {
    return backendMsg || "You've already submitted a review for this purchase.";
  }
  if (status === 422) {
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors) && errors.length > 0) {
      const first = errors[0];
      return typeof first === 'string' ? first : first.message || 'Validation error.';
    }
    return backendMsg || 'Please review the form fields and ensure ratings and comments are valid.';
  }

  return backendMsg || error?.message || 'Failed to submit review.';
}

/**
 * Hook for customers to submit a verified product review
 */
export function useSubmitReview(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => reviewApi.submitReview(payload),
    onSuccess: () => {
      toast.success('Thank you! Your review has been submitted for moderation.');
      queryClient.invalidateQueries({ queryKey: ['reviews', 'product', productId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'summary', productId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'my-reviews'] });
    },
    onError: (error: any) => {
      const msg = getReviewErrorMessage(error);
      toast.error(msg);
    },
  });
}

/**
 * Hook to fetch the currently authenticated customer's submitted reviews
 */
export function useUserReviews(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['reviews', 'my-reviews', page, limit],
    queryFn: () => reviewApi.getMyReviews(page, limit),
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Hook for administrators to fetch reviews for moderation
 */
export function useAdminReviews(query?: AdminReviewQuery) {
  return useQuery({
    queryKey: ['reviews', 'admin', query],
    queryFn: () => reviewApi.getAdminReviews(query),
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Hook to moderate review status (status change + admin feedback)
 */
export function useModerateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ModerateReviewPayload }) =>
      reviewApi.moderateReview(id, payload),
    onSuccess: (data) => {
      toast.success(`Review has been ${data.status.toLowerCase()}`);
      queryClient.invalidateQueries({ queryKey: ['reviews', 'admin'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'product'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'summary'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to moderate review');
    },
  });
}

/**
 * Hook to approve a review
 */
export function useApproveReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => reviewApi.approveReview(reviewId),
    onSuccess: () => {
      toast.success('Review has been approved and is now live on the store.');
      queryClient.invalidateQueries({ queryKey: ['reviews', 'admin'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'product'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'summary'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to approve review');
    },
  });
}

/**
 * Hook to reject a review with optional admin feedback
 */
export function useRejectReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, adminFeedback }: { reviewId: string; adminFeedback?: string }) =>
      reviewApi.rejectReview(reviewId, adminFeedback),
    onSuccess: () => {
      toast.success('Review has been rejected.');
      queryClient.invalidateQueries({ queryKey: ['reviews', 'admin'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'product'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'summary'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to reject review');
    },
  });
}

/**
 * Hook to permanently delete a review
 */
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => reviewApi.deleteReview(reviewId),
    onSuccess: () => {
      toast.success('Review has been permanently deleted.');
      queryClient.invalidateQueries({ queryKey: ['reviews', 'admin'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'product'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'summary'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete review');
    },
  });
}
