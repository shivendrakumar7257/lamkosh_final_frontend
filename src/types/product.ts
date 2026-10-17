export interface ProductVariant {
  id?: string;
  size: string;
  stock: number;
}

export interface ProductMedia {
  id: string;
  productId?: string;
  url: string;
  storageKey?: string;
  type?: "IMAGE" | "VIDEO" | string;
  isPrimary?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string; // UUID
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string; // UUID
  name: string;
  categoryId: string; // UUID
  category?: Category;
  color: string;
  gst: number;
  description: string;
  basePrice: number;
  sellPrice: number;
  stock: number;
  variants?: ProductVariant[];
  media?: ProductMedia[];
  images?: (ProductMedia | string)[];
  videos?: (ProductMedia | string)[];
  storageKeys?: string[];
  status?: "active" | "draft" | "archived" | string;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "createdAt" | "name" | "sellPrice" | "stock" | "basePrice";
  sortOrder?: "asc" | "desc";
}

export interface ProductPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductListResponse {
  products: Product[];
  meta: ProductPaginationMeta;
}

export interface CreateProductDto {
  name: string;
  categoryId: string;
  color: string;
  gst: number;
  description: string;
  basePrice: number;
  sellPrice: number;
  stock: number;
  variants?: ProductVariant[];
  images: File[];
  videos?: File[];
}

export interface UpdateProductDto {
  name?: string;
  categoryId?: string;
  color?: string;
  gst?: number;
  description?: string;
  basePrice?: number;
  sellPrice?: number;
  stock?: number;
  variants?: ProductVariant[];
  images?: File[];
  videos?: File[];
  removeMediaIds?: string[];
}

export interface ProductReview {
  id: string;
  productId: string;
  userId?: string;
  userName?: string;
  rating: number;
  comment?: string;
  title?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductReviewsResponse {
  reviews: ProductReview[];
  meta: ProductPaginationMeta;
}

export interface ProductRatingSummary {
  averageRating: number;
  totalReviews: number;
  distribution?: Record<string | number, number>;
}

export interface CreateReviewDto {
  rating: number;
  comment: string;
  title?: string;
}
