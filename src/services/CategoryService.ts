import { apiClient, ApiResponse } from "@/api/apiClient";
import {
  Category,
  CategoryWithProducts,
  CategoriesApiResponse,
  CategoryDetailApiResponse,
  CategoryPaginationMeta,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  GetCategoriesParams,
  GetCategoryProductsParams,
  CategoryProduct,
} from "@/types/category";

export interface ProductsApiResponse {
  products: CategoryProduct[];
  meta: CategoryPaginationMeta;
}

export const CategoryService = {
  /**
   * Public: Get paginated/searchable categories
   * GET /categories?page=1&limit=20&search=
   */
  async getCategories(params?: GetCategoriesParams): Promise<CategoriesApiResponse> {
    const res = await apiClient.get<ApiResponse<any>>("/categories", {
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 20,
        search: params?.search ?? undefined,
      },
    });

    const payload = res.data?.data;

    // Handle standard envelope { categories: Category[], meta: PaginationMeta }
    if (payload && Array.isArray(payload.categories)) {
      return {
        categories: payload.categories,
        meta: payload.meta || {
          total: payload.categories.length,
          page: params?.page ?? 1,
          limit: params?.limit ?? 20,
          totalPages: Math.ceil(payload.categories.length / (params?.limit ?? 20)) || 1,
        },
      };
    }

    // Direct array fallback
    if (Array.isArray(payload)) {
      return {
        categories: payload,
        meta: {
          total: payload.length,
          page: params?.page ?? 1,
          limit: params?.limit ?? 20,
          totalPages: 1,
        },
      };
    }

    return {
      categories: [],
      meta: {
        total: 0,
        page: params?.page ?? 1,
        limit: params?.limit ?? 20,
        totalPages: 0,
      },
    };
  },

  /**
   * Public: Get category by ID with nested products
   * GET /categories/:id
   */
  async getCategoryById(id: string): Promise<CategoryWithProducts> {
    const res = await apiClient.get<ApiResponse<any>>(`/categories/${id}`);
    const payload = res.data?.data;

    if (payload?.category) {
      return payload.category as CategoryWithProducts;
    }

    if (payload && payload.id) {
      return payload as CategoryWithProducts;
    }

    throw new Error(res.data?.message || "Category not found");
  },

  /**
   * Public: Get filtered products catalog for category
   * GET /products?categoryId=:id&page=1&limit=20&sortBy=createdAt&sortOrder=desc
   */
  async getProducts(params: GetCategoryProductsParams): Promise<ProductsApiResponse> {
    const res = await apiClient.get<ApiResponse<any>>("/products", {
      params: {
        categoryId: params.categoryId,
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        sortBy: params.sortBy ?? "createdAt",
        sortOrder: params.sortOrder ?? "desc",
        search: params.search,
      },
    });

    const payload = res.data?.data;

    if (payload && Array.isArray(payload.products)) {
      return {
        products: payload.products,
        meta: payload.meta || {
          total: payload.products.length,
          page: params.page ?? 1,
          limit: params.limit ?? 20,
          totalPages: Math.ceil(payload.products.length / (params.limit ?? 20)) || 1,
        },
      };
    }

    if (Array.isArray(payload)) {
      return {
        products: payload,
        meta: {
          total: payload.length,
          page: params.page ?? 1,
          limit: params.limit ?? 20,
          totalPages: 1,
        },
      };
    }

    return {
      products: [],
      meta: {
        total: 0,
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        totalPages: 0,
      },
    };
  },

  /**
   * Admin: Get categories with product counts
   * GET /admin/categories?page=1&limit=20&search=
   */
  async getAdminCategories(params?: GetCategoriesParams): Promise<CategoriesApiResponse> {
    const res = await apiClient.get<ApiResponse<any>>("/admin/categories", {
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 20,
        search: params?.search ?? undefined,
      },
    });

    const payload = res.data?.data;

    if (payload && Array.isArray(payload.categories)) {
      return {
        categories: payload.categories,
        meta: payload.meta || {
          total: payload.categories.length,
          page: params?.page ?? 1,
          limit: params?.limit ?? 20,
          totalPages: Math.ceil(payload.categories.length / (params?.limit ?? 20)) || 1,
        },
      };
    }

    if (Array.isArray(payload)) {
      return {
        categories: payload,
        meta: {
          total: payload.length,
          page: params?.page ?? 1,
          limit: params?.limit ?? 20,
          totalPages: 1,
        },
      };
    }

    return {
      categories: [],
      meta: {
        total: 0,
        page: params?.page ?? 1,
        limit: params?.limit ?? 20,
        totalPages: 0,
      },
    };
  },

  /**
   * Admin: Create category
   * POST /admin/categories -> Body: { name: string }
   */
  async createCategory(payload: CreateCategoryPayload): Promise<Category> {
    const res = await apiClient.post<ApiResponse<any>>("/admin/categories", {
      name: payload.name.trim(),
    });

    const data = res.data?.data;
    return (data?.category || data) as Category;
  },

  /**
   * Admin: Update category
   * PUT /admin/categories/:id -> Body: { name: string }
   */
  async updateCategory(id: string, payload: UpdateCategoryPayload): Promise<Category> {
    const res = await apiClient.put<ApiResponse<any>>(`/admin/categories/${id}`, {
      name: payload.name.trim(),
    });

    const data = res.data?.data;
    return (data?.category || data) as Category;
  },

  /**
   * Admin: Delete category
   * DELETE /admin/categories/:id
   */
  async deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.delete<ApiResponse<any>>(`/admin/categories/${id}`);
    return {
      success: res.data?.success ?? true,
      message: res.data?.message || "Category deleted successfully",
    };
  },
};

export default CategoryService;
