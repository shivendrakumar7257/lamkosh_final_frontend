import React, { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  FolderTree,
  X,
  Save,
  Loader2,
  AlertTriangle,
  Package,
  Layers,
} from "lucide-react";
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useCategories";
import { AdminCategoryTable } from "@/components/admin/AdminCategoryTable";
import { Category } from "@/types/category";
import { dbStore } from "@/lib/db/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/categories/")({
  component: AdminCategoriesPage,
});

function AdminCategoriesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");

  // Queries & Mutations
  const {
    data: apiResponse,
    isLoading,
    isRefetching,
    refetch,
  } = useAdminCategories({ page, limit, search });

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // Delete Dialog state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);

  // Extract categories with fallback to dbStore for smooth dev fallback if API is empty
  const categories = useMemo(() => {
    if (apiResponse?.categories && apiResponse.categories.length > 0) {
      return apiResponse.categories;
    }
    // If search is active and returned 0, return []
    if (search && apiResponse?.categories) {
      return [];
    }
    // Fallback to local dbStore mock data if backend has 0 categories
    const local = dbStore.getCategories();
    return local.map((c, i) => ({
      id: c.id,
      name: c.name,
      createdAt: c.createdAt || new Date().toISOString(),
      updatedAt: c.updatedAt,
      _count: { products: 0 },
      displayOrder: c.displayOrder || i + 1,
      description: c.description,
      imageUrl: c.imageUrl,
    }));
  }, [apiResponse, search]);

  const meta = apiResponse?.meta || {
    total: categories.length,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(categories.length / limit)),
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setName("");
    setFormError(null);
    setServerError(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setFormError(null);
    setServerError(null);
    setIsModalOpen(true);
  };

  // Validate form client-side: 1-100 characters, no whitespace-only names
  const validateForm = (): boolean => {
    const trimmed = name.trim();
    if (!trimmed) {
      setFormError("Category name cannot be empty or whitespace only.");
      return false;
    }
    if (trimmed.length > 100) {
      setFormError("Category name must be 100 characters or fewer.");
      return false;
    }
    setFormError(null);
    return true;
  };

  // Save (Create or Update) Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    const trimmedName = name.trim();

    try {
      if (editingCategory) {
        // Update
        await updateMutation.mutateAsync({
          id: editingCategory.id,
          payload: {
            name: trimmedName,
          },
        });

        // Sync local dbStore
        dbStore.saveCategory({
          id: editingCategory.id,
          name: trimmedName,
        });
      } else {
        // Create
        await createMutation.mutateAsync({
          name: trimmedName,
        });

        // Sync local dbStore
        dbStore.saveCategory({
          name: trimmedName,
        });
      }

      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;

      if (status === 409) {
        setServerError(msg || "Category with this name already exists.");
      } else {
        setServerError(msg || err.message || "An unexpected error occurred.");
      }
    }
  };

  // Open Delete Modal
  const handleOpenDeleteModal = (cat: Category) => {
    setCategoryToDelete(cat);
    setDeleteErrorMessage(null);
    setIsDeleteOpen(true);
  };

  // Execute Category Deletion
  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    // Check if products are currently associated
    const assignedCount = categoryToDelete._count?.products ?? 0;
    if (assignedCount > 0) {
      setDeleteErrorMessage(
        `Category "${categoryToDelete.name}" cannot be deleted because ${assignedCount} products are associated with it. Please reassign or delete these products first.`,
      );
      return;
    }

    try {
      await deleteMutation.mutateAsync(categoryToDelete.id);
      dbStore.deleteCategory(categoryToDelete.id);
      setIsDeleteOpen(false);
      setCategoryToDelete(null);
      refetch();
    } catch (err: any) {
      const status = err.response?.status;
      const serverMsg = err.response?.data?.message;

      if (status === 409) {
        setDeleteErrorMessage(
          serverMsg ||
            "Category cannot be deleted because products are associated with it. Please reassign or delete the products first.",
        );
      } else {
        setDeleteErrorMessage(serverMsg || err.message || "Failed to delete category.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 border border-[#E7E5E4] shadow-sm">
        <div>
          <div className="flex items-center space-x-3">
            <Layers className="w-5 h-5 text-[#6B1D2F]" />
            <h1 className="text-2xl font-serif font-light text-[#1C1917]">
              Category Management
            </h1>
          </div>
          <p className="text-xs text-[#78716C] mt-1 font-sans">
            Manage your store's taxonomy, product assignments, and catalog hierarchy.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="flex items-center space-x-2 px-5 py-2.5 bg-[#6B1D2F] text-white hover:bg-[#521624] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm self-start sm:self-auto"
        >
          <span>Add New Category</span>
        </button>
      </div>

      {/* Main Admin Category Table Component */}
      <AdminCategoryTable
        categories={categories}
        meta={meta}
        isLoading={isLoading}
        isRefetching={isRefetching}
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        page={page}
        onPageChange={setPage}
        limit={limit}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        onAddCategory={handleOpenAddModal}
        onEditCategory={handleOpenEditModal}
        onDeleteCategory={handleOpenDeleteModal}
        onRefresh={() => refetch()}
      />

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="category-modal-title"
        >
          <div className="bg-white border border-[#E7E5E4] max-w-md w-full shadow-2xl p-6 space-y-5 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E4]">
              <h2 id="category-modal-title" className="text-lg font-serif text-[#1C1917]">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#78716C] hover:text-[#1C1917] p-1 rounded hover:bg-[#FAF8F5]"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Banners */}
            {serverError && (
              <div
                className="flex items-start gap-2.5 p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800"
                role="alert"
              >
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Operation Failed</p>
                  <p className="mt-0.5">{serverError}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveCategory} className="space-y-4">
              {/* Category Name */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Category Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (formError) setFormError(null);
                    if (serverError) setServerError(null);
                  }}
                  placeholder="e.g. Banarasi Weaves, Pure Linen Shirts"
                  maxLength={100}
                  className={cn(
                    "w-full px-3 py-2 border bg-[#FAF8F5] text-xs focus:bg-white focus:outline-none transition-colors",
                    formError
                      ? "border-rose-400 focus:border-rose-600"
                      : "border-[#E7E5E4] focus:border-[#6B1D2F]",
                  )}
                  autoFocus
                />
                <div className="flex items-center justify-between text-[11px] text-[#78716C]">
                  <span>{formError ? <span className="text-rose-600 font-medium">{formError}</span> : "1-100 characters"}</span>
                  <span>{name.trim().length} / 100</span>
                </div>
              </div>


              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E7E5E4]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E7E5E4] text-xs uppercase font-semibold text-[#1C1917] hover:bg-[#FAF8F5] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex items-center space-x-1.5 px-5 py-2 bg-[#6B1D2F] text-white text-xs uppercase font-semibold hover:bg-[#521624] disabled:opacity-50 transition-colors"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{editingCategory ? "Update Category" : "Save Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteOpen && categoryToDelete && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div className="bg-white border border-[#E7E5E4] max-w-md w-full shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-700">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 id="delete-dialog-title" className="text-base font-serif font-medium text-[#1C1917]">
                  Delete Category
                </h3>
                <p className="mt-1 text-xs text-[#78716C]">
                  Are you sure you want to delete category{" "}
                  <strong className="text-[#1C1917]">"{categoryToDelete.name}"</strong>?
                </p>
              </div>
            </div>

            {/* If 409 Conflict occurred or products associated */}
            {deleteErrorMessage && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-amber-800">
                  <Package className="h-4 w-4" />
                  <span>Cannot Delete Category</span>
                </div>
                <p className="text-[11px] leading-relaxed">{deleteErrorMessage}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E7E5E4]">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setCategoryToDelete(null);
                  setDeleteErrorMessage(null);
                }}
                className="px-4 py-2 border border-[#E7E5E4] text-xs uppercase font-semibold text-[#1C1917] hover:bg-[#FAF8F5] transition-colors"
              >
                {deleteErrorMessage ? "Close" : "Cancel"}
              </button>

              {!deleteErrorMessage && (
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleteMutation.isPending}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-rose-700 text-white text-xs uppercase font-semibold hover:bg-rose-800 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {deleteMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Delete Category</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
