import React, { useState, useRef } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCreateBlog, useAdminCategories } from "@/hooks/use-blogs";
import { BlogApi } from "@/lib/api/blog.api";
import { getMediaUrl } from "@/lib/media";
import { BlogStatus } from "@/types/blog";
import { useAuthStore } from "@/lib/auth-store";
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
  Edit3,
  Tag as TagIcon,
  Globe,
  FileText,
  Clock,
  Sparkles,
  Info,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/blogs/new")({
  component: AdminNewBlogPage,
});

function AdminNewBlogPage() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);

  const createMutation = useCreateBlog();
  const { data: categoriesData = [] } = useAdminCategories();
  const existingCategories = categoriesData.map((c) => c.category);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [customSlugEdited, setCustomSlugEdited] = useState(false);
  const [category, setCategory] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState(currentUser?.name || "LaMoksh");
  const [status, setStatus] = useState<BlogStatus>("DRAFT");

  // Featured Image
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null);
  const [featuredImageAlt, setFeaturedImageAlt] = useState("");

  // Gallery Images
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [galleryAltTexts, setGalleryAltTexts] = useState<string[]>([]);

  // Tags Chips
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Keywords Chips
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");

  // SEO Accordion
  const [seoOpen, setSeoOpen] = useState(false);
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  // Editor Mode (Write vs Preview)
  const [editorTab, setEditorTab] = useState<"write" | "preview">("write");
  const [uploadingInline, setUploadingInline] = useState(false);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-generate slug from title unless manually edited
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!customSlugEdited) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(generated);
    }
  };

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

    setFeaturedImage(file);
    const reader = new FileReader();
    reader.onload = () => setFeaturedImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeFeaturedImage = () => {
    setFeaturedImage(null);
    setFeaturedImagePreview(null);
    setFeaturedImageAlt("");
  };

  // Gallery Images Handlers
  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = 10 - galleryImages.length;
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

    setGalleryImages((prev) => [...prev, ...validFiles]);

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setGalleryPreviews((prev) => [...prev, reader.result as string]);
        setGalleryAltTexts((prev) => [...prev, file.name.replace(/\.[^/.]+$/, "")]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    setGalleryAltTexts((prev) => prev.filter((_, i) => i !== index));
  };

  // Editor Toolbar Helpers
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
      const uploaded = await BlogApi.uploadInlineImage(file, file.name);
      const url = getMediaUrl(uploaded.url);
      const imgHtml = `\n<figure class="my-6">\n  <img src="${url}" alt="${uploaded.altText || ""}" class="w-full rounded-sm object-cover shadow-xs" />\n  <figcaption class="text-xs text-stone-500 mt-2 text-center italic">${uploaded.altText || ""}</figcaption>\n</figure>\n`;
      insertFormatting(imgHtml, "", "");
      toast.success("Inline image uploaded and inserted into article");
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

  // Form Submit
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
      toast.error("Short description must be between 5 and 2000 characters");
      return;
    }

    if (!content.trim()) {
      toast.error("Article content is required");
      return;
    }

    // Flush any pending tag/keyword in input
    const finalTags = [...tags];
    if (tagInput.trim() && !finalTags.includes(tagInput.trim().replace(/^#/, ""))) {
      finalTags.push(tagInput.trim().replace(/^#/, ""));
    }

    const finalKeywords = [...keywords];
    if (keywordInput.trim() && !finalKeywords.includes(keywordInput.trim())) {
      finalKeywords.push(keywordInput.trim());
    }

    try {
      await createMutation.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        category: category.trim(),
        slug: slug.trim() || undefined,
        author: author.trim() || undefined,
        seoTitle: seoTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
        status,
        featuredImageAlt: featuredImageAlt.trim() || undefined,
        featuredImage: featuredImage || undefined,
        images: galleryImages.length > 0 ? galleryImages : undefined,
        imageAltTexts: galleryAltTexts.length > 0 ? galleryAltTexts : undefined,
        tags: finalTags.length > 0 ? finalTags : undefined,
        keywords: finalKeywords.length > 0 ? finalKeywords : undefined,
      });

      navigate({ to: "/admin/blogs" as any });
    } catch {
      // Error handled by mutation onError
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header Bar */}
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
            <h1 className="text-2xl font-serif font-light text-[#1C1917]">Write Journal Article</h1>
            <p className="text-xs text-[#78716C] mt-0.5">
              Draft and publish stories for the LaMoksh storefront journal.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/admin/blogs" as any })}
            className="px-4 py-2 border border-[#E7E5E4] text-[#1C1917] text-xs uppercase font-semibold hover:bg-[#FAF8F5]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={createMutation.isPending}
            className="flex items-center space-x-2 px-6 py-2 bg-[#6B1D2F] text-white text-xs uppercase font-semibold hover:bg-[#521624] transition-colors disabled:opacity-50"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{status === "PUBLISHED" ? "Publish Article" : "Save Draft"}</span>
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
              onChange={(e) => handleTitleChange(e.target.value)}
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
                placeholder="e.g., LaMoksh"
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
                <option value="DRAFT">DRAFT (Saved as unpublished draft)</option>
                <option value="PUBLISHED">PUBLISHED (Visible live on Storefront)</option>
                <option value="ARCHIVED">ARCHIVED (Archived from public view)</option>
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
              <span className="text-[11px] text-[#78716C]">File field: featuredImage</span>
            </div>

            {featuredImagePreview ? (
              <div className="relative aspect-[16/9] max-w-lg overflow-hidden border border-[#E7E5E4] bg-neutral-100">
                <img
                  src={featuredImagePreview}
                  alt="Featured preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeFeaturedImage}
                  className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full hover:bg-black transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-[#E7E5E4] bg-[#FAF8F5] p-6 text-center hover:bg-neutral-50 transition-colors">
                <input
                  type="file"
                  id="featured-image-file"
                  accept="image/*"
                  onChange={handleFeaturedImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="featured-image-file"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="w-8 h-8 text-[#6B1D2F]" />
                  <span className="text-xs font-semibold text-[#1C1917]">
                    Click or drag to upload featured cover image
                  </span>
                  <span className="text-[11px] text-[#78716C]">
                    JPG, PNG, WEBP up to 50MB. Stored in /uploads/blogs/featured/
                  </span>
                </label>
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
                        insertFormatting("<blockquote><p>", "</p></blockquote>", "LaMoksh Quote")
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
                      htmlFor="inline-image-file"
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
                      id="inline-image-file"
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
                  placeholder="Write article HTML content here. Use the formatting buttons above or type HTML directly. Slugs, tags, and inline images will render cleanly..."
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
                      No content written yet. Switch to "Write" tab to compose your article.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Gallery Images (up to 10 files) */}
          <div className="space-y-3 pt-2 border-t border-[#E7E5E4]">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Gallery Images (up to 10 files)
                </label>
                <p className="text-[11px] text-[#78716C] mt-0.5">
                  Upload supplementary gallery images. Stored in /uploads/blogs/images/.
                </p>
              </div>
              <span className="text-[11px] text-[#78716C]">{galleryPreviews.length} / 10 images</span>
            </div>

            {galleryPreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {galleryPreviews.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[4/3] border border-[#E7E5E4] bg-neutral-100 flex flex-col justify-between"
                  >
                    <img src={src} alt="Gallery item" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full hover:bg-black transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <input
                      type="text"
                      placeholder="Alt text"
                      value={galleryAltTexts[idx] || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setGalleryAltTexts((prev) => {
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
            )}

            {galleryPreviews.length < 10 && (
              <div>
                <input
                  type="file"
                  id="gallery-images-file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryImagesChange}
                  className="hidden"
                />
                <label
                  htmlFor="gallery-images-file"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs font-semibold text-[#1C1917] hover:bg-neutral-100 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-[#6B1D2F]" />
                  <span>Choose Gallery Files</span>
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
                Customize slug, meta title, and description for search engines
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
                    Custom URL Slug (auto-generated if omitted)
                  </label>
                  <span className="text-[11px] text-[#78716C]">
                    Backend auto-resolves collisions with -1, -2
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
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setCustomSlugEdited(true);
                    }}
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
                  placeholder="Defaults to article title if omitted"
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
                  placeholder="Defaults to short description if omitted"
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
            disabled={createMutation.isPending}
            className="flex items-center space-x-2 px-8 py-2.5 bg-[#6B1D2F] text-white text-xs uppercase font-semibold hover:bg-[#521624] transition-colors shadow-sm disabled:opacity-50"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Article...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{status === "PUBLISHED" ? "Publish Article" : "Save Draft"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
