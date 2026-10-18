import { api, ApiResponse } from "@/lib/api";
import {
  Product,
  ProductListResponse,
  ProductFilterParams,
  CreateProductDto,
  UpdateProductDto,
  ProductReview,
  ProductReviewsResponse,
  ProductRatingSummary,
  CreateReviewDto,
} from "@/types/product";

/**
 * Helper to build multipart/form-data for Create and Update Product requests
 */
function buildProductFormData(dto: CreateProductDto | UpdateProductDto): FormData {
  const formData = new FormData();

  if (dto.name !== undefined) formData.append("name", dto.name);
  if (dto.categoryId !== undefined) formData.append("categoryId", dto.categoryId);
  if (dto.color !== undefined) formData.append("color", dto.color);
  if (dto.gst !== undefined) formData.append("gst", String(dto.gst));
  if (dto.description !== undefined) formData.append("description", dto.description);
  if (dto.basePrice !== undefined) formData.append("basePrice", String(dto.basePrice));
  if (dto.sellPrice !== undefined) formData.append("sellPrice", String(dto.sellPrice));
  if (dto.stock !== undefined) formData.append("stock", String(dto.stock));

  // In multipart/form-data, variants must be sent as a valid JSON string: e.g. '[{"size":"M","stock":10}]'
  if (dto.variants !== undefined) {
    formData.append("variants", JSON.stringify(dto.variants));
  }

  // Mandatory 1-5 image files
  if (dto.images && dto.images.length > 0) {
    dto.images.forEach((file) => {
      formData.append("images", file);
    });
  }

  // Up to 2 video files
  if (dto.videos && dto.videos.length > 0) {
    dto.videos.forEach((file) => {
      formData.append("videos", file);
    });
  }

  if ("removeMediaIds" in dto && dto.removeMediaIds && dto.removeMediaIds.length > 0) {
    formData.append("removeMediaIds", JSON.stringify(dto.removeMediaIds));
  }

  return formData;
}

export const ProductApi = {
  // ==========================================
  // A. Admin Product Management (Protected)
  // ==========================================

  /**
   * POST /api/v1/admin/products
   * Create a new product with images/videos & variants
   * Content-Type: multipart/form-data
   */
  createProduct: async (dto: CreateProductDto): Promise<Product> => {
    const formData = buildProductFormData(dto);
    const res = await api.post<ApiResponse<any>>("/admin/products", formData);
    const payload = res.data?.data;
    return (payload?.product || payload) as Product;
  },

  /**
   * GET /api/v1/admin/products
   * List all products with admin details, filters, and pagination
   */
  getAdminProducts: async (params?: ProductFilterParams): Promise<ProductListResponse> => {
    const res = await api.get<ApiResponse<any>>("/admin/products", { params });
    const payload = res.data?.data ?? res.data;
    const productsList =
      Array.isArray(payload?.products)
        ? payload.products
        : Array.isArray(res.data?.products)
          ? res.data.products
          : Array.isArray(payload)
            ? payload
            : Array.isArray(res.data)
              ? res.data
              : [];

    const meta =
      payload?.meta ||
      res.data?.meta || {
        total: productsList.length,
        page: params?.page || 1,
        limit: params?.limit || (productsList.length || 20),
        totalPages: Math.ceil(productsList.length / (params?.limit || 20)) || 1,
      };

    return {
      products: productsList,
      meta,
    };
  },

  /**
   * GET /api/v1/admin/products/:id
   * Get single product by UUID (includes storage keys)
   */
  getAdminProductById: async (id: string): Promise<Product> => {
    const res = await api.get<ApiResponse<any>>(`/admin/products/${id}`);
    const payload = res.data?.data ?? res.data;
    return (payload?.product || payload) as Product;
  },

  /**
   * PUT /api/v1/admin/products/:id
   * Update product details, replace variants, add/remove media
   * Content-Type: multipart/form-data
   */
  updateProduct: async (id: string, dto: UpdateProductDto): Promise<Product> => {
    const formData = buildProductFormData(dto);
    const res = await api.put<ApiResponse<any>>(`/admin/products/${id}`, formData);
    const payload = res.data?.data ?? res.data;
    return (payload?.product || payload) as Product;
  },

  /**
   * DELETE /api/v1/admin/products/:id
   * Delete product, variants, DB media, and stored files
   */
  deleteProduct: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<any>>(`/admin/products/${id}`);
  },

  // ==========================================
  // B. Public / Customer Endpoints (Open Access)
  // ==========================================

  /**
   * GET /api/v1/products
   * Browse & search published products with pagination
   */
  getPublicProducts: async (params?: ProductFilterParams): Promise<ProductListResponse> => {
    const res = await api.get<ApiResponse<any>>("/products", { params });
    const payload = res.data?.data ?? res.data;
    const productsList =
      Array.isArray(payload?.products)
        ? payload.products
        : Array.isArray(res.data?.products)
          ? res.data.products
          : Array.isArray(payload)
            ? payload
            : Array.isArray(res.data)
              ? res.data
              : [];

    const meta =
      payload?.meta ||
      res.data?.meta || {
        total: productsList.length,
        page: params?.page || 1,
        limit: params?.limit || (productsList.length || 20),
        totalPages: Math.ceil(productsList.length / (params?.limit || 20)) || 1,
      };

    return {
      products: productsList,
      meta,
    };
  },

  /**
   * GET /api/v1/products/:id
   * Get public product details by UUID
   */
  getPublicProductById: async (id: string): Promise<Product> => {
    const res = await api.get<ApiResponse<any>>(`/products/${id}`);
    const payload = res.data?.data;
    return (payload?.product || payload) as Product;
  },

  /**
   * GET /api/v1/products/:productId/reviews
   * Get public reviews for a product (paginated & filtered)
   */
  getProductReviews: async (
    productId: string,
    params?: { page?: number; limit?: number; rating?: number },
  ): Promise<ProductReviewsResponse> => {
    const res = await api.get<ApiResponse<any>>(`/products/${productId}/reviews`, { params });
    const payload = res.data?.data;
    if (payload?.reviews && payload?.meta) {
      return payload as ProductReviewsResponse;
    }
    if (Array.isArray(payload)) {
      return {
        reviews: payload,
        meta: {
          total: payload.length,
          page: params?.page || 1,
          limit: params?.limit || payload.length,
          totalPages: 1,
        },
      };
    }
    return {
      reviews: payload?.reviews || [],
      meta: payload?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 },
    };
  },

  /**
   * GET /api/v1/products/:productId/ratings
   * Get product rating summary & distribution
   */
  getProductRatings: async (productId: string): Promise<ProductRatingSummary> => {
    const res = await api.get<ApiResponse<any>>(`/products/${productId}/ratings`);
    const payload = res.data?.data;
    return (payload?.ratings || payload) as ProductRatingSummary;
  },

  /**
   * GET /api/v1/products/:productId/reviews/summary
   * Alias for rating summary
   */
  getProductReviewsSummary: async (productId: string): Promise<ProductRatingSummary> => {
    const res = await api.get<ApiResponse<any>>(`/products/${productId}/reviews/summary`);
    const payload = res.data?.data;
    return (payload?.summary || payload) as ProductRatingSummary;
  },

  /**
   * POST /api/v1/products/:productId/reviews
   * Submit product review (Requires customer auth token)
   * Content-Type: application/json
   */
  submitProductReview: async (
    productId: string,
    review: CreateReviewDto,
  ): Promise<ProductReview> => {
    const res = await api.post<ApiResponse<any>>(`/products/${productId}/reviews`, review);
    const payload = res.data?.data;
    return (payload?.review || payload) as ProductReview;
  },
};
