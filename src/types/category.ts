export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
  _count?: {
    products: number;
  };
  // Optional metadata / UI fields
  slug?: string;
  description?: string;
  imageUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface CategoryProductMedia {
  type: 'IMAGE' | 'VIDEO';
  url: string;
  sortOrder: number;
}

export interface CategoryProduct {
  id: string;
  name: string;
  color: string;
  gst: string;
  basePrice: string;
  sellPrice: string;
  stock: number;
  media: CategoryProductMedia[];
  handle?: string;
  title?: string;
  description?: string;
}

export interface CategoryWithProducts extends Category {
  products: CategoryProduct[];
}

export interface CategoryPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoriesApiResponse {
  categories: Category[];
  meta: CategoryPaginationMeta;
}

export interface CategoryDetailApiResponse {
  category: CategoryWithProducts;
}

export interface CreateCategoryPayload {
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryPayload {
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
}

// Backwards compatibility for existing code that uses CreateCategoryDto / UpdateCategoryDto
export type CreateCategoryDto = CreateCategoryPayload;
export type UpdateCategoryDto = Partial<CreateCategoryPayload> & { id?: string };

export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetCategoryProductsParams {
  categoryId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'sellPrice' | 'basePrice' | 'name' | 'stock';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}
