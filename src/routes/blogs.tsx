import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { usePublicBlogs, usePublicCategories } from "@/hooks/use-blogs";
import { getMediaUrl } from "@/lib/media";
import brandStory from "@/assets/brand-story.jpg";
import { Reveal } from "@/components/site/Reveal";
import { BlogDetailsModal } from "@/components/blog/BlogDetailsModal";
import { Blog } from "@/types/blog";
import {
  BookOpen,
  Calendar,
  User,
  ArrowRight,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Tag,
  Loader2,
  Eye,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/blogs")({
  head: () => ({
    meta: [
      { title: "Journal & Blogs — LaMoksh Fabrics" },
      {
        name: "description",
        content:
          "Read stories of royal handlooms, Varanasi weaving traditions, fabric care guides, and artisanal craft directly from LaMoksh Fabrics.",
      },
      { property: "og:title", content: "Journal & Blogs — LaMoksh Fabrics" },
      {
        property: "og:description",
        content: "Discover Indian textile heritage and stories from LaMoksh Fabrics.",
      },
      { property: "og:url", content: "/blogs" },
    ],
    links: [{ rel: "canonical", href: "/blogs" }],
  }),
  component: BlogsPage,
});

const DEFAULT_COVER = brandStory;

function BlogsPage() {
  const [page, setPage] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const { data: categoriesData } = usePublicCategories();
  const categories = categoriesData || [];

  const { data, isLoading, isError, refetch } = usePublicBlogs({
    page,
    limit: 12,
    category: selectedCategory || undefined,
    search: searchQuery || undefined,
    sortBy: "publishedAt",
    sortOrder: "desc",
  });

  const blogs = data?.blogs || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 12, totalPages: 1 };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
    setPage(1);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setPage(1);
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory((prev) => (prev === cat ? "" : cat));
    setPage(1);
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-border/80 bg-[#FAF7F2] py-16 md:py-24 text-center">
        <div className="container-lux max-w-3xl">
          <Reveal>
            <p className="eyebrow text-[#6B1D2F]">The LaMoksh Journal</p>
            <h1 className="display-lg mt-3 font-serif text-foreground">Stories & Weaving Notes</h1>
            <p className="body-lux mt-4 text-muted-foreground text-sm md:text-base">
              A curated archive exploring India&apos;s rich textile heritage, pit loom weaving
              techniques, and modern luxury styling.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="border-b border-border/60 bg-white py-6">
        <div className="container-lux flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Categories Pill Filters */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => handleCategorySelect("")}
              className={`px-4 py-1.5 text-xs font-semibold tracking-wider uppercase transition-all ${
                selectedCategory === ""
                  ? "bg-[#6B1D2F] text-white shadow-sm"
                  : "bg-[#FAF7F2] text-[#44403C] hover:bg-neutral-200"
              }`}
            >
              All Stories
            </button>
            {categories.map((c) => (
              <button
                key={c.category}
                type="button"
                onClick={() => handleCategorySelect(c.category)}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase transition-all ${
                  selectedCategory === c.category
                    ? "bg-[#6B1D2F] text-white shadow-sm"
                    : "bg-[#FAF7F2] text-[#44403C] hover:bg-neutral-200"
                }`}
              >
                <span>{c.category}</span>
                {typeof c.count === "number" && (
                  <span className="text-[10px] opacity-75 font-normal">({c.count})</span>
                )}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search articles..."
              className="w-full bg-[#FAF7F2] border border-border/80 pl-9 pr-8 py-2 text-xs focus:bg-white focus:outline-none focus:border-[#6B1D2F] transition-colors"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </form>
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="py-16 md:py-20">
        <div className="container-lux">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-[#6B1D2F]" />
              <p className="mt-4 font-serif text-sm">Loading stories...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="font-serif text-lg text-rose-800">
                Unable to load journal stories at this moment.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 px-6 py-2 bg-[#6B1D2F] text-white text-xs uppercase tracking-wider font-semibold"
              >
                Try Again
              </button>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <BookOpen className="mx-auto h-12 w-12 stroke-[1.2] text-[#6B1D2F]/60" />
              <p className="mt-4 font-serif text-lg">
                {searchQuery || selectedCategory
                  ? "No stories found matching your filter."
                  : "New articles coming soon."}
              </p>
              {(searchQuery || selectedCategory) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("");
                    clearSearch();
                  }}
                  className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#6B1D2F] hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog) => {
                  const coverSrc = getMediaUrl(blog.featuredImage) || DEFAULT_COVER;
                  const displayDate = blog.publishedAt || blog.createdAt;

                  return (
                    <article
                      key={blog.id}
                      className="group flex flex-col overflow-hidden border border-border/70 bg-white shadow-xs transition-all duration-300 hover:shadow-md hover:border-[#6B1D2F]/40"
                    >
                      {/* Card Image Area with Quick Read Hover */}
                      <div
                        onClick={() => setSelectedBlog(blog)}
                        className="relative aspect-[16/11] overflow-hidden bg-neutral-100 block cursor-pointer"
                      >
                        <img
                          src={coverSrc}
                          alt={blog.featuredImageAlt || blog.title}
                          loading="lazy"
                          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = DEFAULT_COVER;
                          }}
                        />
                        {blog.category && (
                          <span className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#6B1D2F] backdrop-blur-sm shadow-xs">
                            {blog.category}
                          </span>
                        )}
                        {/* Hover Quick Read Button */}
                        <div className="absolute inset-0 bg-[#1C1917]/25 opacity-0 transition-opacity duration-300 flex items-center justify-center group-hover:opacity-100">
                          <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#1C1917] rounded-xs shadow-md">
                            <Eye className="h-3.5 w-3.5 text-[#6B1D2F]" />
                            <span>Quick Read</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {displayDate && (
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-[#6B1D2F]" />
                              {new Date(displayDate).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-[#6B1D2F]" />
                            {blog.author || "LaMoksh"}
                          </span>
                        </div>

                        <h2
                          onClick={() => setSelectedBlog(blog)}
                          className="mt-3 font-serif text-xl font-normal leading-snug text-foreground transition-colors group-hover:text-[#6B1D2F] cursor-pointer"
                        >
                          {blog.title}
                        </h2>

                        <p className="body-lux mt-3 flex-1 line-clamp-3 text-sm text-muted-foreground">
                          {blog.description}
                        </p>

                        {blog.tags && blog.tags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {blog.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/80 bg-neutral-100 px-2 py-0.5"
                              >
                                <Tag className="h-2.5 w-2.5 text-[#6B1D2F]" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => setSelectedBlog(blog)}
                            className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[#6B1D2F] transition-colors hover:text-[#4D1220]"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Quick View</span>
                          </button>

                          <Link
                            to="/journal/$slug"
                            params={{ slug: blog.slug }}
                            className="inline-flex items-center gap-1 text-[11px] font-sans font-medium uppercase tracking-wider text-muted-foreground hover:text-[#1C1917] transition-colors"
                          >
                            <span>Full Page</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {meta.totalPages > 1 && (
                <div className="mt-14 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 400, behavior: "smooth" });
                    }}
                    disabled={page <= 1}
                    className="p-2 border border-border/80 bg-white text-foreground disabled:opacity-30 disabled:pointer-events-none hover:bg-neutral-50 transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setPage(p);
                        window.scrollTo({ top: 400, behavior: "smooth" });
                      }}
                      className={`h-9 w-9 text-xs font-semibold transition-colors ${
                        page === p
                          ? "bg-[#6B1D2F] text-white"
                          : "border border-border/80 bg-white text-foreground hover:bg-neutral-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setPage((p) => Math.min(meta.totalPages, p + 1));
                      window.scrollTo({ top: 400, behavior: "smooth" });
                    }}
                    disabled={page >= meta.totalPages}
                    className="p-2 border border-border/80 bg-white text-foreground disabled:opacity-30 disabled:pointer-events-none hover:bg-neutral-50 transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Interactive Blog Details Modal */}
      <BlogDetailsModal
        isOpen={Boolean(selectedBlog)}
        blog={selectedBlog}
        onClose={() => setSelectedBlog(null)}
      />
    </div>
  );
}
