import { useEffect } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { usePublicBlog } from "@/hooks/use-blogs";
import { getMediaUrl } from "@/lib/media";
import brandStory from "@/assets/brand-story.jpg";
import { Calendar, User, ArrowLeft, Tag, Loader2, BookOpen, Clock, Share2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/journal/$slug")({
  component: JournalArticlePage,
});

const DEFAULT_COVER = brandStory;

function JournalArticlePage() {
  const { slug } = useParams({ from: "/journal/$slug" });
  const { data: blog, isLoading, isError } = usePublicBlog(slug);

  // Dynamic SEO title & description update
  useEffect(() => {
    if (blog) {
      document.title = blog.seoTitle || `${blog.title} — LaMoksh Fabrics Journal`;
      if (blog.metaDescription) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute("content", blog.metaDescription);
        }
      }
    }
  }, [blog]);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share && blog) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.description,
          url: window.location.href,
        });
      } catch {
        // User cancelled or unsupported
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Article link copied to clipboard");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background text-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-[#6B1D2F]" />
        <p className="mt-4 font-serif text-sm text-muted-foreground">Opening atelier article...</p>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="container-lux min-h-[60vh] flex flex-col items-center justify-center text-center py-24">
        <BookOpen className="h-12 w-12 text-[#6B1D2F]/70 mb-4 stroke-[1.2]" />
        <h1 className="font-serif text-2xl md:text-3xl text-foreground">Article Not Found</h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-md">
          The atelier article you requested could not be located. It may have been archived or
          moved.
        </p>
        <Link
          to="/blogs"
          className="mt-8 inline-flex items-center gap-2 bg-[#6B1D2F] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#521624]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Journal & Blogs</span>
        </Link>
      </div>
    );
  }

  const coverSrc = getMediaUrl(blog.featuredImage) || DEFAULT_COVER;
  const displayDate = blog.publishedAt || blog.createdAt;

  // Approximate reading time (words / 200 wpm)
  const wordCount = (blog.content || "").replace(/<[^>]*>/g, "").split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article className="min-h-screen bg-background text-foreground pb-24">
      {/* Article Header & Breadcrumbs */}
      <header className="border-b border-border/80 bg-[#FAF7F2] py-12 md:py-16">
        <div className="container-lux max-w-4xl">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6 uppercase tracking-wider">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/blogs" className="hover:text-foreground transition-colors">
              Journal
            </Link>
            <span>/</span>
            <span className="text-[#6B1D2F] truncate max-w-[200px] md:max-w-none">
              {blog.category || "Article"}
            </span>
          </nav>

          {blog.category && (
            <div className="mb-4">
              <span className="inline-block bg-[#6B1D2F] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white shadow-xs">
                {blog.category}
              </span>
            </div>
          )}

          <h1 className="font-serif text-3xl md:text-5xl font-normal leading-tight text-foreground">
            {blog.title}
          </h1>

          {blog.description && (
            <p className="mt-6 text-base md:text-lg text-[#57534E] leading-relaxed font-serif">
              {blog.description}
            </p>
          )}

          {/* Meta Information Bar */}
          <div className="mt-8 pt-6 border-t border-border/70 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center gap-6">
              <span className="flex items-center gap-2">
                <User className="h-4 w-4 text-[#6B1D2F]" />
                <span className="font-medium text-foreground">
                  {blog.author || "LaMoksh Atelier"}
                </span>
              </span>
              {displayDate && (
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#6B1D2F]" />
                  <span>
                    {new Date(displayDate).toLocaleDateString("en-IN", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </span>
              )}
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#6B1D2F]" />
                <span>{readTime} min read</span>
              </span>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6B1D2F] hover:text-[#4D1220] transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="container-lux max-w-4xl mt-10">
        <div className="relative aspect-[16/9] w-full overflow-hidden border border-border/70 bg-neutral-100 shadow-sm">
          <img
            src={coverSrc}
            alt={blog.featuredImageAlt || blog.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_COVER;
            }}
          />
        </div>
        {blog.featuredImageAlt && (
          <p className="mt-2 text-center text-xs italic text-muted-foreground">
            {blog.featuredImageAlt}
          </p>
        )}
      </div>

      {/* Article HTML Content */}
      <div className="container-lux max-w-3xl mt-12">
        <div
          className="prose prose-stone max-w-none leading-relaxed text-[#292524] prose-headings:font-serif prose-headings:font-normal prose-headings:text-[#1C1917] prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-p:my-4 prose-p:text-base prose-p:leading-8 prose-a:text-[#6B1D2F] prose-a:underline hover:prose-a:text-[#4D1220] prose-img:border prose-img:border-border/70 prose-img:my-8 prose-blockquote:border-l-4 prose-blockquote:border-[#6B1D2F] prose-blockquote:bg-[#FAF7F2] prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:italic"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Gallery Images Section */}
        {blog.images && blog.images.length > 0 && (
          <div className="mt-14 pt-10 border-t border-border/70">
            <h2 className="font-serif text-xl font-normal text-foreground mb-6">
              Atelier Visual Archive
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blog.images.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-[4/3] overflow-hidden border border-border/70 bg-neutral-100"
                >
                  <img
                    src={getMediaUrl(img.url)}
                    alt={img.altText || "Atelier gallery image"}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  {img.altText && (
                    <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[11px] px-3 py-1.5 backdrop-blur-xs">
                      {img.altText}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags Section */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border/70">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Related Topics:
            </p>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF7F2] border border-border/80 text-xs text-[#44403C]"
                >
                  <Tag className="h-3 w-3 text-[#6B1D2F]" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Atelier Footer Note */}
        <div className="mt-14 border border-border/80 bg-[#FAF7F2] p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="h-16 w-16 shrink-0 rounded-full bg-[#6B1D2F] flex items-center justify-center font-serif text-2xl font-bold text-white shadow-xs">
            {(blog.author || "L").charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-serif text-lg text-foreground font-medium">
              Written by {blog.author || "LaMoksh Fabrics Atelier"}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Curating stories of authentic Indian textiles, hand-spun fibers, and contemporary
              royal drapes from master artisans across Varanasi and India.
            </p>
          </div>
        </div>

        {/* Back to blogs link */}
        <div className="mt-12 text-center">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#6B1D2F] hover:text-[#4D1220] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Articles</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
