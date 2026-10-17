import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BlogApi } from "@/lib/api/blog.api";
import { BlogFilterParams, CreateBlogDto, UpdateBlogDto } from "@/types/blog";
import { toast } from "sonner";

// ==========================================
// Public Hooks
// ==========================================
export function usePublicBlogs(params?: BlogFilterParams) {
  return useQuery({
    queryKey: ["public-blogs", params],
    queryFn: () => BlogApi.getPublicBlogs(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePublicBlog(identifier: string) {
  return useQuery({
    queryKey: ["public-blog", identifier],
    queryFn: () => BlogApi.getPublicBlogBySlugOrId(identifier),
    enabled: !!identifier,
  });
}

export function usePublicCategories() {
  return useQuery({
    queryKey: ["public-blog-categories"],
    queryFn: () => BlogApi.getPublicCategories(),
  });
}

export function usePublicTags() {
  return useQuery({
    queryKey: ["public-blog-tags"],
    queryFn: () => BlogApi.getPublicTags(),
  });
}

// ==========================================
// Admin Hooks
// ==========================================
export function useAdminBlogs(params?: BlogFilterParams) {
  return useQuery({
    queryKey: ["admin-blogs", params],
    queryFn: () => BlogApi.getAdminBlogs(params),
  });
}

export function useAdminBlog(id: string) {
  return useQuery({
    queryKey: ["admin-blog", id],
    queryFn: () => BlogApi.getAdminBlogById(id),
    enabled: !!id,
  });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: ["admin-blog-categories"],
    queryFn: () => BlogApi.getAdminCategories(),
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateBlogDto) => BlogApi.createBlog(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["public-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["public-blog-categories"] });
      queryClient.invalidateQueries({ queryKey: ["admin-blog-categories"] });
      toast.success("Blog created successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || "Failed to create blog");
    },
  });
}

export function useUpdateBlog(defaultId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: UpdateBlogDto | { id: string; dto: UpdateBlogDto }) => {
      if ("dto" in args && "id" in args) {
        return BlogApi.updateBlog(args.id, args.dto);
      }
      if (!defaultId) {
        throw new Error("Blog ID is required to update blog");
      }
      return BlogApi.updateBlog(defaultId, args as UpdateBlogDto);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
      queryClient.invalidateQueries({ queryKey: ["public-blogs"] });
      if (data?.slug) {
        queryClient.invalidateQueries({ queryKey: ["public-blog", data.slug] });
      }
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ["admin-blog", data.id] });
      }
      toast.success("Blog updated successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || "Failed to update blog");
    },
  });
}

export function usePublishBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => BlogApi.publishBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["public-blogs"] });
      toast.success("Blog published successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || "Failed to publish blog");
    },
  });
}

export function useUnpublishBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => BlogApi.unpublishBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["public-blogs"] });
      toast.success("Blog unpublished (moved to Draft)");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || "Failed to unpublish blog");
    },
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => BlogApi.deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["public-blogs"] });
      toast.success("Blog deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || "Failed to delete blog");
    },
  });
}

export function useDeleteBlogImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ blogId, imageId }: { blogId: string; imageId: string }) =>
      BlogApi.deleteBlogImage(blogId, imageId),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog", vars.blogId] });
      toast.success("Image removed");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || "Failed to remove image");
    },
  });
}

export function useUpdateImageAlt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      blogId,
      imageId,
      altText,
      isFeatured,
    }: {
      blogId: string;
      imageId: string;
      altText: string;
      isFeatured?: boolean;
    }) => BlogApi.updateImageAlt(blogId, imageId, altText, isFeatured),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog", vars.blogId] });
      toast.success("Image updated successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || "Failed to update image");
    },
  });
}
