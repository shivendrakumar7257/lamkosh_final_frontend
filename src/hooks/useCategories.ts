import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { CategoryService } from "@/services/CategoryService";
import {
  Category,
  CategoryWithProducts,
  CategoriesApiResponse,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  GetCategoriesParams,
  GetCategoryProductsParams,
  CategoryProduct,
} from "@/types/category";

/**
 * Public: Fetch categories list with optional pagination and search
 */
export function useCategories(params?: GetCategoriesParams) {
  return useQuery<CategoriesApiResponse>({
    queryKey: ["categories", params?.page ?? 1, params?.limit ?? 20, params?.search ?? ""],
    queryFn: () => CategoryService.getCategories(params),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Convenience hook that returns categories as a direct Category[] array
 */
export function useCategoriesList(params?: GetCategoriesParams) {
  const query = useCategories(params);
  const categories: Category[] = Array.isArray(query.data)
    ? (query.data as unknown as Category[])
    : Array.isArray(query.data?.categories)
      ? query.data.categories
      : [];
  return {
    ...query,
    categories,
  };
}

/**
 * Public: Fetch a single category by ID with its nested products
 */
export function useCategory(id: string | undefined) {
  return useQuery<CategoryWithProducts>({
    queryKey: ["category", id],
    queryFn: () => {
      if (!id) throw new Error("Category ID is required");
      return CategoryService.getCategoryById(id);
    },
    enabled: Boolean(id),
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Public: Fetch filtered product catalog by category ID and sorting/pagination
 */
export function useCategoryProducts(params: GetCategoryProductsParams) {
  return useQuery<{ products: CategoryProduct[]; meta: any }>({
    queryKey: [
      "categoryProducts",
      params.categoryId,
      params.page ?? 1,
      params.limit ?? 20,
      params.sortBy ?? "createdAt",
      params.sortOrder ?? "desc",
      params.search ?? "",
    ],
    queryFn: () => CategoryService.getProducts(params),
    enabled: Boolean(params.categoryId),
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Admin: Fetch admin categories list with product counts and pagination
 */
export function useAdminCategories(params?: GetCategoriesParams) {
  return useQuery<CategoriesApiResponse>({
    queryKey: ["adminCategories", params?.page ?? 1, params?.limit ?? 20, params?.search ?? ""],
    queryFn: () => CategoryService.getAdminCategories(params),
    staleTime: 30 * 1000, // Fresher data for admin
  });
}

/**
 * Admin: Create a new category
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation<Category, AxiosError<any>, CreateCategoryPayload>({
    mutationFn: (payload: CreateCategoryPayload) => CategoryService.createCategory(payload),
    onSuccess: (newCat) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      toast.success(`Category "${newCat.name}" created successfully.`);
    },
    onError: (err: AxiosError<any>) => {
      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;

      if (status === 409) {
        toast.error(serverMessage || "A category with this name already exists.");
      } else {
        toast.error(serverMessage || err.message || "Failed to create category.");
      }
    },
  });
}

/**
 * Admin: Update an existing category
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation<Category, AxiosError<any>, { id: string; payload: UpdateCategoryPayload }>({
    mutationFn: ({ id, payload }) => CategoryService.updateCategory(id, payload),
    onSuccess: (updatedCat, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      queryClient.invalidateQueries({ queryKey: ["category", variables.id] });
      toast.success(`Category "${updatedCat.name}" updated successfully.`);
    },
    onError: (err: AxiosError<any>) => {
      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;

      if (status === 409) {
        toast.error(serverMessage || "A category with this name already exists.");
      } else {
        toast.error(serverMessage || err.message || "Failed to update category.");
      }
    },
  });
}

/**
 * Admin: Delete a category with 409 assigned products protection
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, AxiosError<any>, string>({
    mutationFn: (id: string) => CategoryService.deleteCategory(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      toast.success(res.message || "Category deleted successfully.");
    },
    onError: (err: AxiosError<any>) => {
      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;

      if (status === 409) {
        toast.error(
          serverMessage ||
            "Category cannot be deleted because products are associated with it. Please reassign or delete the products first.",
          {
            duration: 6000,
          },
        );
      } else {
        toast.error(serverMessage || err.message || "Failed to delete category.");
      }
    },
  });
}
