import React, { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  useAdminBlogs,
  usePublishBlog,
  useUnpublishBlog,
  useDeleteBlog,
  useAdminCategories,
  usePublicTags,
} from "@/hooks/use-blogs";
import { getMediaUrl } from "@/lib/media";
import { BlogStatus, BlogPost } from "@/types/blog";
import {
  Plus,
  Edit,
  Trash2,
  BookOpen,
  ExternalLink,
  Search,
  X,
  CheckCircle,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Download,
  LayoutGrid,
  LayoutList,
  CheckSquare,
  Square,
  ArrowUpDown,
  Tag as TagIcon,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import brandStory from "@/assets/brand-story.jpg";

export const Route = createFileRoute("/admin/blogs/")({
  component: AdminBlogsPage,
});

const DEFAULT_COVER = brandStory;
type StatusTab = "ALL" | BlogStatus;
type SortByOption = "createdAt" | "updatedAt" | "publishedAt" | "title";
type SortOrderOption = "asc" | "desc";

function AdminBlogsPage() {
  const navigate = useNavigate();

  // Query parameters state matching backend API
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [statusTab, setStatusTab] = useState<StatusTab>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [tagFilter, setTagFilter] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortByOption>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrderOption>("desc");

  // View Mode: Table vs Grid
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Selection & Modal States
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState<boolean>(false);
  const [isBulkOperating, setIsBulkOperating] = useState<boolean>(false);

  // Debounce search query by 400ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Fetch categories & tags from backend
  const { data: categoriesData = [] } = useAdminCategories();
  const { data: tagsData = [] } = usePublicTags();

  // Query admin blogs with full backend parameters
  const { data, isLoading, isRefetching, isError, refetch } = useAdminBlogs({
    page,
    limit,
    status: statusTab === "ALL" ? undefined : statusTab,
    category: categoryFilter || undefined,
    tag: tagFilter || undefined,
    search: debouncedSearch || undefined,
    sortBy,
    sortOrder,
  });

  const blogs = data?.blogs || [];
  const meta = data?.meta || { total: 0, page: 1, limit, totalPages: 1 };

  // Mutations
  const publishMutation = usePublishBlog();
  const unpublishMutation = useUnpublishBlog();
  const deleteMutation = useDeleteBlog();

  // Reset page when filters change
  const handleStatusTabChange = (tab: StatusTab) => {
    setStatusTab(tab);
    setPage(1);
    setSelectedIds([]);
  };

  const handleCategoryChange = (cat: string) => {
    setCategoryFilter(cat);
    setPage(1);
    setSelectedIds([]);
  };

  const handleTagChange = (tag: string) => {
    setTagFilter(tag);
    setPage(1);
    setSelectedIds([]);
  };

  const handleSortByChange = (field: SortByOption) => {
    setSortBy(field);
    setPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const resetAllFilters = () => {
    setStatusTab("ALL");
    setCategoryFilter("");
    setTagFilter("");
    setSearchInput("");
    setDebouncedSearch("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
    setSelectedIds([]);
  };

  const hasActiveFilters =
    statusTab !== "ALL" ||
    categoryFilter !== "" ||
    tagFilter !== "" ||
    debouncedSearch !== "" ||
    sortBy !== "createdAt" ||
    sortOrder !== "desc";

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === blogs.length && blogs.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(blogs.map((b) => b.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Bulk operations
  const handleBulkPublish = async () => {
    if (!selectedIds.length) return;
    setIsBulkOperating(true);
    try {
      await Promise.all(selectedIds.map((id) => publishMutation.mutateAsync(id)));
      toast.success(`${selectedIds.length} article(s) published successfully`);
      setSelectedIds([]);
      refetch();
    } catch {
      toast.error("Failed to publish some selected articles");
    } finally {
      setIsBulkOperating(false);
    }
  };

  const handleBulkUnpublish = async () => {
    if (!selectedIds.length) return;
    setIsBulkOperating(true);
    try {
      await Promise.all(selectedIds.map((id) => unpublishMutation.mutateAsync(id)));
      toast.success(`${selectedIds.length} article(s) moved to drafts`);
      setSelectedIds([]);
      refetch();
    } catch {
      toast.error("Failed to unpublish some selected articles");
    } finally {
      setIsBulkOperating(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    setIsBulkOperating(true);
    try {
      await Promise.all(selectedIds.map((id) => deleteMutation.mutateAsync(id)));
      toast.success(`${selectedIds.length} article(s) permanently deleted`);
      setSelectedIds([]);
      setShowBulkDeleteModal(false);
      refetch();
    } catch {
      toast.error("Failed to delete some selected articles");
    } finally {
      setIsBulkOperating(false);
    }
  };

  const handleConfirmSingleDelete = async () => {
    if (!postToDelete) return;
    await deleteMutation.mutateAsync(postToDelete.id);
    setSelectedIds((prev) => prev.filter((id) => id !== postToDelete.id));
    setPostToDelete(null);
  };

  const copySlugToClipboard = (slugText: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(slugText);
      toast.success(`Copied slug: "${slugText}"`);
    }
  };

  // Export articles to CSV
  const exportToCSV = () => {
    if (!blogs.length) {
      toast.error("No articles to export");
      return;
    }

    const headers = [
      "ID",
      "Title",
      "Slug",
      "Category",
      "Author",
      "Status",
      "Tags",
      "Published At",
      "Created At",
    ];

    const rows = blogs.map((b) => [
      `"${b.id}"`,
      `"${b.title.replace(/"/g, '""')}"`,
      `"${b.slug}"`,
      `"${b.category}"`,
      `"${b.author || ""}"`,
      `"${b.status}"`,
      `"${(b.tags || []).join(", ")}"`,
      `"${b.publishedAt ? new Date(b.publishedAt).toISOString() : ""}"`,
      `"${new Date(b.createdAt).toISOString()}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lamoksh_blogs_${statusTab.toLowerCase()}_page${page}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported articles to CSV");
  };

  const renderStatusBadge = (status: BlogStatus) => {
    switch (status) {
      case "PUBLISHED":
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase font-semibold border bg-emerald-50 text-emerald-800 border-emerald-200">
            Published
          </span>
        );
      case "DRAFT":
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase font-semibold border bg-amber-50 text-amber-800 border-amber-200">
            Draft
          </span>
        );
      case "ARCHIVED":
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase font-semibold border bg-neutral-100 text-neutral-700 border-neutral-300">
            Archived
          </span>
        );
    }
  };

  // Showing range calculation
  const startItem = meta.total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, meta.total);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 border border-[#E7E5E4] shadow-sm">
        <div>
          <h1 className="text-2xl font-serif font-light text-[#1C1917]">
            Journal & Atelier Blog Posts
          </h1>
          <p className="text-xs text-[#78716C] mt-1 font-sans">
            Manage editorial stories, artisan craftsmanship, and textile guides across draft,
            published, and archived states.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* Refresh button */}
          <button
            type="button"
            onClick={() => refetch()}
            className="flex items-center space-x-1.5 px-3 py-2 border border-[#E7E5E4] text-[#1C1917] bg-white hover:bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wider transition-colors"
            title="Refresh articles"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-[#6B1D2F] ${isRefetching ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Export CSV button */}
          <button
            type="button"
            onClick={exportToCSV}
            className="flex items-center space-x-1.5 px-3 py-2 border border-[#E7E5E4] text-[#1C1917] bg-white hover:bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wider transition-colors"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#6B1D2F]" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* Write New Article button */}
          <Link
            to="/admin/blogs/new"
            className="flex items-center space-x-2 px-5 py-2 bg-[#6B1D2F] text-white hover:bg-[#521624] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Article</span>
          </Link>
        </div>
      </div>

      {/* Tabs and Filters Bar */}
      <div className="bg-white border border-[#E7E5E4] p-5 shadow-sm space-y-4">
        {/* Status Tabs and View Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E7E5E4] pb-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1">
            {(["ALL", "PUBLISHED", "DRAFT", "ARCHIVED"] as StatusTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => handleStatusTabChange(tab)}
                className={`px-4 py-1.5 text-xs font-semibold tracking-wider uppercase transition-colors border-b-2 -mb-[13px] ${
                  statusTab === tab
                    ? "border-[#6B1D2F] text-[#6B1D2F]"
                    : "border-transparent text-[#78716C] hover:text-[#1C1917]"
                }`}
              >
                {tab === "ALL" ? "All Articles" : tab}
              </button>
            ))}
          </div>

          {/* View Mode Toggle & Total Count */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#78716C]">
              Total: <span className="font-semibold text-[#1C1917]">{meta.total}</span> articles
            </span>

            <div className="flex items-center border border-[#E7E5E4] bg-[#FAF8F5] p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 transition-colors ${
                  viewMode === "table"
                    ? "bg-white text-[#6B1D2F] shadow-xs"
                    : "text-[#78716C] hover:text-[#1C1917]"
                }`}
                title="Table View"
                aria-label="Table View"
              >
                <LayoutList className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-[#6B1D2F] shadow-xs"
                    : "text-[#78716C] hover:text-[#1C1917]"
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Search, Category, Tag, Sort Controls matching Backend Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {/* 1. Search Box */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A8A29E] pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search title, author, text..."
              className="w-full pl-9 pr-7 py-2 text-xs border border-[#E7E5E4] bg-[#FAF8F5] text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 2. Category Selector */}
          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="py-2 px-3 text-xs border border-[#E7E5E4] bg-[#FAF8F5] text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
          >
            <option value="">All Categories</option>
            {categoriesData.map((c) => (
              <option key={c.category} value={c.category}>
                {c.category} ({c.count})
              </option>
            ))}
          </select>

          {/* 3. Tag Selector */}
          <select
            value={tagFilter}
            onChange={(e) => handleTagChange(e.target.value)}
            className="py-2 px-3 text-xs border border-[#E7E5E4] bg-[#FAF8F5] text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
          >
            <option value="">All Tags</option>
            {tagsData.map((t) => (
              <option key={t} value={t}>
                #{t}
              </option>
            ))}
          </select>

          {/* 4. Sort By Selector */}
          <div className="flex gap-1.5">
            <select
              value={sortBy}
              onChange={(e) => handleSortByChange(e.target.value as SortByOption)}
              className="flex-1 py-2 px-2.5 text-xs border border-[#E7E5E4] bg-[#FAF8F5] text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
            >
              <option value="createdAt">Sort: Created Date</option>
              <option value="publishedAt">Sort: Published Date</option>
              <option value="updatedAt">Sort: Last Updated</option>
              <option value="title">Sort: Title</option>
            </select>

            <button
              type="button"
              onClick={toggleSortOrder}
              className="px-2.5 py-2 border border-[#E7E5E4] bg-[#FAF8F5] hover:bg-white text-[11px] font-semibold uppercase flex items-center gap-1"
              title={`Sort ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
            >
              <ArrowUpDown className="w-3 h-3 text-[#6B1D2F]" />
              <span>{sortOrder.toUpperCase()}</span>
            </button>
          </div>

          {/* 5. Limit per page selector */}
          <div className="flex items-center gap-2 justify-end">
            <span className="text-xs text-[#78716C] whitespace-nowrap">Per page:</span>
            <select
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="py-2 px-2 text-xs border border-[#E7E5E4] bg-[#FAF8F5] text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E7E5E4] text-xs">
            <span className="text-[#78716C] text-[11px] font-semibold uppercase tracking-wider">
              Active Filters:
            </span>

            {statusTab !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#FAF8F5] border border-[#E7E5E4] text-[#1C1917]">
                Status: {statusTab}
                <button
                  type="button"
                  onClick={() => handleStatusTabChange("ALL")}
                  className="hover:text-rose-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {categoryFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#FAF8F5] border border-[#E7E5E4] text-[#1C1917]">
                Category: {categoryFilter}
                <button
                  type="button"
                  onClick={() => handleCategoryChange("")}
                  className="hover:text-rose-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {tagFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#FAF8F5] border border-[#E7E5E4] text-[#1C1917]">
                Tag: #{tagFilter}
                <button
                  type="button"
                  onClick={() => handleTagChange("")}
                  className="hover:text-rose-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {debouncedSearch && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#FAF8F5] border border-[#E7E5E4] text-[#1C1917]">
                Search: "{debouncedSearch}"
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="hover:text-rose-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={resetAllFilters}
              className="text-[#6B1D2F] font-semibold hover:underline text-[11px] ml-2"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF8F5] p-3 border border-[#6B1D2F]/30 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#1C1917]">
                {selectedIds.length} article(s) selected
              </span>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="text-[11px] text-[#78716C] hover:underline"
              >
                Clear selection
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isBulkOperating}
                onClick={handleBulkPublish}
                className="px-3 py-1 bg-emerald-700 text-white hover:bg-emerald-800 text-[11px] uppercase tracking-wider font-semibold flex items-center space-x-1 disabled:opacity-50"
              >
                <Eye className="w-3 h-3" />
                <span>Publish Selected</span>
              </button>

              <button
                type="button"
                disabled={isBulkOperating}
                onClick={handleBulkUnpublish}
                className="px-3 py-1 bg-amber-700 text-white hover:bg-amber-800 text-[11px] uppercase tracking-wider font-semibold flex items-center space-x-1 disabled:opacity-50"
              >
                <EyeOff className="w-3 h-3" />
                <span>Unpublish Selected</span>
              </button>

              <button
                type="button"
                disabled={isBulkOperating}
                onClick={() => setShowBulkDeleteModal(true)}
                className="px-3 py-1 bg-rose-700 text-white hover:bg-rose-800 text-[11px] uppercase tracking-wider font-semibold flex items-center space-x-1 disabled:opacity-50"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete Selected</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area: Table vs Grid */}
      {isLoading ? (
        <div className="bg-white border border-[#E7E5E4] p-16 text-center shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#6B1D2F]" />
          <p className="mt-3 text-xs text-[#78716C] font-serif">Loading blog posts from API...</p>
        </div>
      ) : isError ? (
        <div className="bg-white border border-[#E7E5E4] p-12 text-center shadow-sm">
          <p className="text-rose-700 text-sm font-serif">Failed to load blog posts from server.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-[#6B1D2F] text-white text-xs uppercase font-semibold"
          >
            Retry
          </button>
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-white border border-[#E7E5E4] p-16 text-center shadow-sm">
          <BookOpen className="w-12 h-12 stroke-[1.2] text-[#6B1D2F]/50 mx-auto" />
          <h3 className="font-serif text-lg text-[#1C1917] mt-3">No articles found</h3>
          <p className="text-xs text-[#78716C] mt-1">
            {hasActiveFilters
              ? "No blog posts match your current search, tag, or status filters."
              : "No blog posts currently exist in the database."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="px-4 py-2 border border-[#E7E5E4] text-xs uppercase font-semibold text-[#1C1917] hover:bg-[#FAF8F5]"
              >
                Clear Filters
              </button>
            )}
            <Link
              to="/admin/blogs/new"
              className="px-5 py-2 bg-[#6B1D2F] text-white text-xs uppercase font-semibold tracking-wider hover:bg-[#521624]"
            >
              Write First Article
            </Link>
          </div>
        </div>
      ) : viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="bg-white border border-[#E7E5E4] shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E7E5E4] text-[11px] uppercase tracking-wider font-semibold text-[#78716C]">
                <th className="p-4 w-10 text-center">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="focus:outline-none"
                    aria-label="Select all articles"
                  >
                    {selectedIds.length === blogs.length && blogs.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-[#6B1D2F]" />
                    ) : (
                      <Square className="w-4 h-4 text-[#A8A29E]" />
                    )}
                  </button>
                </th>
                <th className="p-4 w-20">Cover</th>
                <th className="p-4">Title & Slug</th>
                <th className="p-4">Category</th>
                <th className="p-4">Tags</th>
                <th className="p-4">Author</th>
                <th className="p-4">Status</th>
                <th className="p-4">Published / Created</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E5E4] text-xs text-[#1C1917]">
              {blogs.map((post) => {
                const coverSrc = getMediaUrl(post.featuredImage) || DEFAULT_COVER;
                const isSelected = selectedIds.includes(post.id);

                return (
                  <tr
                    key={post.id}
                    className={`hover:bg-[#FAF8F5] transition-colors ${
                      isSelected ? "bg-[#FAF7F2]" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleSelectOne(post.id)}
                        className="focus:outline-none"
                        aria-label={`Select article ${post.title}`}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-[#6B1D2F]" />
                        ) : (
                          <Square className="w-4 h-4 text-[#A8A29E]" />
                        )}
                      </button>
                    </td>

                    {/* Cover Thumbnail */}
                    <td className="p-4">
                      <div className="w-14 h-10 overflow-hidden bg-neutral-100 border border-[#E7E5E4]">
                        <img
                          src={coverSrc}
                          alt={post.featuredImageAlt || post.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = DEFAULT_COVER;
                          }}
                        />
                      </div>
                    </td>

                    {/* Title & Slug */}
                    <td className="p-4 max-w-xs">
                      <div className="font-serif font-medium text-sm text-[#1C1917] hover:text-[#6B1D2F] transition-colors">
                        <Link to={`/admin/blogs/${post.id}` as any}>{post.title}</Link>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#78716C] mt-0.5">
                        <span className="font-mono truncate max-w-[180px]">/{post.slug}</span>
                        <button
                          type="button"
                          onClick={() => copySlugToClipboard(post.slug)}
                          className="text-[#A8A29E] hover:text-[#1C1917]"
                          title="Copy slug"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4 whitespace-nowrap">
                      {post.category ? (
                        <span className="bg-[#FAF7F2] border border-[#E7E5E4] px-2 py-0.5 text-[10px] uppercase font-semibold text-[#6B1D2F]">
                          {post.category}
                        </span>
                      ) : (
                        <span className="text-[#A8A29E] italic">—</span>
                      )}
                    </td>

                    {/* Tags */}
                    <td className="p-4 max-w-[160px]">
                      {post.tags && post.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="text-[10px] bg-neutral-100 px-1.5 py-0.5 text-neutral-600 truncate max-w-[80px]"
                            >
                              #{t}
                            </span>
                          ))}
                          {post.tags.length > 2 && (
                            <span className="text-[10px] text-[#A8A29E]">
                              +{post.tags.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[#A8A29E] italic">—</span>
                      )}
                    </td>

                    {/* Author & User */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="font-medium text-[#1C1917]">{post.author || "Atelier"}</div>
                      {post.authorUser && (
                        <div className="text-[10px] text-[#A8A29E] truncate max-w-[120px]">
                          {post.authorUser.name || post.authorUser.email}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-4 whitespace-nowrap">{renderStatusBadge(post.status)}</td>

                    {/* Dates */}
                    <td className="p-4 whitespace-nowrap text-[11px] text-[#78716C]">
                      <div>
                        Pub:{" "}
                        {post.publishedAt ? (
                          <span className="font-medium text-[#1C1917]">
                            {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        ) : (
                          <span className="italic text-[#A8A29E]">Not published</span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#A8A29E] mt-0.5">
                        Created: {new Date(post.createdAt).toLocaleDateString("en-IN")}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        {/* Live article preview */}
                        <a
                          href={`/journal/${post.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-[#78716C] hover:text-[#1C1917] transition-colors"
                          title="View live post"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => navigate({ to: `/admin/blogs/${post.id}` as any })}
                          className="p-1.5 text-[#78716C] hover:text-[#6B1D2F] transition-colors"
                          title="Edit post"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Publish / Unpublish Toggle */}
                        {post.status === "PUBLISHED" ? (
                          <button
                            type="button"
                            disabled={unpublishMutation.isPending}
                            onClick={() => unpublishMutation.mutate(post.id)}
                            className="p-1.5 text-amber-700 hover:text-amber-900 transition-colors"
                            title="Unpublish (revert to Draft)"
                          >
                            <EyeOff className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={publishMutation.isPending}
                            onClick={() => publishMutation.mutate(post.id)}
                            className="p-1.5 text-emerald-700 hover:text-emerald-900 transition-colors"
                            title="Publish post"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete Single Post */}
                        <button
                          type="button"
                          onClick={() => setPostToDelete(post)}
                          className="p-1.5 text-[#78716C] hover:text-rose-700 transition-colors"
                          title="Delete post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((post) => {
            const coverSrc = getMediaUrl(post.featuredImage) || DEFAULT_COVER;
            const dateToDisplay = post.publishedAt || post.createdAt;
            const isSelected = selectedIds.includes(post.id);

            return (
              <div
                key={post.id}
                className={`bg-white border shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow relative ${
                  isSelected ? "border-[#6B1D2F] ring-1 ring-[#6B1D2F]" : "border-[#E7E5E4]"
                }`}
              >
                <div>
                  {/* Cover Image & Category */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#FAF8F5] border-b border-[#E7E5E4]">
                    <img
                      src={coverSrc}
                      alt={post.featuredImageAlt || post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_COVER;
                      }}
                    />

                    {/* Top Checkbox overlay */}
                    <button
                      type="button"
                      onClick={() => toggleSelectOne(post.id)}
                      className="absolute top-2.5 right-2.5 bg-white/90 p-1 rounded-xs shadow-xs focus:outline-none"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#6B1D2F]" />
                      ) : (
                        <Square className="w-4 h-4 text-[#A8A29E]" />
                      )}
                    </button>

                    {post.category && (
                      <span className="absolute top-2.5 left-2.5 bg-white/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#6B1D2F] shadow-xs">
                        {post.category}
                      </span>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    {/* Status & Author */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B1D2F] truncate max-w-[150px]">
                        {post.author || "Atelier Author"}
                      </span>
                      {renderStatusBadge(post.status)}
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-serif font-medium text-[#1C1917] line-clamp-2 leading-snug hover:text-[#6B1D2F] transition-colors">
                      <Link to={`/admin/blogs/${post.id}` as any}>{post.title}</Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs text-[#78716C] line-clamp-2 leading-relaxed">
                      {post.description}
                    </p>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {post.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Date */}
                    <div className="text-[11px] text-[#A8A29E] pt-1">
                      {dateToDisplay && (
                        <span>
                          {new Date(dateToDisplay).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-4 bg-[#FAF8F5] border-t border-[#E7E5E4] flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <a
                      href={`/journal/${post.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-[#78716C] hover:text-[#1C1917] transition-colors"
                      title="View live post"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      type="button"
                      onClick={() => navigate({ to: `/admin/blogs/${post.id}` as any })}
                      className="p-1.5 text-[#78716C] hover:text-[#6B1D2F] transition-colors"
                      title="Edit post"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {post.status === "PUBLISHED" ? (
                      <button
                        type="button"
                        disabled={unpublishMutation.isPending}
                        onClick={() => unpublishMutation.mutate(post.id)}
                        className="p-1.5 text-amber-700 hover:text-amber-900 transition-colors"
                        title="Unpublish (revert to Draft)"
                      >
                        <EyeOff className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={publishMutation.isPending}
                        onClick={() => publishMutation.mutate(post.id)}
                        className="p-1.5 text-emerald-700 hover:text-emerald-900 transition-colors"
                        title="Publish post"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setPostToDelete(post)}
                    className="p-1.5 text-[#78716C] hover:text-rose-700 transition-colors"
                    title="Delete post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {meta.total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 border border-[#E7E5E4] shadow-sm text-xs">
          <div className="text-[#78716C]">
            Showing <span className="font-semibold text-[#1C1917]">{startItem}</span> to{" "}
            <span className="font-semibold text-[#1C1917]">{endItem}</span> of{" "}
            <span className="font-semibold text-[#1C1917]">{meta.total}</span> entries
          </div>

          <div className="flex items-center gap-1.5">
            {/* Prev Button */}
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 border border-[#E7E5E4] bg-white text-[#1C1917] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#FAF8F5] transition-colors"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page number buttons */}
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
              .filter((p) => {
                // Show first, last, and pages around current
                if (p === 1 || p === meta.totalPages) return true;
                return Math.abs(p - page) <= 1;
              })
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && p - prev > 1;

                return (
                  <React.Fragment key={p}>
                    {showEllipsis && <span className="px-1 text-[#A8A29E]">...</span>}
                    <button
                      type="button"
                      onClick={() => setPage(p)}
                      className={`h-7 w-7 text-xs font-semibold transition-colors ${
                        page === p
                          ? "bg-[#6B1D2F] text-white"
                          : "border border-[#E7E5E4] bg-white text-[#1C1917] hover:bg-[#FAF8F5]"
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                );
              })}

            {/* Next Button */}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page >= meta.totalPages}
              className="p-1.5 border border-[#E7E5E4] bg-white text-[#1C1917] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#FAF8F5] transition-colors"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Single Post Modal */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white border border-[#E7E5E4] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg text-[#1C1917]">Delete Article?</h3>
            </div>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-[#1C1917]">"{postToDelete.title}"</strong>?
            </p>
            <p className="text-[11px] text-stone-500 bg-[#FAF8F5] p-2.5 border border-[#E7E5E4]">
              Note: This will delete the database record and delete its associated physical files
              from <code className="text-[#6B1D2F]">/uploads/blogs/</code> storage.
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E7E5E4]">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                className="px-4 py-2 border border-[#E7E5E4] text-xs font-semibold uppercase text-[#1C1917] hover:bg-[#FAF8F5]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={handleConfirmSingleDelete}
                className="px-5 py-2 bg-rose-600 text-white text-xs font-semibold uppercase hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white border border-[#E7E5E4] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg text-[#1C1917]">Bulk Delete Articles?</h3>
            </div>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-[#1C1917]">{selectedIds.length} articles</strong>? This will
              remove all selected blog records and their associated images from storage.
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E7E5E4]">
              <button
                type="button"
                onClick={() => setShowBulkDeleteModal(false)}
                className="px-4 py-2 border border-[#E7E5E4] text-xs font-semibold uppercase text-[#1C1917] hover:bg-[#FAF8F5]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isBulkOperating}
                onClick={handleBulkDelete}
                className="px-5 py-2 bg-rose-600 text-white text-xs font-semibold uppercase hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                {isBulkOperating ? "Deleting..." : "Delete All Selected"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
