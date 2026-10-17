export type BlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface BlogImage {
  id: string;
  blogId?: string;
  url: string;
  storageKey?: string;
  altText?: string | null;
  isFeatured: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string; // Sanitized HTML
  category: string;
  tags: string[];
  author: string;
  authorId?: string | null;
  authorUser?: {
    id: string;
    name: string;
    email: string;
  } | null;
  seoTitle?: string | null;
  metaDescription?: string | null;
  keywords: string[];
  featuredImage?: string | null;
  featuredImageAlt?: string | null;
  status: BlogStatus;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  images?: BlogImage[];
}

export interface BlogCategoryCount {
  category: string;
  count: number;
}

export interface BlogPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BlogListResponse {
  blogs: BlogPost[];
  meta: BlogPaginationMeta;
}

export interface BlogFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tag?: string;
  status?: BlogStatus;
  sortBy?: "createdAt" | "updatedAt" | "publishedAt" | "title";
  sortOrder?: "asc" | "desc";
}

export interface CreateBlogDto {
  title: string;
  description: string;
  content: string;
  category: string;
  slug?: string;
  tags?: string[];
  keywords?: string[];
  author?: string;
  seoTitle?: string;
  metaDescription?: string;
  status?: BlogStatus;
  featuredImageAlt?: string;
  featuredImage?: File | null;
  images?: File[];
  imageAltTexts?: string[];
}

export interface UpdateBlogDto {
  title?: string;
  description?: string;
  content?: string;
  category?: string;
  slug?: string;
  tags?: string[];
  keywords?: string[];
  author?: string;
  seoTitle?: string | null;
  metaDescription?: string | null;
  status?: BlogStatus;
  featuredImageAlt?: string | null;
  removeFeaturedImage?: boolean;
  removeImageIds?: string[];
  featuredImage?: File | null;
  images?: File[];
  imageAltTexts?: string[];
}
