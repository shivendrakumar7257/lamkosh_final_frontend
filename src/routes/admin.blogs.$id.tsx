import React, { useState, useEffect, useRef } from "react";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import {
  useAdminBlog,
  useUpdateBlog,
  useAdminCategories,
  usePublishBlog,
  useUnpublishBlog,
  useDeleteBlog,
  useUpdateImageAlt,
  useDeleteBlogImage,
} from "@/hooks/use-blogs";
import { BlogApi } from "@/lib/api/blog.api";
import { getMediaUrl } from "@/lib/media";
import { BlogStatus, BlogImage } from "@/types/blog";
import {
  Save,
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Loader2,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  Quote,
  Link as LinkIcon,
  Eye,
  EyeOff,
  Edit3,
  ExternalLink,
  Trash2,
  Tag as TagIcon,
  Globe,
  Sparkles,
  Clock,
  Check,
  Star,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/blogs/$id")({
  component: AdminEditBlogPage,
});

function AdminEditBlogPage() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/admin/blogs/$id" });

  const { data: blog, isLoading: isBlogLoading, isError, refetch } = useAdminBlog(id);
  const updateMutation = useUpdateBlog(id);
  const publishMutation = usePublishBlog();
  const unpublishMutation = useUnpublishBlog();
  const deleteMutation = useDeleteBlog();
  const updateImageMutation = useUpdateImageAlt();
  const deleteImageMutation = useDeleteBlogImage();

  const { data: categoriesData = [] } = useAdminCategories();
  const existingCategories = categoriesData.map((c) => c.category);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState<BlogStatus>("DRAFT");

  // Featured Image
  const [existingFeaturedImage, setExistingFeaturedImage] = useState<string | null>(null);
  const [removeFeaturedImage, setRemoveFeaturedImage] = useState(false);
  const [newFeaturedImage, setNewFeaturedImage] = useState<File | null>(null);
  const [newFeaturedPreview, setNewFeaturedPreview] = useState<string | null>(null);
  const [featuredImageAlt, setFeaturedImageAlt] = useState("");

  // Gallery Images
  const [existingGallery, setExistingGallery] = useState<BlogImage[]>([]);
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [editingAltText, setEditingAltText] = useState<string>("");

  const [newGalleryImages, setNewGalleryImages] = useState<File[]>([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);
  const [newGalleryAltTexts, setNewGalleryAltTexts] = useState<string[]>([]);

  // Tags & Keywords Chips
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");

  // SEO Accordion
  const [seoOpen, setSeoOpen] = useState(false);
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Editor Mode (Write vs Preview)
  const [editorTab, setEditorTab] = useState<"write" | "preview">("write");
  const [uploadingInline, setUploadingInline] = useState(false);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Populate form when blog is loaded
  useEffect(() => {
    if (blog) {
      setTitle(blog.title || "");
      setSlug(blog.slug || "");
      setCategory(blog.category || "");
      setDescription(blog.description || "");
      setContent(blog.content || "");
      setAuthor(blog.author || "LaMoksh Atelier");
      setStatus(blog.status || "DRAFT");
      setExistingFeaturedImage(blog.featuredImage || null);
      setFeaturedImageAlt(blog.featuredImageAlt || "");
      setExistingGallery(blog.images || []);
      setTags(blog.tags || []);
      setKeywords(blog.keywords || []);
      setSeoTitle(blog.seoTitle || "");
      setMetaDescription(blog.metaDescription || "");
      setRemoveFeaturedImage(false);
      setNewFeaturedImage(null);
      setNewFeaturedPreview(null);
      setNewGalleryImages([]);
      setNewGalleryPreviews([]);
      setNewGalleryAltTexts([]);
    }
  }, [blog]);

  // Tags handling
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^#/, "");
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Keywords handling
  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = keywordInput.trim();
      if (trimmed && !keywords.includes(trimmed)) {
        setKeywords([...keywords, trimmed]);
      }
      setKeywordInput("");
    }
  };

  const removeKeyword = (kwToRemove: string) => {
    setKeywords(keywords.filter((k) => k !== kwToRemove));
  };

  // Featured Image Handlers
  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size exceeds 50MB limit");
      return;
    }

    setNewFeaturedImage(file);
    setRemoveFeaturedImage(false);
    const reader = new FileReader();
    reader.onload = () => setNewFeaturedPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleClearFeaturedImage = () => {
    setNewFeaturedImage(null);
    setNewFeaturedPreview(null);
    setExistingFeaturedImage(null);
    setRemoveFeaturedImage(true);
    setFeaturedImageAlt("");
  };

  // Gallery Handlers: Direct Backend Endpoints
  const handleDeleteExistingImage = async (imageId: string) => {
    if (window.confirm("Permanently delete this image from storage?")) {
      try {
        await deleteImageMutation.mutateAsync({ blogId: id, imageId });
        setExistingGallery((prev) => prev.filter((img) => img.id !== imageId));
      } catch {
        // Handled in hook
      }
    }
  };

  const handleSaveImageAlt = async (imageId: string) => {
    try {
      await updateImageMutation.mutateAsync({
        blogId: id,
        imageId,
        altText: editingAltText,
      });
      setExistingGallery((prev) =>
        prev.map((img) => (img.id === imageId ? { ...img, altText: editingAltText } : img)),
      );
      setEditingImageId(null);
    } catch {
      // Handled in hook
    }
  };

  const handleSetImageFeatured = async (image: BlogImage) => {
    try {
      await updateImageMutation.mutateAsync({
        blogId: id,
        imageId: image.id,
        altText: image.altText || "",
        isFeatured: true,
      });
      refetch();
    } catch {
      // Handled in hook
    }
  };

  // New gallery files handling
  const handleNewGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = 10 - existingGallery.length - newGalleryImages.length;
    if (remainingSlots <= 0) {
      toast.warning("Maximum of 10 gallery images reached");
      return;
    }

    const filesToAdd = files.slice(0, remainingSlots);
    const validFiles: File[] = [];

    filesToAdd.forEach((file) => {
      if (file.size <= 50 * 1024 * 1024) {
        validFiles.push(file);
      } else {
        toast.error(`"${file.name}" exceeds 50MB limit and was skipped`);
      }
    });

    if (!validFiles.length) return;

    setNewGalleryImages((prev) => [...prev, ...validFiles]);

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setNewGalleryPreviews((prev) => [...prev, reader.result as string]);
        setNewGalleryAltTexts((prev) => [...prev, file.name.replace(/\.[^/.]+$/, "")]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveNewGalleryImage = (index: number) => {
    setNewGalleryImages((prev) => prev.filter((_, i) => i !== index));
    setNewGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    setNewGalleryAltTexts((prev) => prev.filter((_, i) => i !== index));
  };

  // Formatting helpers
  const insertFormatting = (before: string, after: string = "", placeholder: string = "") => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end) || placeholder;
    const replacement = `${before}${selected}${after}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast.error("Image file size exceeds 50MB limit");
      return;
    }

    setUploadingInline(true);
    try {
      const uploaded = await BlogApi.uploadInlineImage(file, file.name, id);
      const url = getMediaUrl(uploaded.url);
      const imgHtml = `\n<figure class="my-6">\n  <img src="${url}" alt="${uploaded.altText || ""}" class="w-full rounded-sm object-cover shadow-xs" />\n  <figcaption class="text-xs text-stone-500 mt-2 text-center italic">${uploaded.altText || ""}</figcaption>\n</figure>\n`;
      insertFormatting(imgHtml, "", "");
      toast.success("Inline image uploaded and inserted");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to upload inline image");
    } finally {
      setUploadingInline(false);
      e.target.value = "";
    }
  };

  // Metrics
  const wordCount = content.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim().length < 3) {
      toast.error("Article title must be at least 3 characters");
      return;
    }

    if (!category.trim() || category.trim().length < 2) {
      toast.error("Category must be at least 2 characters");
      return;
    }

    if (description.trim().length < 5 || description.trim().length > 2000) {
      toast.error("Description must be between 5 and 2000 characters");
      return;
    }

    if (!content.trim()) {
      toast.error("Article content is required");
      return;
    }

    // Flush pending tag/keyword
    const finalTags = [...tags];
    if (tagInput.trim() && !finalTags.includes(tagInput.trim().replace(/^#/, ""))) {
      finalTags.push(tagInput.trim().replace(/^#/, ""));
    }

    const finalKeywords = [...keywords];
    if (keywordInput.trim() && !finalKeywords.includes(keywordInput.trim())) {
      finalKeywords.push(keywordInput.trim());
    }

    try {
      await updateMutation.mutateAsync({
        id,
        dto: {
          title: title.trim(),
          description: description.trim(),
          content: content.trim(),
          category: category.trim(),
          slug: slug.trim() || undefined,
          author: author.trim() || undefined,
          seoTitle: seoTitle.trim() || null,
          metaDescription: metaDescription.trim() || null,
          status,
          featuredImageAlt: featuredImageAlt.trim() || null,
          removeFeaturedImage,
          featuredImage: newFeaturedImage || null,
          images: newGalleryImages.length > 0 ? newGalleryImages : undefined,
          imageAltTexts: newGalleryAltTexts.length > 0 ? newGalleryAltTexts : undefined,
          tags: finalTags,
          keywords: finalKeywords,
        },
      });

      navigate({ to: "/admin/blogs" as any });
    } catch {
      // Error handled by mutation onError
    }
  };

  const handleDeleteArticle = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      navigate({ to: "/admin/blogs" as any });
    } catch {
      // Handled in hook
    }
  };

  if (isBlogLoading) {
    return (
      <div className="bg-white border border-[#E7E5E4] p-16 text-center shadow-sm max-w-4xl mx-auto">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#6B1D2F]" />
        <p className="mt-3 text-xs text-[#78716C] font-serif">Loading article details...</p>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="bg-white border border-[#E7E5E4] p-12 text-center shadow-sm max-w-4xl mx-auto">
        <p className="text-rose-700 text-sm font-serif">Article not found or failed to load.</p>
        <button
          type="button"
          onClick={() => navigate({ to: "/admin/blogs" as any })}
          className="mt-4 px-4 py-2 bg-[#6B1D2F] text-white text-xs uppercase font-semibold"
        >
          Return to Blogs List
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 border border-[#E7E5E4] shadow-sm">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => navigate({ to: "/admin/blogs" as any })}
            className="p-2 border border-[#E7E5E4] bg-white hover:bg-[#FAF8F5] text-[#1C1917]"
            title="Back to blogs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-serif font-light text-[#1C1917]">Edit Journal Article</h1>
              <a
                href={`/journal/${blog.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#6B1D2F] hover:underline"
              >
                <span>View Live</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#78716C] mt-1">
              <span>UUID: {blog.id}</span>
              <span>·</span>
              <span>Created {new Date(blog.createdAt).toLocaleDateString()}</span>
              {blog.authorUser && (
                <>
                  <span>·</span>
                  <span>
                    Linked User: {blog.authorUser.name} ({blog.authorUser.email})
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Quick Publish / Unpublish Toggle */}
          {status === "PUBLISHED" ? (
            <button
              type="button"
              disabled={unpublishMutation.isPending}
              onClick={async () => {
                await unpublishMutation.mutateAsync(id);
                setStatus("DRAFT");
              }}
              className="flex items-center space-x-1.5 px-3 py-2 border border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100 text-xs font-semibold uppercase tracking-wider transition-colors"
              title="Unpublish (move to Draft)"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Unpublish</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={publishMutation.isPending}
              onClick={async () => {
                await publishMutation.mutateAsync(id);
                setStatus("PUBLISHED");
              }}
              className="flex items-center space-x-1.5 px-3 py-2 border border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold uppercase tracking-wider transition-colors"
              title="Publish immediately"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Publish Live</span>
            </button>
          )}

          {/* Delete button */}
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="p-2 border border-[#E7E5E4] text-[#78716C] hover:text-rose-700 bg-white hover:bg-[#FAF8F5]"
            title="Delete article"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Save Changes button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={updateMutation.isPending}
            className="flex items-center space-x-2 px-6 py-2 bg-[#6B1D2F] text-white text-xs uppercase font-semibold hover:bg-[#521624] transition-colors disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Details Card */}
        <div className="bg-white border border-[#E7E5E4] p-8 shadow-sm space-y-6">
          {/* Article Title */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                Article Title *
              </label>
              <span className="text-[11px] text-[#78716C]">{title.length} / 255 chars</span>
            </div>
            <input
              type="text"
              required
              minLength={3}
              maxLength={255}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., The Heritage of Chanderi Silk: Centuries of Royal Weaving"
              className="w-full px-4 py-3 border border-[#E7E5E4] bg-[#FAF8F5] text-base font-serif focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
            />
          </div>

          {/* Category, Author, and Status row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                Category *
              </label>
              {!isCustomCategory && existingCategories.length > 0 ? (
                <div className="space-y-1.5">
                  <select
                    value={category}
                    onChange={(e) => {
                      if (e.target.value === "__NEW__") {
                        setIsCustomCategory(true);
                        setCategory("");
                      } else {
                        setCategory(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#6B1D2F]"
                  >
                    <option value="">Select a category...</option>
                    {existingCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="__NEW__">+ Create New Category...</option>
                  </select>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Textile Craft, Styling Guide"
                    className="flex-1 px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#6B1D2F]"
                  />
                  {existingCategories.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsCustomCategory(false)}
                      className="px-2 py-1 text-[11px] text-[#78716C] border border-[#E7E5E4] hover:bg-neutral-100"
                    >
                      Choose existing
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Author */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                Author Name
              </label>
              <input
                type="text"
                maxLength={100}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g., LaMoksh Atelier"
                className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>

            {/* Publication Status */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BlogStatus)}
                className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs font-semibold focus:outline-none focus:border-[#6B1D2F]"
              >
                <option value="DRAFT">DRAFT (Unpublished)</option>
                <option value="PUBLISHED">PUBLISHED (Live on Storefront)</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>
          </div>

          {/* Description / Short Excerpt */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                Short Excerpt / Description *
              </label>
              <span className="text-[11px] text-[#78716C]">
                {description.length} / 2000 characters
              </span>
            </div>
            <textarea
              rows={3}
              required
              minLength={5}
              maxLength={2000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief 1-3 sentence summary that appears on blog listing cards, social shares, and search previews..."
              className="w-full px-4 py-2.5 border border-[#E7E5E4] bg-[#FAF8F5] text-xs leading-relaxed focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
            />
          </div>

          {/* Featured Image Section */}
          <div className="space-y-3 pt-2 border-t border-[#E7E5E4]">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                Featured Cover Image (up to 50MB)
              </label>
              <span className="text-[11px] text-[#78716C]">
                Stored in /uploads/blogs/featured/
              </span>
            </div>

            {newFeaturedPreview ? (
              <div className="relative aspect-[16/9] max-w-lg overflow-hidden border border-[#E7E5E4] bg-neutral-100">
                <img
                  src={newFeaturedPreview}
                  alt="New featured preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setNewFeaturedImage(null);
                    setNewFeaturedPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full hover:bg-black transition-colors"
                  title="Cancel new image"
                >
                  <X className="w-4 h-4" />
                </button>
                <span className="absolute bottom-2 left-2 bg-emerald-700 text-white text-[10px] px-2 py-0.5 font-semibold">
                  New file selected for replacement
                </span>
              </div>
            ) : existingFeaturedImage && !removeFeaturedImage ? (
              <div className="relative aspect-[16/9] max-w-lg overflow-hidden border border-[#E7E5E4] bg-neutral-100">
                <img
                  src={getMediaUrl(existingFeaturedImage)}
                  alt={featuredImageAlt || title}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleClearFeaturedImage}
                  className="absolute top-2 right-2 bg-rose-700 text-white p-1.5 rounded-full hover:bg-rose-900 transition-colors"
                  title="Remove featured image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5">
                  Current image on server
                </span>
              </div>
            ) : (
              <div className="border-2 border-dashed border-[#E7E5E4] bg-[#FAF8F5] p-6 text-center hover:bg-neutral-50 transition-colors">
                <input
                  type="file"
                  id="featured-image-edit-file"
                  accept="image/*"
                  onChange={handleFeaturedImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="featured-image-edit-file"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="w-8 h-8 text-[#6B1D2F]" />
                  <span className="text-xs font-semibold text-[#1C1917]">
                    Upload new featured cover image
                  </span>
                  <span className="text-[11px] text-[#78716C]">
                    JPG, PNG, WEBP up to 50MB
                  </span>
                </label>
              </div>
            )}

            {/* Replace Button if image exists */}
            {(existingFeaturedImage || newFeaturedPreview) && (
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="file"
                  id="featured-image-replace-file"
                  accept="image/*"
                  onChange={handleFeaturedImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="featured-image-replace-file"
                  className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#E7E5E4] text-xs font-semibold text-[#1C1917] hover:bg-neutral-100"
                >
                  <Upload className="w-3.5 h-3.5 text-[#6B1D2F]" />
                  <span>Choose Replacement Image</span>
                </label>

                {!removeFeaturedImage && (
                  <button
                    type="button"
                    onClick={handleClearFeaturedImage}
                    className="text-xs text-rose-700 hover:underline"
                  >
                    Remove featured image
                  </button>
                )}
              </div>
            )}

            {/* Featured Image Alt Text */}
            <div className="pt-1">
              <input
                type="text"
                maxLength={255}
                value={featuredImageAlt}
                onChange={(e) => setFeaturedImageAlt(e.target.value)}
                placeholder="Featured image alt text (e.g., Master weaver working on gold zari borders)"
                className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>
          </div>

          {/* Rich Content Editor */}
          <div className="space-y-3 pt-2 border-t border-[#E7E5E4]">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Article Content (HTML) *
                </label>
                <p className="text-[11px] text-[#78716C] mt-0.5">
                  Pre-sanitized on backend against XSS (scripts, unsafe event handlers stripped).
                </p>
              </div>

              {/* View Switcher: Write vs Preview */}
              <div className="flex items-center gap-1 border border-[#E7E5E4] bg-[#FAF8F5] p-0.5">
                <button
                  type="button"
                  onClick={() => setEditorTab("write")}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold transition-colors ${
                    editorTab === "write"
                      ? "bg-white text-[#6B1D2F] shadow-xs"
                      : "text-[#78716C] hover:text-[#1C1917]"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Write</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab("preview")}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold transition-colors ${
                    editorTab === "preview"
                      ? "bg-white text-[#6B1D2F] shadow-xs"
                      : "text-[#78716C] hover:text-[#1C1917]"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              </div>
            </div>

            {editorTab === "write" ? (
              <div className="border border-[#E7E5E4]">
                {/* Editor Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-1 bg-[#FAF8F5] p-2 border-b border-[#E7E5E4]">
                  <div className="flex items-center flex-wrap gap-1">
                    <button
                      type="button"
                      onClick={() => insertFormatting("<h2>", "</h2>", "Section Title")}
                      className="p-1.5 text-[#1C1917] hover:bg-white rounded transition-colors"
                      title="Heading 2"
                    >
                      <Heading2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("<h3>", "</h3>", "Subheading")}
                      className="p-1.5 text-[#1C1917] hover:bg-white rounded transition-colors"
                      title="Heading 3"
                    >
                      <Heading3 className="w-4 h-4" />
                    </button>
                    <div className="w-[1px] h-4 bg-[#E7E5E4] mx-1" />
                    <button
                      type="button"
                      onClick={() => insertFormatting("<strong>", "</strong>", "bold text")}
                      className="p-1.5 text-[#1C1917] hover:bg-white rounded transition-colors"
                      title="Bold"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("<em>", "</em>", "italic text")}
                      className="p-1.5 text-[#1C1917] hover:bg-white rounded transition-colors"
                      title="Italic"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <div className="w-[1px] h-4 bg-[#E7E5E4] mx-1" />
                    <button
                      type="button"
                      onClick={() =>
                        insertFormatting("<blockquote><p>", "</p></blockquote>", "Atelier Quote")
                      }
                      className="p-1.5 text-[#1C1917] hover:bg-white rounded transition-colors"
                      title="Blockquote"
                    >
                      <Quote className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        insertFormatting(
                          "<ul>\n  <li>",
                          "</li>\n  <li>Second item</li>\n</ul>",
                          "First item",
                        )
                      }
                      className="p-1.5 text-[#1C1917] hover:bg-white rounded transition-colors"
                      title="Bullet List"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        insertFormatting(
                          '<a href="https://" target="_blank" rel="noreferrer">',
                          "</a>",
                          "link text",
                        )
                      }
                      className="p-1.5 text-[#1C1917] hover:bg-white rounded transition-colors"
                      title="Insert Link"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("<p>", "</p>", "Paragraph text")}
                      className="px-2 py-1 text-xs font-semibold text-[#1C1917] hover:bg-white rounded transition-colors"
                      title="Paragraph"
                    >
                      ¶
                    </button>

                    <div className="w-[1px] h-4 bg-[#E7E5E4] mx-1" />

                    {/* Inline Image Upload */}
                    <label
                      htmlFor="inline-image-edit-file"
                      className="cursor-pointer flex items-center gap-1.5 px-2 py-1 text-xs text-[#6B1D2F] font-semibold hover:bg-white rounded transition-colors"
                      title="Upload and insert inline image"
                    >
                      {uploadingInline ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <ImageIcon className="w-3.5 h-3.5" />
                      )}
                      <span>{uploadingInline ? "Uploading..." : "Upload Inline Image"}</span>
                    </label>
                    <input
                      type="file"
                      id="inline-image-edit-file"
                      accept="image/*"
                      disabled={uploadingInline}
                      onChange={handleInlineImageUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Word count & Reading time indicator */}
                  <div className="flex items-center gap-3 text-[11px] text-[#78716C] pr-2">
                    <span>{wordCount} words</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#6B1D2F]" />
                      {readTime} min read
                    </span>
                  </div>
                </div>

                <textarea
                  ref={contentTextareaRef}
                  rows={15}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write article HTML or text here. Use the toolbar above to add headings, lists, quotes, and inline imagery..."
                  className="w-full p-4 text-xs font-mono leading-relaxed bg-[#FAF8F5] focus:bg-white focus:outline-none"
                />
              </div>
            ) : (
              <div className="border border-[#E7E5E4] p-8 bg-white min-h-[350px]">
                {content.trim() ? (
                  <div
                    className="prose prose-stone max-w-none prose-headings:font-serif prose-a:text-[#6B1D2F]"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                ) : (
                  <div className="text-center py-12 text-[#78716C]">
                    <FileText className="w-8 h-8 text-[#A8A29E] mx-auto mb-2" />
                    <p className="text-xs italic">
                      No content written yet. Switch to "Write" tab to compose.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Gallery Images Management */}
          <div className="space-y-4 pt-2 border-t border-[#E7E5E4]">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Gallery Images (up to 10 files)
                </label>
                <p className="text-[11px] text-[#78716C] mt-0.5">
                  Manage existing images on server or upload new gallery images.
                </p>
              </div>
              <span className="text-[11px] text-[#78716C]">
                {existingGallery.length + newGalleryPreviews.length} / 10 images
              </span>
            </div>

            {/* Existing Server Gallery Images */}
            {existingGallery.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] text-[#78716C] font-semibold">Images on Server:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {existingGallery.map((img) => (
                    <div
                      key={img.id}
                      className="border border-[#E7E5E4] bg-[#FAF8F5] flex flex-col justify-between group overflow-hidden"
                    >
                      <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                        <img
                          src={getMediaUrl(img.url)}
                          alt={img.altText || "Gallery item"}
                          className="w-full h-full object-cover"
                        />

                        {img.isFeatured && (
                          <span className="absolute top-1.5 left-1.5 bg-[#6B1D2F] text-white text-[9px] uppercase font-semibold px-1.5 py-0.5 shadow-xs">
                            Featured
                          </span>
                        )}

                        <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-90 group-hover:opacity-100">
                          {/* Set as featured button */}
                          {!img.isFeatured && (
                            <button
                              type="button"
                              onClick={() => handleSetImageFeatured(img)}
                              className="p-1 bg-white/90 text-[#1C1917] hover:text-[#6B1D2F] rounded-xs shadow-xs"
                              title="Set as featured"
                            >
                              <Star className="w-3 h-3" />
                            </button>
                          )}

                          {/* Delete individual image button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteExistingImage(img.id)}
                            className="p-1 bg-rose-700 text-white hover:bg-rose-900 rounded-xs shadow-xs"
                            title="Delete this image from server"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Alt text editor */}
                      <div className="p-2 bg-white border-t border-[#E7E5E4]">
                        {editingImageId === img.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={editingAltText}
                              onChange={(e) => setEditingAltText(e.target.value)}
                              placeholder="Alt text"
                              className="w-full text-[10px] px-1.5 py-1 border border-[#E7E5E4] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveImageAlt(img.id)}
                              className="p-1 bg-emerald-700 text-white hover:bg-emerald-800"
                              title="Save alt text"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingImageId(null)}
                              className="p-1 text-[#78716C] hover:bg-neutral-100"
                              title="Cancel"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="truncate text-stone-600 max-w-[140px]">
                              {img.altText || <em className="text-[#A8A29E]">No alt text</em>}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingImageId(img.id);
                                setEditingAltText(img.altText || "");
                              }}
                              className="text-[#6B1D2F] hover:underline"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Newly Selected Gallery Previews */}
            {newGalleryPreviews.length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-[11px] text-emerald-800 font-semibold">
                  New Images to Upload on Save:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {newGalleryPreviews.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-[4/3] border border-[#E7E5E4] bg-neutral-100 flex flex-col justify-between"
                    >
                      <img src={src} alt="New gallery" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewGalleryImage(idx)}
                        className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full hover:bg-black transition-colors"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <input
                        type="text"
                        placeholder="Alt text"
                        value={newGalleryAltTexts[idx] || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewGalleryAltTexts((prev) => {
                            const copy = [...prev];
                            copy[idx] = val;
                            return copy;
                          });
                        }}
                        className="w-full text-[10px] px-1.5 py-1 border-t border-[#E7E5E4] bg-white focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload More Button */}
            {existingGallery.length + newGalleryPreviews.length < 10 && (
              <div>
                <input
                  type="file"
                  id="gallery-images-edit-file"
                  accept="image/*"
                  multiple
                  onChange={handleNewGalleryImagesChange}
                  className="hidden"
                />
                <label
                  htmlFor="gallery-images-edit-file"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs font-semibold text-[#1C1917] hover:bg-neutral-100 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-[#6B1D2F]" />
                  <span>Upload More Gallery Images</span>
                </label>
              </div>
            )}
          </div>

          {/* Interactive Tags and Keywords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-[#E7E5E4]">
            {/* Tags with Interactive Chips */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                Tags (Press Enter or comma)
              </label>

              <div className="p-2 border border-[#E7E5E4] bg-[#FAF8F5] flex flex-wrap items-center gap-1.5 min-h-[42px] focus-within:bg-white focus-within:border-[#6B1D2F]">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 bg-[#FAF7F2] border border-[#E7E5E4] px-2 py-0.5 text-xs text-[#1C1917]"
                  >
                    <TagIcon className="w-2.5 h-2.5 text-[#6B1D2F]" />
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      className="text-[#A8A29E] hover:text-rose-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder={tags.length === 0 ? "Type tag & press enter (e.g., Banarasi, Handloom)..." : ""}
                  className="flex-1 min-w-[120px] bg-transparent text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Keywords with Interactive Chips */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                Keywords (Press Enter or comma)
              </label>

              <div className="p-2 border border-[#E7E5E4] bg-[#FAF8F5] flex flex-wrap items-center gap-1.5 min-h-[42px] focus-within:bg-white focus-within:border-[#6B1D2F]">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1 bg-white border border-[#E7E5E4] px-2 py-0.5 text-xs text-[#1C1917]"
                  >
                    <span>{kw}</span>
                    <button
                      type="button"
                      onClick={() => removeKeyword(kw)}
                      className="text-[#A8A29E] hover:text-rose-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleAddKeyword}
                  placeholder={keywords.length === 0 ? "Type keyword & press enter (e.g., silk sarees, craft)..." : ""}
                  className="flex-1 min-w-[120px] bg-transparent text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SEO Collapsible Section with Google SERP Live Preview */}
        <div className="bg-white border border-[#E7E5E4] shadow-sm">
          <button
            type="button"
            onClick={() => setSeoOpen(!seoOpen)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-[#FAF8F5] transition-colors"
          >
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#1C1917] flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#6B1D2F]" />
                <span>Search Engine Optimization (SEO) & URL Slug</span>
              </h2>
              <p className="text-[11px] text-[#78716C] mt-0.5">
                Slug: /journal/{slug} · Custom SEO meta titles and descriptions
              </p>
            </div>
            {seoOpen ? (
              <ChevronUp className="w-5 h-5 text-[#78716C]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#78716C]" />
            )}
          </button>

          {seoOpen && (
            <div className="p-6 border-t border-[#E7E5E4] space-y-6 bg-[#FAF8F5]">
              {/* Google SERP Live Preview */}
              <div className="bg-white p-4 border border-[#E7E5E4] rounded-xs space-y-1">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-[#78716C] mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Google Search Result Snippet Preview</span>
                </p>
                <div className="text-xs text-stone-500 font-sans flex items-center gap-1">
                  <span>https://api.lamokshfabric.com</span>
                  <span>› journal ›</span>
                  <span className="text-stone-700">{slug || "article-slug"}</span>
                </div>
                <div className="text-base text-blue-700 hover:underline font-medium cursor-pointer line-clamp-1">
                  {seoTitle || title || "Article Title Preview"}
                </div>
                <div className="text-xs text-stone-600 line-clamp-2">
                  {metaDescription || description || "Your article short description will appear here in Google search engine results snippets..."}
                </div>
              </div>

              {/* URL Slug */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                    Custom URL Slug
                  </label>
                  <span className="text-[11px] text-[#78716C]">
                    Backend auto-resolves collisions with incrementing suffix
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-neutral-200 border border-r-0 border-[#E7E5E4] text-xs text-[#78716C]">
                    /journal/
                  </span>
                  <input
                    type="text"
                    maxLength={255}
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="custom-article-slug"
                    className="flex-1 px-3 py-2 border border-[#E7E5E4] bg-white text-xs focus:outline-none focus:border-[#6B1D2F]"
                  />
                </div>
              </div>

              {/* SEO Title */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                    SEO Meta Title
                  </label>
                  <span className="text-[11px] text-[#78716C]">{seoTitle.length} / 255 chars</span>
                </div>
                <input
                  type="text"
                  maxLength={255}
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Defaults to article title if empty"
                  className="w-full px-3 py-2 border border-[#E7E5E4] bg-white text-xs focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              {/* Meta Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                    SEO Meta Description
                  </label>
                  <span className="text-[11px] text-[#78716C]">{metaDescription.length} chars</span>
                </div>
                <textarea
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Defaults to short description if empty"
                  className="w-full px-3 py-2 border border-[#E7E5E4] bg-white text-xs focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Bar at Bottom */}
        <div className="flex items-center justify-between bg-white p-6 border border-[#E7E5E4] shadow-sm">
          <button
            type="button"
            onClick={() => navigate({ to: "/admin/blogs" as any })}
            className="px-5 py-2.5 border border-[#E7E5E4] text-[#1C1917] text-xs uppercase font-semibold hover:bg-[#FAF8F5]"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex items-center space-x-2 px-8 py-2.5 bg-[#6B1D2F] text-white text-xs uppercase font-semibold hover:bg-[#521624] transition-colors shadow-sm disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Delete Article Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white border border-[#E7E5E4] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg text-[#1C1917]">Delete Article?</h3>
            </div>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Are you sure you want to delete <strong className="text-[#1C1917]">"{blog.title}"</strong>?
              This will remove the post and all its images from storage.
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E7E5E4]">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-[#E7E5E4] text-xs font-semibold uppercase text-[#1C1917] hover:bg-[#FAF8F5]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={handleDeleteArticle}
                className="px-5 py-2 bg-rose-600 text-white text-xs font-semibold uppercase hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
