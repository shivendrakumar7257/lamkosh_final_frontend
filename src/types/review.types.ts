// Standard API Envelope
export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ field: string; message: string }> | string[];
}

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ReviewUser {
  id: string;
  name: string;
  email?: string;
  mobile?: string;
}

export interface ReviewProduct {
  id: string;
  name: string;
  color?: string;
  media?: Array<{ url: string; type: 'IMAGE' | 'VIDEO' }>;
}

export interface Review {
  id: string;
  userId: string;
  user?: ReviewUser;
  productId: string;
  product?: ReviewProduct;
  orderId: string;
  orderNumber?: string;
  orderStatus?: string;
  rating: number; // 1 to 5
  comment: string;
  status: ReviewStatus;
  adminFeedback?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RatingDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface ProductRatingSummary {
  productId: string;
  productName: string;
  averageRating: number; // e.g. 4.65
  totalReviews: number;
  ratingDistribution: RatingDistribution;
}

export interface ProductReviewsResponse {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
  summary: ProductRatingSummary;
}

export interface CreateReviewPayload {
  productId?: string;
  orderId: string;
  rating: number; // Integer: 1 - 5
  comment: string; // 1 - 2000 chars
}

export interface ModerateReviewPayload {
  status: ReviewStatus;
  adminFeedback?: string;
}

export interface ProductReviewQuery {
  page?: number;
  limit?: number;
  rating?: number; // 1 to 5 filter
  sortBy?: 'newest' | 'oldest' | 'rating_high' | 'rating_low';
}

export interface AdminReviewQuery extends ProductReviewQuery {
  status?: ReviewStatus;
  productId?: string;
  userId?: string;
  orderId?: string;
  search?: string;
}
