import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductApi } from "@/lib/api/product.api";
import {
  ProductFilterParams,
  CreateProductDto,
  UpdateProductDto,
  CreateReviewDto,
} from "@/types/product";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api";

// ==========================================
// Public Customer Hooks
// ==========================================

export function usePublicProducts(params?: ProductFilterParams) {
  return useQuery({
    queryKey: ["public-products", params],
    queryFn: () => ProductApi.getPublicProducts(params),
    staleTime: 2 * 60 * 1000,
  });
}

export function usePublicProduct(id: string) {
  return useQuery({
    queryKey: ["public-product", id],
    queryFn: () => ProductApi.getPublicProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductReviews(
  productId: string,
  params?: { page?: number; limit?: number; rating?: number },
) {
  return useQuery({
    queryKey: ["product-reviews", productId, params],
    queryFn: () => ProductApi.getProductReviews(productId, params),
    enabled: !!productId,
  });
}

export function useProductRatings(productId: string) {
  return useQuery({
    queryKey: ["product-ratings", productId],
    queryFn: () => ProductApi.getProductRatings(productId),
    enabled: !!productId,
  });
}

export function useProductReviewsSummary(productId: string) {
  return useQuery({
    queryKey: ["product-reviews-summary", productId],
    queryFn: () => ProductApi.getProductReviewsSummary(productId),
    enabled: !!productId,
  });
}

export function useSubmitProductReview(productId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { productId?: string; review: CreateReviewDto }) => {
      const pid = args.productId || productId;
      if (!pid) throw new Error("Product ID is required to submit review");
      return ProductApi.submitProductReview(pid, args.review);
    },
    onSuccess: (_, variables) => {
      const pid = variables.productId || productId;
      queryClient.invalidateQueries({ queryKey: ["product-reviews", pid] });
      queryClient.invalidateQueries({ queryKey: ["product-ratings", pid] });
      queryClient.invalidateQueries({ queryKey: ["product-reviews-summary", pid] });
      toast.success("Your review has been submitted successfully");
    },
    onError: (err: any) => {
      toast.error(getErrorMessage(err, "Failed to submit review"));
    },
  });
}

// ==========================================
// Admin Product Management Hooks
// ==========================================

export function useAdminProducts(params?: ProductFilterParams) {
  return useQuery({
    queryKey: ["admin-products", params],
    queryFn: () => ProductApi.getAdminProducts(params),
  });
}

export function useAdminProduct(id: string) {
  return useQuery({
    queryKey: ["admin-product", id],
    queryFn: () => ProductApi.getAdminProductById(id),
    enabled: !!id && id !== "new",
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateProductDto) => ProductApi.createProduct(dto),
    onSuccess: (newProduct) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["public-products"] });
      toast.success(`Product "${newProduct.name || "New Product"}" created successfully`);
    },
    onError: (err: any) => {
      toast.error(getErrorMessage(err, "Failed to create product"));
    },
  });
}

export function useUpdateProduct(defaultId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: UpdateProductDto | { id: string; dto: UpdateProductDto }) => {
      if ("dto" in args && "id" in args) {
        return ProductApi.updateProduct(args.id, args.dto);
      }
      if (!defaultId) {
        throw new Error("Product ID is required to update product");
      }
      return ProductApi.updateProduct(defaultId, args as UpdateProductDto);
    },
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["public-products"] });
      if (updatedProduct?.id) {
        queryClient.invalidateQueries({ queryKey: ["admin-product", updatedProduct.id] });
        queryClient.invalidateQueries({ queryKey: ["public-product", updatedProduct.id] });
      }
      toast.success(`Product "${updatedProduct.name || "Product"}" updated successfully`);
    },
    onError: (err: any) => {
      toast.error(getErrorMessage(err, "Failed to update product"));
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ProductApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["public-products"] });
      toast.success("Product deleted successfully");
    },
    onError: (err: any) => {
      toast.error(getErrorMessage(err, "Failed to delete product"));
    },
  });
}
