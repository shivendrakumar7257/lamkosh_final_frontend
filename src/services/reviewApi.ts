import axios from 'axios';
import {
  ApiResponse,
  ProductReviewsResponse,
  ProductRatingSummary,
  Review,
  CreateReviewPayload,
  ProductReviewQuery,
  AdminReviewQuery,
  ModerateReviewPayload,
} from '../types/review.types';

import { BASE_URL, apiClient } from '@/api/apiClient';

export const API = apiClient;

// Attach JWT access token dynamically
API.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    let token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    
    // If not found in primary customer tokens, check admin session
    if (!token) {
      try {
        const adminSessionRaw =
          sessionStorage.getItem('manmayi_admin_session') ||
          localStorage.getItem('manmayi_admin_session');
        if (adminSessionRaw) {
          const parsed = JSON.parse(adminSessionRaw);
          if (parsed?.token) {
            token = parsed.token;
          }
        }
      } catch {
        // Fallback silently if malformed
      }
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const reviewApi = {
  // --- Public APIs ---
  getProductReviews: async (productId: string, params?: ProductReviewQuery): Promise<ProductReviewsResponse> => {
    const res = await API.get<ApiResponse<ProductReviewsResponse>>(
      `/products/${productId}/reviews`,
      { params }
    );
    return res.data.data;
  },

  getProductRatingSummary: async (productId: string): Promise<ProductRatingSummary> => {
    const res = await API.get<ApiResponse<ProductRatingSummary>>(
      `/products/${productId}/reviews/summary`
    );
    return res.data.data;
  },

  getReviewById: async (id: string): Promise<Review> => {
    const res = await API.get<ApiResponse<{ review: Review }>>(`/reviews/${id}`);
    return res.data.data.review;
  },

  // --- Customer Authenticated APIs ---
  submitReview: async (payload: CreateReviewPayload): Promise<Review> => {
    const res = await API.post<ApiResponse<{ review: Review }>>('/reviews', payload);
    return res.data.data.review;
  },

  getMyReviews: async (
    page = 1,
    limit = 10
  ): Promise<{
    reviews: Review[];
    pagination: { page: number; limit: number; totalCount: number; totalPages: number };
  }> => {
    const res = await API.get<
      ApiResponse<{
        reviews: Review[];
        pagination: { page: number; limit: number; totalCount: number; totalPages: number };
      }>
    >('/reviews/my-reviews', { params: { page, limit } });
    return res.data.data;
  },

  // --- Admin Moderation APIs ---
  getAdminReviews: async (
    params?: AdminReviewQuery
  ): Promise<{
    reviews: Review[];
    pagination: { page: number; limit: number; totalCount: number; totalPages: number };
  }> => {
    const res = await API.get<
      ApiResponse<{
        reviews: Review[];
        pagination: { page: number; limit: number; totalCount: number; totalPages: number };
      }>
    >('/admin/reviews', { params });
    return res.data.data;
  },

  approveReview: async (reviewId: string): Promise<Review> => {
    const res = await API.patch<ApiResponse<{ review: Review }>>(
      `/admin/reviews/${reviewId}/approve`
    );
    return res.data.data.review;
  },

  rejectReview: async (reviewId: string, adminFeedback?: string): Promise<Review> => {
    const res = await API.patch<ApiResponse<{ review: Review }>>(
      `/admin/reviews/${reviewId}/reject`,
      { adminFeedback }
    );
    return res.data.data.review;
  },

  moderateReview: async (reviewId: string, payload: ModerateReviewPayload): Promise<Review> => {
    const res = await API.patch<ApiResponse<{ review: Review }>>(
      `/admin/reviews/${reviewId}/status`,
      payload
    );
    return res.data.data.review;
  },

  deleteReview: async (reviewId: string): Promise<{ id: string }> => {
    const res = await API.delete<ApiResponse<{ id: string }>>(`/admin/reviews/${reviewId}`);
    return res.data.data;
  },
};
