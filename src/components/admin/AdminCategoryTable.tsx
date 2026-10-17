import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  Package,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FolderTree,
  AlertTriangle,
  X,
  Loader2,
} from "lucide-react";
import { Category, CategoryPaginationMeta } from "@/types/category";
import { cn } from "@/lib/utils";

interface AdminCategoryTableProps {
  categories: Category[];
  meta?: CategoryPaginationMeta;
  isLoading: boolean;
  isRefetching: boolean;
  search: string;
  onSearchChange: (val: string) => void;
  page: number;
  onPageChange: (page: number) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  onRefresh: () => void;
}

export const AdminCategoryTable: React.FC<AdminCategoryTableProps> = ({
  categories,
  meta,
  isLoading,
  isRefetching,
  search,
  onSearchChange,
  page,
  onPageChange,
  limit,
  onLimitChange,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onRefresh,
}) => {
  // Local debounced search input
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        onSearchChange(localSearch);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [localSearch, search, onSearchChange]);

  const total = meta?.total ?? categories.length;
  const totalPages = meta?.totalPages ?? Math.max(1, Math.ceil(total / limit));
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  // Generate pagination page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-4">
      {/* Search and Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 border border-[#E7E5E4] shadow-sm">
        {/* Real-time Debounced Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78716C]" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search categories by name..."
            className="w-full pl-9 pr-8 py-2 text-xs border border-[#E7E5E4] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#6B1D2F] transition-colors"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => {
                setLocalSearch("");
                onSearchChange("");
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917]"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 justify-end">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefetching}
            className="flex items-center gap-1.5 px-3 py-2 border border-[#E7E5E4] text-xs font-medium text-[#57534E] hover:text-[#1C1917] hover:bg-[#FAF8F5] transition-colors disabled:opacity-50"
            title="Refresh categories"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isRefetching && "animate-spin text-[#6B1D2F]")} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={onAddCategory}
            className="flex items-center gap-2 px-4 py-2 bg-[#6B1D2F] text-white hover:bg-[#521624] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Main Responsive Table View */}
      <div className="bg-white border border-[#E7E5E4] shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse" role="table">
          <thead>
            <tr className="bg-[#FAF8F5] border-b border-[#E7E5E4] text-[11px] uppercase tracking-wider font-semibold text-[#78716C]">
              <th className="p-4">Category Name</th>
              <th className="p-4">Category UUID</th>
              <th className="p-4 text-center">Assigned Products</th>
              <th className="p-4">Created Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E5E4] text-xs text-[#1C1917]">
            {isLoading ? (
              [...Array(limit)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="p-4">
                    <div className="h-4 w-36 bg-[#FAF8F5] rounded" />
                  </td>
                  <td className="p-4">
                    <div className="h-3 w-48 bg-[#FAF8F5] rounded" />
                  </td>
                  <td className="p-4 text-center">
                    <div className="h-5 w-12 bg-[#FAF8F5] rounded-full mx-auto" />
                  </td>
                  <td className="p-4">
                    <div className="h-4 w-24 bg-[#FAF8F5] rounded" />
                  </td>
                  <td className="p-4 text-right">
                    <div className="h-6 w-16 bg-[#FAF8F5] rounded ml-auto" />
                  </td>
                </tr>
              ))
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-16 text-center text-[#78716C]">
                  <FolderTree className="h-10 w-10 text-[#A8A29E] mx-auto mb-3" />
                  <p className="font-serif text-sm text-[#1C1917]">No categories found</p>
                  <p className="text-xs text-[#78716C] mt-1">
                    {search
                      ? `No categories match "${search}". Try clearing your search.`
                      : "Create your first category to start organizing products."}
                  </p>
                  {search ? (
                    <button
                      type="button"
                      onClick={() => {
                        setLocalSearch("");
                        onSearchChange("");
                      }}
                      className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#6B1D2F] hover:underline"
                    >
                      Clear search
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onAddCategory}
                      className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#6B1D2F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#521624]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add New Category</span>
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              categories.map((cat) => {
                const productCount = cat._count?.products ?? 0;

                return (
                  <tr
                    key={cat.id}
                    className="hover:bg-[#FAF8F5]/70 transition-colors group"
                  >
                    {/* Category Name */}
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <span className="font-serif font-medium text-sm text-[#1C1917] group-hover:text-[#6B1D2F] transition-colors">
                          {cat.name}
                        </span>
                      </div>
                    </td>

                    {/* Category UUID */}
                    <td className="p-4 font-mono text-[11px] text-[#78716C]">
                      <span className="bg-[#FAF8F5] px-2 py-1 rounded border border-[#E7E5E4] select-all">
                        {cat.id}
                      </span>
                    </td>

                    {/* Assigned Products Count */}
                    <td className="p-4 text-center">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold",
                          productCount > 0
                            ? "bg-[#6B1D2F]/10 text-[#6B1D2F] border border-[#6B1D2F]/20"
                            : "bg-[#FAF8F5] text-[#78716C] border border-[#E7E5E4]",
                        )}
                        title={`${productCount} products assigned`}
                      >
                        <Package className="h-3 w-3" />
                        <span>{productCount}</span>
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="p-4 text-[#57534E] text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#A8A29E]" />
                        <span>{formatDate(cat.createdAt)}</span>
                      </div>
                    </td>

                    {/* Action Buttons: Edit, Delete */}
                    <td className="p-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onEditCategory(cat)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#57534E] hover:text-[#6B1D2F] hover:bg-white rounded transition-colors"
                        title={`Edit category ${cat.name}`}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteCategory(cat)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded transition-colors"
                        title={`Delete category ${cat.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 border border-[#E7E5E4] shadow-sm text-xs text-[#78716C]">
        <div className="flex items-center gap-4">
          <span>
            Showing <strong className="text-[#1C1917]">{startItem}</strong> -{" "}
            <strong className="text-[#1C1917]">{endItem}</strong> of{" "}
            <strong className="text-[#1C1917]">{total}</strong> categories
          </span>

          {/* Items Per Page Selector */}
          <div className="flex items-center gap-1.5">
            <span>Per page:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="px-2 py-1 border border-[#E7E5E4] bg-[#FAF8F5] text-xs text-[#1C1917] outline-none focus:border-[#6B1D2F]"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Page Buttons */}
        <div className="flex items-center gap-1 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || isLoading}
            className="flex items-center gap-1 px-3 py-1.5 border border-[#E7E5E4] rounded-sm text-xs font-medium text-[#1C1917] hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {getPageNumbers().map((p, idx) =>
            typeof p === "number" ? (
              <button
                key={idx}
                type="button"
                onClick={() => onPageChange(p)}
                className={cn(
                  "min-w-8 h-8 px-2 text-xs font-semibold rounded-sm transition-colors",
                  p === page
                    ? "bg-[#6B1D2F] text-white"
                    : "border border-[#E7E5E4] text-[#1C1917] hover:bg-[#FAF8F5]",
                )}
              >
                {p}
              </button>
            ) : (
              <span key={idx} className="px-1 text-[#78716C]">
                ...
              </span>
            ),
          )}

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || isLoading}
            className="flex items-center gap-1 px-3 py-1.5 border border-[#E7E5E4] rounded-sm text-xs font-medium text-[#1C1917] hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCategoryTable;
