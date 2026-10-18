import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import {
  X,
  Calendar,
  User,
  Clock,
  Share2,
  ExternalLink,
  Maximize2,
  Tag,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Blog } from "@/types/blog";
import { getMediaUrl } from "@/lib/media";
import { BlogContentRenderer } from "@/components/blog/BlogContentRenderer";
import { BlogImageLightbox } from "@/components/blog/BlogImageLightbox";
import brandStory from "@/assets/brand-story.jpg";

interface BlogDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: Blog | null;
}

const DEFAULT_COVER = brandStory;

export function BlogDetailsModal({ isOpen, onClose, blog }: BlogDetailsModalProps) {
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState<string>("");

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !lightboxUrl) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, lightboxUrl, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !blog || typeof document === "undefined") return null;

  const coverSrc = getMediaUrl(blog.featuredImage) || DEFAULT_COVER;
  const displayDate = blog.publishedAt || blog.createdAt;

  // Approximate reading time
  const wordCount = (blog.content || "").replace(/<[^>]*>/g, "").split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleShare = async () => {
    const fullUrl = `${window.location.origin}/journal/${blog.slug}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.description,
          url: fullUrl,
        });
      } catch {
        // User cancelled or unsupported
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(fullUrl);
      toast.success("Article link copied to clipboard");
    }
  };

  const openLightbox = (url: string, alt?: string) => {
    setLightboxUrl(url);
    setLightboxAlt(alt || blog.title);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in-0 duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1C1917]/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Window */}
      <div className="relative z-10 flex flex-col h-full sm:h-auto sm:max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-none sm:rounded-sm border border-[#28201C]/15 bg-[#FAF8F5] text-[#28201C] shadow-2xl">
        {/* Sticky Top Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#28201C]/10 bg-white/95 px-5 py-3.5 backdrop-blur-md">
          <div className="flex items-center gap-3 overflow-hidden">
            {blog.category && (
              <span className="shrink-0 bg-[#6B1D2F] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white rounded-2xs shadow-xs">
                {blog.category}
              </span>
            )}
            <h3 className="truncate font-serif text-sm md:text-base font-normal text-[#1C1917]">
              {blog.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-4">
            {/* Direct Full-Page Link */}
            <Link
              to="/journal/$slug"
              params={{ slug: blog.slug }}
              title="Open full article page"
              className="flex items-center gap-1.5 rounded-xs border border-[#28201C]/20 bg-[#FAF7F2] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#1C1917] transition-colors hover:border-[#6B1D2F] hover:bg-[#6B1D2F] hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Full Page</span>
            </Link>

            {/* Share Button */}
            <button
              type="button"
              aria-label="Share article"
              onClick={handleShare}
              className="flex h-8 w-8 items-center justify-center rounded-xs border border-[#28201C]/20 text-[#28201C]/80 transition-colors hover:bg-stone-100 hover:text-[#28201C]"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>

            {/* Close Button */}
            <button
              type="button"
              aria-label="Close dialog"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xs bg-[#28201C]/5 text-[#28201C] transition-colors hover:bg-[#28201C]/15 hover:text-[#6B1D2F]"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 md:px-12">
          {/* Article Header */}
          <div className="mb-6">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal leading-tight text-[#1C1917]">
              {blog.title}
            </h1>

            {blog.description && (
              <p className="mt-4 text-base md:text-lg text-[#57534E] leading-relaxed font-serif">
                {blog.description}
              </p>
            )}

            {/* Meta Information Bar */}
            <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6 border-y border-[#28201C]/10 py-3 text-xs text-[#78716C]">
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-[#6B1D2F]" />
                <span className="font-medium text-[#1C1917]">{blog.author || "LaMoksh Atelier"}</span>
              </span>
              {displayDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#6B1D2F]" />
                  <span>
                    {new Date(displayDate).toLocaleDateString("en-IN", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#6B1D2F]" />
                <span>{readTime} min read</span>
              </span>
            </div>
          </div>

          {/* Featured Cover Image - Uncropped & Interactive */}
          <div className="relative my-6 w-full overflow-hidden rounded-xs border border-[#28201C]/10 bg-[#FAF7F2] p-2 sm:p-4 flex items-center justify-center group shadow-xs">
            <img
              src={coverSrc}
              alt={blog.featuredImageAlt || blog.title}
              className="max-h-[460px] w-auto max-w-full object-contain mx-auto rounded-xs cursor-zoom-in transition-transform duration-300 group-hover:scale-[1.01]"
              onClick={() => openLightbox(coverSrc, blog.title)}
            />
            {/* Floating Zoom Button */}
            <button
              type="button"
              onClick={() => openLightbox(coverSrc, blog.title)}
              className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#1C1917] rounded-xs shadow-md opacity-90 transition-all hover:bg-[#6B1D2F] hover:text-white"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Full Image</span>
            </button>
          </div>

          {/* Point-wise Rendered Article Content */}
          <div className="mt-8">
            <BlogContentRenderer content={blog.content} />
          </div>

          {/* Gallery Images (if available) - Uncropped with Lightbox */}
          {blog.images && blog.images.length > 0 && (
            <div className="mt-12 pt-8 border-t border-[#28201C]/10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-[#6B1D2F]" />
                <h3 className="font-serif text-lg font-normal text-[#1C1917]">
                  Atelier Visual Archive
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {blog.images.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => openLightbox(getMediaUrl(img.url), img.altText)}
                    className="group relative max-h-[300px] overflow-hidden rounded-xs border border-[#28201C]/10 bg-[#FAF7F2] p-2 cursor-zoom-in"
                  >
                    <img
                      src={getMediaUrl(img.url)}
                      alt={img.altText || "Atelier gallery image"}
                      loading="lazy"
                      className="max-h-[280px] w-auto max-w-full object-contain mx-auto transition-transform duration-300 group-hover:scale-105"
                    />
                    {img.altText && (
                      <div className="absolute bottom-2 inset-x-2 bg-black/60 text-white text-[10px] px-2.5 py-1 backdrop-blur-xs rounded-xs truncate">
                        {img.altText}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-[#28201C]/10 flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-[#78716C] font-semibold">
                Tags:
              </span>
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#28201C]/10 text-xs text-[#44403C] rounded-2xs"
                >
                  <Tag className="h-3 w-3 text-[#6B1D2F]" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Author Note */}
          <div className="mt-10 border border-[#28201C]/10 bg-white p-6 rounded-xs flex flex-col sm:flex-row items-center gap-4">
            <div className="h-12 w-12 shrink-0 rounded-full bg-[#6B1D2F] flex items-center justify-center font-serif text-xl font-bold text-white shadow-xs">
              {(blog.author || "L").charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-serif text-base text-[#1C1917] font-medium">
                Written by {blog.author || "LaMoksh Fabrics Atelier"}
              </h4>
              <p className="mt-1 text-xs text-[#78716C] leading-relaxed">
                Curating stories of authentic Indian textiles, hand-spun fibers, and contemporary
                royal drapes directly from master artisans.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="border-t border-[#28201C]/10 bg-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link
            to="/clothing"
            className="text-xs font-semibold uppercase tracking-wider text-[#6B1D2F] hover:underline"
          >
            Explore Suit Sets & Sarees Collection →
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-[#28201C]/20 hover:bg-stone-100 transition-colors"
            >
              Close
            </button>
            <Link
              to="/journal/$slug"
              params={{ slug: blog.slug }}
              className="inline-flex items-center gap-2 bg-[#6B1D2F] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-[#521624] transition-colors"
            >
              <span>Read Full Page</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox for Full Uncropped Image Preview */}
      <BlogImageLightbox
        isOpen={Boolean(lightboxUrl)}
        onClose={() => setLightboxUrl(null)}
        imageUrl={lightboxUrl || ""}
        altText={lightboxAlt}
      />
    </div>,
    document.body,
  );
}
