import { api, ApiResponse } from "@/lib/api";
import {
  BlogPost,
  BlogListResponse,
  BlogCategoryCount,
  BlogFilterParams,
  CreateBlogDto,
  UpdateBlogDto,
  BlogImage,
} from "@/types/blog";

export const BlogApi = {
  // ==========================================
  // Public Storefront APIs (No Auth required)
  // ==========================================
  getPublicBlogs: async (params?: BlogFilterParams): Promise<BlogListResponse> => {
    const res = await api.get<ApiResponse<any>>("/blogs", { params });
    const payload = res.data?.data;
    if (payload?.blogs && payload?.meta) {
      return payload as BlogListResponse;
    }
    if (Array.isArray(payload)) {
      return {
        blogs: payload,
        meta: {
          total: payload.length,
          page: params?.page || 1,
          limit: params?.limit || payload.length,
          totalPages: 1,
        },
      };
    }
    return {
      blogs: payload?.blogs || [],
      meta: payload?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 },
    };
  },

  getPublicBlogBySlugOrId: async (identifier: string): Promise<BlogPost> => {
    const res = await api.get<ApiResponse<any>>(`/blogs/${encodeURIComponent(identifier)}`);
    const payload = res.data?.data;
    return (payload?.blog || payload) as BlogPost;
  },

  getPublicCategories: async (): Promise<BlogCategoryCount[]> => {
    const res = await api.get<ApiResponse<any>>("/blogs/categories");
    const payload = res.data?.data;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.categories)) return payload.categories;
    return [];
  },

  getPublicTags: async (): Promise<string[]> => {
    const res = await api.get<ApiResponse<any>>("/blogs/tags");
    const payload = res.data?.data;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.tags)) return payload.tags;
    return [];
  },

  // ==========================================
  // Admin CMS APIs (Requires Auth & Admin Role)
  // ==========================================
  getAdminBlogs: async (params?: BlogFilterParams): Promise<BlogListResponse> => {
    const res = await api.get<ApiResponse<any>>("/admin/blogs", { params });
    const payload = res.data?.data;
    if (payload?.blogs && payload?.meta) {
      return payload as BlogListResponse;
    }
    if (Array.isArray(payload)) {
      return {
        blogs: payload,
        meta: {
          total: payload.length,
          page: params?.page || 1,
          limit: params?.limit || payload.length,
          totalPages: 1,
        },
      };
    }
    return {
      blogs: payload?.blogs || [],
      meta: payload?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 },
    };
  },

  getAdminBlogById: async (id: string): Promise<BlogPost> => {
    const res = await api.get<ApiResponse<any>>(`/admin/blogs/${id}`);
    const payload = res.data?.data;
    return (payload?.blog || payload) as BlogPost;
  },

  getAdminCategories: async (): Promise<BlogCategoryCount[]> => {
    const res = await api.get<ApiResponse<any>>("/admin/blogs/categories");
    const payload = res.data?.data;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.categories)) return payload.categories;
    return [];
  },

  createBlog: async (dto: CreateBlogDto): Promise<BlogPost> => {
    const formData = new FormData();
    formData.append("title", dto.title);
    formData.append("description", dto.description);
    formData.append("content", dto.content);
    formData.append("category", dto.category);
    if (dto.slug) formData.append("slug", dto.slug);
    if (dto.author) formData.append("author", dto.author);
    if (dto.seoTitle) formData.append("seoTitle", dto.seoTitle);
    if (dto.metaDescription) formData.append("metaDescription", dto.metaDescription);
    if (dto.status) formData.append("status", dto.status);
    if (dto.featuredImageAlt) formData.append("featuredImageAlt", dto.featuredImageAlt);
    if (dto.tags && dto.tags.length > 0) {
      formData.append("tags", JSON.stringify(dto.tags));
    }
    if (dto.keywords && dto.keywords.length > 0) {
      formData.append("keywords", JSON.stringify(dto.keywords));
    }
    if (dto.featuredImage) {
      formData.append("featuredImage", dto.featuredImage);
    }
    if (dto.images && dto.images.length > 0) {
      dto.images.forEach((file) => formData.append("images", file));
    }
    if (dto.imageAltTexts && dto.imageAltTexts.length > 0) {
      formData.append("imageAltTexts", JSON.stringify(dto.imageAltTexts));
    }

    const res = await api.post<ApiResponse<any>>("/admin/blogs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const payload = res.data?.data;
    return (payload?.blog || payload) as BlogPost;
  },

  updateBlog: async (id: string, dto: UpdateBlogDto): Promise<BlogPost> => {
    const formData = new FormData();
    if (dto.title !== undefined) formData.append("title", dto.title);
    if (dto.description !== undefined) formData.append("description", dto.description);
    if (dto.content !== undefined) formData.append("content", dto.content);
    if (dto.category !== undefined) formData.append("category", dto.category);
    if (dto.slug !== undefined) formData.append("slug", dto.slug);
    if (dto.author !== undefined) formData.append("author", dto.author);
    if (dto.seoTitle !== undefined) formData.append("seoTitle", dto.seoTitle || "");
    if (dto.metaDescription !== undefined)
      formData.append("metaDescription", dto.metaDescription || "");
    if (dto.status !== undefined) formData.append("status", dto.status);
    if (dto.featuredImageAlt !== undefined)
      formData.append("featuredImageAlt", dto.featuredImageAlt || "");
    if (dto.removeFeaturedImage) formData.append("removeFeaturedImage", "true");
    if (dto.tags !== undefined) formData.append("tags", JSON.stringify(dto.tags));
    if (dto.keywords !== undefined) formData.append("keywords", JSON.stringify(dto.keywords));
    if (dto.removeImageIds && dto.removeImageIds.length > 0) {
      formData.append("removeImageIds", JSON.stringify(dto.removeImageIds));
    }
    if (dto.featuredImage) {
      formData.append("featuredImage", dto.featuredImage);
    }
    if (dto.images && dto.images.length > 0) {
      dto.images.forEach((file) => formData.append("images", file));
    }
    if (dto.imageAltTexts && dto.imageAltTexts.length > 0) {
      formData.append("imageAltTexts", JSON.stringify(dto.imageAltTexts));
    }

    const res = await api.put<ApiResponse<any>>(`/admin/blogs/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const payload = res.data?.data;
    return (payload?.blog || payload) as BlogPost;
  },

  publishBlog: async (id: string): Promise<BlogPost> => {
    const res = await api.patch<ApiResponse<any>>(`/admin/blogs/${id}/publish`);
    const payload = res.data?.data;
    return (payload?.blog || payload) as BlogPost;
  },

  unpublishBlog: async (id: string): Promise<BlogPost> => {
    const res = await api.patch<ApiResponse<any>>(`/admin/blogs/${id}/unpublish`);
    const payload = res.data?.data;
    return (payload?.blog || payload) as BlogPost;
  },

  deleteBlog: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<any>>(`/admin/blogs/${id}`);
  },

  uploadInlineImage: async (file: File, altText?: string, blogId?: string): Promise<BlogImage> => {
    const formData = new FormData();
    formData.append("image", file);
    if (altText) formData.append("altText", altText);
    if (blogId) formData.append("blogId", blogId);

    const res = await api.post<ApiResponse<any>>("/admin/blogs/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const payload = res.data?.data;
    return (payload?.image || payload) as BlogImage;
  },

  updateImageAlt: async (
    blogId: string,
    imageId: string,
    altText: string,
    isFeatured?: boolean,
  ): Promise<BlogImage> => {
    const res = await api.patch<ApiResponse<any>>(`/admin/blogs/${blogId}/images/${imageId}`, {
      altText,
      isFeatured,
    });
    const payload = res.data?.data;
    return (payload?.image || payload) as BlogImage;
  },

  deleteBlogImage: async (blogId: string, imageId: string): Promise<void> => {
    await api.delete<ApiResponse<any>>(`/admin/blogs/${blogId}/images/${imageId}`);
  },
};
