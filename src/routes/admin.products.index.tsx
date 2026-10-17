import React, { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Search,
  Plus,
  Download,
  Trash2,
  Edit,
  CheckSquare,
  Square,
  Eye,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import { useAdminProducts, useDeleteProduct } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { dbStore } from "@/lib/db/store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products/")({
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const navigate = useNavigate();

  // Query state matching API spec: page, limit, search, categoryId, minPrice, maxPrice, sortBy, sortOrder
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStockStatus, setSelectedStockStatus] = useState("all");
  const [sortBy, setSortBy] = useState<
    "createdAt" | "name" | "sellPrice" | "stock" | "basePrice"
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Categories hook
  const { data: categoryData } = useCategories();
  const categories = useMemo(() => {
    if (Array.isArray(categoryData)) return categoryData;
    if (Array.isArray(categoryData?.categories)) return categoryData.categories;
    return [];
  }, [categoryData]);

  // Backend Products hook
  const {
    data: apiResponse,
    isLoading,
    isRefetching,
    refetch,
    error: apiError,
  } = useAdminProducts({
    page,
    limit,
    search: debouncedSearch || undefined,
    categoryId: selectedCategory !== "all" ? selectedCategory : undefined,
    sortBy,
    sortOrder,
  });

  const deleteProductMutation = useDeleteProduct();

  // Products strictly from backend API
  const products = useMemo(() => {
    if (apiResponse?.products) {
      return apiResponse.products.map((p) => {
        const primaryImage =
          p.images && p.images.length > 0
            ? typeof p.images[0] === "string"
              ? p.images[0]
              : p.images[0].url
            : p.media && p.media.length > 0
              ? p.media[0].url
              : "";

        return {
          id: p.id,
          name: p.name,
          color: p.color,
          categoryId: p.categoryId,
          categoryName: p.category?.name || "General",
          basePrice: p.basePrice,
          sellPrice: p.sellPrice,
          stock: p.stock,
          gst: p.gst,
          image: primaryImage,
          createdAt: p.createdAt,
          status: p.status || "active",
        };
      });
    }

    return [];
  }, [apiResponse]);

  // Client-side stock status filtering if needed
  const displayProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedStockStatus === "in_stock") return p.stock > 5;
      if (selectedStockStatus === "low_stock") return p.stock > 0 && p.stock <= 5;
      if (selectedStockStatus === "out_of_stock") return p.stock === 0;
      return true;
    });
  }, [products, selectedStockStatus]);

  const totalCount = apiResponse?.meta?.total || displayProducts.length;
  const totalPages = apiResponse?.meta?.totalPages || Math.ceil(totalCount / limit) || 1;

  const toggleSelectAll = () => {
    if (selectedIds.length === displayProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayProducts.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete product "${name}"?`)) {
      try {
        await deleteProductMutation.mutateAsync(id);
        dbStore.deleteProduct(id);
        setSelectedIds((prev) => prev.filter((i) => i !== id));
        refetch();
      } catch {
        // Handled in hook
      }
    }
  };

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Color",
      "Category",
      "Base Price (MRP)",
      "Sell Price",
      "Stock",
      "GST %",
    ];
    const rows = displayProducts.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.color}"`,
      `"${p.categoryName}"`,
      p.basePrice,
      p.sellPrice,
      p.stock,
      p.gst,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lamkosh_products_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export downloaded.");
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 border border-[#E7E5E4] shadow-sm">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-serif font-light text-[#1C1917]">Product Management</h1>
            <button
              onClick={() => refetch()}
              disabled={isRefetching}
              className="p-1.5 text-[#78716C] hover:text-[#1C1917] transition-colors"
              title="Refresh product list"
            >
              <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} />
            </button>
          </div>
          <p className="text-xs text-[#78716C] mt-1 font-sans">
            Manage product catalog, inventory variants, media assets, and pricing.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 px-4 py-2 border border-[#E7E5E4] text-[#1C1917] bg-white hover:bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <Download className="w-4 h-4 text-[#6B1D2F]" />
            <span>Export CSV</span>
          </button>

          <Link
            to="/admin/products/new"
            className="flex items-center space-x-2 px-5 py-2 bg-[#6B1D2F] text-white hover:bg-[#521624] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-6 border border-[#E7E5E4] shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Box */}
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
            <input
              type="text"
              placeholder="Search name, color, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-[#E7E5E4] bg-[#FAF8F5] text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="py-2 px-3 text-xs border border-[#E7E5E4] bg-[#FAF8F5] text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
          >
            <option value="all">All Categories</option>
            {Array.isArray(categories) &&
              categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>

          {/* Stock Filter */}
          <select
            value={selectedStockStatus}
            onChange={(e) => setSelectedStockStatus(e.target.value)}
            className="py-2 px-3 text-xs border border-[#E7E5E4] bg-[#FAF8F5] text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
          >
            <option value="all">All Stock Statuses</option>
            <option value="in_stock">In Stock (&gt; 5)</option>
            <option value="low_stock">Low Stock (1 - 5)</option>
            <option value="out_of_stock">Out of Stock (0)</option>
          </select>

          {/* Sort By Filter */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 py-2 px-3 text-xs border border-[#E7E5E4] bg-[#FAF8F5] text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
            >
              <option value="createdAt">Sort: Created Date</option>
              <option value="name">Sort: Name</option>
              <option value="sellPrice">Sort: Selling Price</option>
              <option value="basePrice">Sort: MRP (Base Price)</option>
              <option value="stock">Sort: Stock</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] hover:bg-white text-xs font-semibold uppercase"
              title="Toggle sort direction"
            >
              {sortOrder.toUpperCase()}
            </button>
          </div>
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between bg-[#FAF8F5] p-3 border border-[#6B1D2F]/20 text-xs">
            <span className="font-medium text-[#1C1917]">
              {selectedIds.length} item(s) selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  if (window.confirm(`Delete ${selectedIds.length} selected products?`)) {
                    selectedIds.forEach((id) => deleteProductMutation.mutate(id));
                    setSelectedIds([]);
                  }
                }}
                className="px-3 py-1 bg-rose-700 text-white hover:bg-rose-800 text-[11px] uppercase tracking-wider font-semibold flex items-center space-x-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete Selected</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Table */}
      <div className="bg-white border border-[#E7E5E4] shadow-sm overflow-x-auto">
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center space-y-3 text-[#78716C]">
            <Loader2 className="w-6 h-6 animate-spin text-[#6B1D2F]" />
            <p className="text-xs">Loading products from API...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E7E5E4] text-[11px] uppercase tracking-wider font-semibold text-[#78716C]">
                <th className="p-4 w-10 text-center">
                  <button onClick={toggleSelectAll} className="focus:outline-none">
                    {selectedIds.length === displayProducts.length && displayProducts.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-[#6B1D2F]" />
                    ) : (
                      <Square className="w-4 h-4 text-[#A8A29E]" />
                    )}
                  </button>
                </th>
                <th className="p-4">Product</th>
                <th className="p-4">Color</th>
                <th className="p-4">Base Price</th>
                <th className="p-4">Sell Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">GST</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E5E4] text-xs text-[#1C1917]">
              {displayProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-[#78716C]">
                    No products found. Click "Add New Product" to create your first entry.
                  </td>
                </tr>
              ) : (
                displayProducts.map((product) => {
                  const isSelected = selectedIds.includes(product.id);
                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-[#FAF8F5]/60 transition-colors ${
                        isSelected ? "bg-[#FAF8F5]" : ""
                      }`}
                    >
                      <td className="p-4 text-center">
                        <button
                          onClick={() => toggleSelectOne(product.id)}
                          className="focus:outline-none"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#6B1D2F]" />
                          ) : (
                            <Square className="w-4 h-4 text-[#A8A29E]" />
                          )}
                        </button>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <ProductThumbnail
                            src={product.image}
                            alt={product.name}
                          />
                          <div>
                            <span className="font-medium text-[#1C1917] block line-clamp-1">
                              {product.name}
                            </span>
                            <span className="text-[11px] text-[#78716C] font-mono">
                              ID: {product.id.slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-[#57534E]">{product.color || "—"}</td>

                      <td className="p-4 text-[#78716C] line-through">
                        ₹{Number(product.basePrice).toLocaleString("en-IN")}
                      </td>

                      <td className="p-4 font-semibold text-[#6B1D2F]">
                        ₹{Number(product.sellPrice).toLocaleString("en-IN")}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            product.stock > 5
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : product.stock > 0
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : "bg-rose-50 text-rose-800 border border-rose-200"
                          }`}
                        >
                          {product.stock} units
                        </span>
                      </td>

                      <td className="p-4 text-[#78716C]">{product.gst}%</td>

                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() =>
                            navigate({
                              to: "/admin/products/$id",
                              params: { id: product.id },
                            })
                          }
                          className="p-1.5 text-[#78716C] hover:text-[#6B1D2F] hover:bg-[#FAF8F5] transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          className="p-1.5 text-[#78716C] hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}

        {/* Pagination Footer */}
        <div className="p-4 border-t border-[#E7E5E4] bg-[#FAF8F5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78716C]">
          <span>
            Showing {displayProducts.length} of {totalCount} total products
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isLoading}
              className="p-1.5 border border-[#E7E5E4] bg-white hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 bg-white border border-[#E7E5E4] font-medium text-[#1C1917]">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isLoading}
              className="p-1.5 border border-[#E7E5E4] bg-white hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductThumbnail({ src, alt }: { src?: string; alt: string }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="w-12 h-14 flex items-center justify-center border border-[#E7E5E4] bg-[#FAF8F5] text-[#A8A29E] flex-shrink-0">
        <ImageIcon className="w-5 h-5 opacity-40" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className="w-12 h-14 object-cover border border-[#E7E5E4] bg-[#FAF8F5] flex-shrink-0"
    />
  );
}
