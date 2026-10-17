import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Save,
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  DollarSign,
  Package,
  Layers,
  Tag,
  AlertCircle,
  CheckCircle,
  Film,
  Image as ImageIcon,
  X,
  Loader2,
  FolderPlus,
} from "lucide-react";
import { useAdminProduct, useCreateProduct, useUpdateProduct } from "@/hooks/use-products";
import { useCategories, useCreateCategory } from "@/hooks/use-categories";
import { ProductVariant } from "@/types/product";
import { dbStore } from "@/lib/db/store";
import { toast } from "sonner";

interface ProductEditorFormProps {
  productId?: string;
}

interface MediaItemPreview {
  id?: string;
  url: string;
  name: string;
  size?: number;
  type: "IMAGE" | "VIDEO";
  file?: File;
  isExisting?: boolean;
}

export function ProductEditorForm({ productId }: ProductEditorFormProps) {
  const navigate = useNavigate();
  const isEditing = Boolean(productId && productId !== "new");

  // React Query hooks for real backend endpoints
  const { data: categoryData, isLoading: isLoadingCategories } = useCategories();
  const categories = useMemo(() => {
    if (Array.isArray(categoryData)) return categoryData;
    if (Array.isArray(categoryData?.categories)) return categoryData.categories;
    return [];
  }, [categoryData]);
  const createCategoryMutation = useCreateCategory();

  const {
    data: existingProduct,
    isLoading: isLoadingProduct,
    error: productLoadError,
  } = useAdminProduct(productId || "");

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct(productId);

  const [activeTab, setActiveTab] = useState<
    "basic" | "pricing" | "media" | "inventory" | "variants"
  >("basic");

  // Form Fields as per API Specification
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [color, setColor] = useState("");
  const [gst, setGst] = useState<number>(12);
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState<number>(0);
  const [sellPrice, setSellPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Media files & previews
  const [mediaList, setMediaList] = useState<MediaItemPreview[]>([]);
  const [removeMediaIds, setRemoveMediaIds] = useState<string[]>([]);

  // New variant inputs
  const [variantSizeInput, setVariantSizeInput] = useState("");
  const [variantStockInput, setVariantStockInput] = useState<number>(10);

  // Quick Add Category Modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill form when editing
  useEffect(() => {
    if (isEditing && existingProduct) {
      setName(existingProduct.name || (existingProduct as any).title || "");
      setCategoryId(existingProduct.categoryId || "");
      setColor(existingProduct.color || (existingProduct as any).colour || "");
      setGst(existingProduct.gst ?? 12);
      setDescription(existingProduct.description || "");
      setBasePrice(
        existingProduct.basePrice ??
          (existingProduct as any).compareAtPrice ??
          existingProduct.sellPrice ??
          (existingProduct as any).price ??
          1999,
      );
      setSellPrice(existingProduct.sellPrice ?? (existingProduct as any).price ?? 1499);
      setStock(
        existingProduct.stock ??
          (existingProduct as any).stockQuantity ??
          (existingProduct.variants
            ? existingProduct.variants.reduce((a, b) => a + b.stock, 0)
            : 30),
      );

      if (existingProduct.variants && existingProduct.variants.length > 0) {
        setVariants(existingProduct.variants);
      } else if ((existingProduct as any).sizes) {
        const perSizeStock = Math.floor(
          ((existingProduct as any).stockQuantity ?? 30) / (existingProduct as any).sizes.length,
        );
        setVariants(
          (existingProduct as any).sizes.map((sz: string) => ({
            size: sz,
            stock: perSizeStock || 5,
          })),
        );
      }

      // Existing Media
      const existingPreviews: MediaItemPreview[] = [];
      if (existingProduct.media && Array.isArray(existingProduct.media)) {
        existingProduct.media.forEach((m) => {
          existingPreviews.push({
            id: m.id,
            url: m.url,
            name: m.url.split("/").pop() || "Media file",
            type: m.type?.toUpperCase() === "VIDEO" || m.url.endsWith(".mp4") ? "VIDEO" : "IMAGE",
            isExisting: true,
          });
        });
      } else if (existingProduct.images && Array.isArray(existingProduct.images)) {
        existingProduct.images.forEach((img, idx) => {
          const url = typeof img === "string" ? img : img.url;
          const id = typeof img === "string" ? `img-${idx}` : img.id;
          existingPreviews.push({
            id,
            url,
            name: url.split("/").pop() || `Image ${idx + 1}`,
            type: "IMAGE",
            isExisting: true,
          });
        });
      }
      setMediaList(existingPreviews);
    }
  }, [isEditing, existingProduct, productLoadError, productId]);

  // Auto-select first valid category when loaded if none selected
  useEffect(() => {
    if (!categoryId && categories.length > 0 && !isEditing) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId, isEditing]);

  // Derived counts
  const imageCount = useMemo(() => mediaList.filter((m) => m.type === "IMAGE").length, [mediaList]);
  const videoCount = useMemo(() => mediaList.filter((m) => m.type === "VIDEO").length, [mediaList]);
  const totalMedia = mediaList.length;

  // Validation errors
  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    if (!name.trim()) errors.push("Product name is required.");
    if (name.length > 200) errors.push("Product name cannot exceed 200 characters.");
    if (!categoryId.trim()) errors.push("Please select a valid Category.");
    if (!color.trim()) errors.push("Color is required.");
    if (color.length > 50) errors.push("Color cannot exceed 50 characters.");
    if (gst < 0 || gst > 100) errors.push("GST must be between 0% and 100%.");
    if (!description.trim()) errors.push("Description is required.");
    if (basePrice < 0) errors.push("Base Price (MRP) cannot be negative.");
    if (sellPrice < 0) errors.push("Selling Price cannot be negative.");
    if (sellPrice > basePrice) {
      errors.push(
        "Pricing Rule Violation: sellPrice must be <= basePrice (sellPrice cannot exceed basePrice).",
      );
    }
    if (stock < 0) errors.push("Stock count cannot be negative.");
    if (totalMedia < 1) {
      errors.push("At least 1 media file (image or video) is required.");
    }
    if (imageCount > 5) {
      errors.push(`Maximum 5 images allowed (currently ${imageCount}).`);
    }
    if (videoCount > 2) {
      errors.push(`Maximum 2 videos allowed (currently ${videoCount}).`);
    }
    if (totalMedia > 7) {
      errors.push(`Total media files cannot exceed 7 (currently ${totalMedia}).`);
    }

    // Check duplicate sizes in variants
    const sizeSet = new Set<string>();
    for (const v of variants) {
      const lower = v.size.trim().toLowerCase();
      if (sizeSet.has(lower)) {
        errors.push(`Duplicate variant size detected: "${v.size}". Sizes must be unique.`);
        break;
      }
      sizeSet.add(lower);
    }

    return errors;
  }, [
    name,
    categoryId,
    color,
    gst,
    description,
    basePrice,
    sellPrice,
    stock,
    totalMedia,
    imageCount,
    videoCount,
    variants,
  ]);

  // Handle adding image files
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSizeBytes = 50 * 1024 * 1024; // 50MB

    const validNewPreviews: MediaItemPreview[] = [];
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`"${file.name}" is not a supported image format (.jpg, .jpeg, .png, .webp).`);
        continue;
      }
      if (file.size > maxSizeBytes) {
        toast.error(`"${file.name}" exceeds the maximum image size of 50 MB.`);
        continue;
      }
      if (imageCount + validNewPreviews.length >= 5) {
        toast.warning("Maximum of 5 images reached. Extra images were skipped.");
        break;
      }
      if (totalMedia + validNewPreviews.length >= 7) {
        toast.warning("Maximum 7 total media items reached.");
        break;
      }

      validNewPreviews.push({
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: "IMAGE",
        file,
        isExisting: false,
      });
    }

    setMediaList((prev) => [...prev, ...validNewPreviews]);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  // Handle adding video files
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const allowedTypes = ["video/mp4", "video/webm", "video/quicktime"];
    const maxSizeBytes = 200 * 1024 * 1024; // 200MB

    const validNewPreviews: MediaItemPreview[] = [];
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`"${file.name}" is not a supported video format (.mp4, .webm, .mov).`);
        continue;
      }
      if (file.size > maxSizeBytes) {
        toast.error(`"${file.name}" exceeds the maximum video size of 200 MB.`);
        continue;
      }
      if (videoCount + validNewPreviews.length >= 2) {
        toast.warning("Maximum of 2 videos reached. Extra videos were skipped.");
        break;
      }
      if (totalMedia + validNewPreviews.length >= 7) {
        toast.warning("Maximum 7 total media items reached.");
        break;
      }

      validNewPreviews.push({
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: "VIDEO",
        file,
        isExisting: false,
      });
    }

    setMediaList((prev) => [...prev, ...validNewPreviews]);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleRemoveMedia = (index: number) => {
    const item = mediaList[index];
    if (item.isExisting && item.id) {
      setRemoveMediaIds((prev) => [...prev, item.id!]);
    }
    if (item.file && item.url) {
      URL.revokeObjectURL(item.url);
    }
    setMediaList((prev) => prev.filter((_, i) => i !== index));
  };

  // Variant operations
  const handleAddVariant = () => {
    const sizeTrimmed = variantSizeInput.trim();
    if (!sizeTrimmed) {
      toast.error("Please enter a variant size.");
      return;
    }
    const isDuplicate = variants.some((v) => v.size.toLowerCase() === sizeTrimmed.toLowerCase());
    if (isDuplicate) {
      toast.error(`Variant size "${sizeTrimmed}" already exists.`);
      return;
    }
    setVariants((prev) => [
      ...prev,
      { size: sizeTrimmed, stock: Math.max(0, Number(variantStockInput) || 0) },
    ]);
    setVariantSizeInput("");
    setVariantStockInput(10);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantStockChange = (index: number, newStock: number) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, stock: Math.max(0, newStock) } : v)),
    );
  };

  // Quick Create Category handler
  const handleQuickCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error("Category name is required.");
      return;
    }
    try {
      const created = await createCategoryMutation.mutateAsync({
        name: newCategoryName.trim(),
        description: newCategoryDesc.trim() || undefined,
        isActive: true,
      });
      if (created?.id) {
        setCategoryId(created.id);
      }
      setIsCategoryModalOpen(false);
      setNewCategoryName("");
      setNewCategoryDesc("");
    } catch {
      // Error handled by hook toast
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }

    const newImageFiles = mediaList
      .filter((m) => !m.isExisting && m.type === "IMAGE" && m.file)
      .map((m) => m.file as File);

    const newVideoFiles = mediaList
      .filter((m) => !m.isExisting && m.type === "VIDEO" && m.file)
      .map((m) => m.file as File);

    try {
      let savedId = productId;
      if (isEditing && productId) {
        await updateProductMutation.mutateAsync({
          id: productId,
          dto: {
            name: name.trim(),
            categoryId,
            color: color.trim(),
            gst: Number(gst),
            description: description.trim(),
            basePrice: Number(basePrice),
            sellPrice: Number(sellPrice),
            stock: Number(stock),
            variants: variants.length > 0 ? variants : undefined,
            images: newImageFiles.length > 0 ? newImageFiles : undefined,
            videos: newVideoFiles.length > 0 ? newVideoFiles : undefined,
            removeMediaIds: removeMediaIds.length > 0 ? removeMediaIds : undefined,
          },
        });
      } else {
        const created = await createProductMutation.mutateAsync({
          name: name.trim(),
          categoryId,
          color: color.trim(),
          gst: Number(gst),
          description: description.trim(),
          basePrice: Number(basePrice),
          sellPrice: Number(sellPrice),
          stock: Number(stock),
          variants: variants.length > 0 ? variants : undefined,
          images: newImageFiles,
          videos: newVideoFiles.length > 0 ? newVideoFiles : undefined,
        });
        savedId = created?.id || `prod-${Date.now()}`;
      }

      // Sync with local dbStore for smooth offline coexistence (filter out temporary blob URLs)
      const nonBlobImages = mediaList
        .filter((m) => m.url && !m.url.startsWith("blob:"))
        .map((m) => m.url);

      dbStore.saveProduct({
        id: savedId,
        title: name.trim(),
        price: Number(sellPrice),
        compareAtPrice: Number(basePrice),
        colour: color.trim(),
        description: description.trim(),
        category: "clothing",
        stockQuantity: Number(stock),
        inStock: Number(stock) > 0,
        sizes: variants.map((v) => v.size),
        images: nonBlobImages,
      } as any);

      setTimeout(() => {
        navigate({ to: "/admin/products" as any });
      }, 800);
    } catch {
      // Errors handled by mutation onError
    }
  };

  const isSubmitting = createProductMutation.isPending || updateProductMutation.isPending;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 border border-[#E7E5E4] shadow-sm">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => navigate({ to: "/admin/products" as any })}
            className="p-2 border border-[#E7E5E4] bg-white hover:bg-[#FAF8F5] text-[#1C1917] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-light text-[#1C1917]">
              {isEditing ? `Edit Product: ${name || productId}` : "Add New Product"}
            </h1>
            <p className="text-xs text-[#78716C] mt-0.5 font-sans">
              Lamkosh E-Commerce Product Catalog (API v1)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/admin/products" as any })}
            disabled={isSubmitting}
            className="px-4 py-2 border border-[#E7E5E4] text-[#1C1917] bg-white hover:bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || validationErrors.length > 0}
            className="flex items-center space-x-2 px-6 py-2 bg-[#6B1D2F] text-white hover:bg-[#521624] text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isEditing ? "Update Product" : "Create Product"}</span>
          </button>
        </div>
      </div>

      {/* Validation Banner if errors exist */}
      {validationErrors.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-600 p-4 shadow-sm flex items-start space-x-3 text-xs text-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-amber-800">
              Required Validation Rules Before Saving:
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-[#57534E]">
              {validationErrors.slice(0, 3).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
              {validationErrors.length > 3 && (
                <li>...and {validationErrors.length - 3} more condition(s)</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white border border-[#E7E5E4] shadow-sm overflow-x-auto">
        <nav className="flex divide-x divide-[#E7E5E4] text-xs font-semibold uppercase tracking-wider text-[#78716C]">
          {[
            { id: "basic", label: "A. Basic Details", icon: Package },
            { id: "pricing", label: "B. Pricing & Tax", icon: DollarSign },
            { id: "media", label: `C. Media (${totalMedia}/7)`, icon: Upload },
            { id: "inventory", label: "D. Stock Inventory", icon: Layers },
            { id: "variants", label: `E. Variants (${variants.length})`, icon: Tag },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3.5 whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? "border-[#6B1D2F] text-[#6B1D2F] bg-[#FAF8F5]/80 font-bold"
                    : "border-transparent hover:text-[#1C1917] hover:bg-[#FAF8F5]/40"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Form Tab Panels */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#E7E5E4] p-8 shadow-sm">
        {/* ======================================================== */}
        {/* TAB A: BASIC DETAILS */}
        {/* ======================================================== */}
        {activeTab === "basic" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E4]">
              <h2 className="text-lg font-serif text-[#1C1917]">Product Core Details</h2>
              <span className="text-[11px] text-[#78716C]">
                All fields marked with * are required
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="space-y-2 md:col-span-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                    Product Name * (1 to 200 characters)
                  </label>
                  <span className="text-[11px] text-[#78716C]">{name.length}/200</span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={200}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Handcrafted Linen Casual Shirt"
                  className="w-full px-4 py-2.5 border border-[#E7E5E4] bg-[#FAF8F5] focus:bg-white text-sm focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              {/* Category Dropdown */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                    Category * (Valid UUID)
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="text-[11px] text-[#6B1D2F] hover:underline flex items-center space-x-1"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>+ New Category</span>
                  </button>
                </div>
                {isLoadingCategories ? (
                  <div className="px-4 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs text-[#78716C] flex items-center space-x-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Loading categories from backend...</span>
                  </div>
                ) : (
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-2 border border-[#E7E5E4] bg-[#FAF8F5] focus:bg-white text-xs text-[#1C1917] focus:outline-none focus:border-[#6B1D2F]"
                  >
                    <option value="">-- Select Existing Category --</option>
                    {Array.isArray(categories) &&
                      categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name} ({cat.id.slice(0, 8)}...)
                        </option>
                      ))}
                    {categories.length === 0 && (
                      <option value="3fa85f64-5717-4562-b3fc-2c963f66afa6">
                        Default Apparel (3fa85f64-5717-4562-b3fc-2c963f66afa6)
                      </option>
                    )}
                  </select>
                )}
                {categories.length === 0 && !isLoadingCategories && (
                  <p className="text-[11px] text-amber-700">
                    No categories found in backend. Click "+ New Category" to create one.
                  </p>
                )}
              </div>

              {/* Color */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Color Shade * (1 to 50 characters)
                </label>
                <input
                  type="text"
                  required
                  maxLength={50}
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g. Olive Green / Royal Blue / Deep Crimson"
                  className="w-full px-4 py-2 border border-[#E7E5E4] bg-[#FAF8F5] focus:bg-white text-xs focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Product & Fabric Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed rich description of fabric, weaving technique, craft, and care instructions..."
                  className="w-full px-4 py-2.5 border border-[#E7E5E4] bg-[#FAF8F5] focus:bg-white text-xs leading-relaxed focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB B: PRICING & TAX */}
        {/* ======================================================== */}
        {activeTab === "pricing" && (
          <div className="space-y-6">
            <h2 className="text-lg font-serif text-[#1C1917] pb-3 border-b border-[#E7E5E4]">
              Pricing & GST Rules
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Base Price */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Original MRP / Base Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  placeholder="2499"
                  className="w-full px-4 py-2.5 border border-[#E7E5E4] bg-[#FAF8F5] focus:bg-white text-sm font-semibold text-[#1C1917] focus:outline-none focus:border-[#6B1D2F]"
                />
                <span className="text-[11px] text-[#78716C]">
                  Full retail catalog price (basePrice &gt;= 0)
                </span>
              </div>

              {/* Sell Price */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Selling / Discounted Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(Number(e.target.value))}
                  placeholder="1899"
                  className={`w-full px-4 py-2.5 border text-sm font-semibold text-[#1C1917] focus:outline-none ${
                    sellPrice > basePrice
                      ? "border-rose-500 bg-rose-50"
                      : "border-[#E7E5E4] bg-[#FAF8F5] focus:bg-white focus:border-[#6B1D2F]"
                  }`}
                />
                {sellPrice > basePrice ? (
                  <span className="text-[11px] text-rose-600 font-medium">
                    Must be &lt;= Base Price (₹{basePrice})
                  </span>
                ) : (
                  <span className="text-[11px] text-emerald-700">
                    Discount: ₹{Math.max(0, basePrice - sellPrice).toLocaleString("en-IN")} (
                    {basePrice > 0 ? Math.round(((basePrice - sellPrice) / basePrice) * 100) : 0}%
                    OFF)
                  </span>
                )}
              </div>

              {/* GST */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  GST Rate (%) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={gst}
                  onChange={(e) => setGst(Number(e.target.value))}
                  placeholder="12"
                  className="w-full px-4 py-2.5 border border-[#E7E5E4] bg-[#FAF8F5] focus:bg-white text-sm font-semibold text-[#1C1917] focus:outline-none focus:border-[#6B1D2F]"
                />
                <span className="text-[11px] text-[#78716C]">
                  Between 0% and 100% (Standard textiles: 5%, 12%, 18%)
                </span>
              </div>
            </div>

            {/* Price Rule Summary Callout */}
            <div className="bg-[#FAF8F5] p-5 border border-[#E7E5E4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                  Net Customer Checkout Price
                </span>
                <div className="text-2xl font-serif font-medium text-[#6B1D2F] mt-0.5">
                  ₹{Number(sellPrice || 0).toLocaleString("en-IN")}{" "}
                  <span className="text-xs font-sans text-[#78716C]">(Includes {gst}% GST)</span>
                </div>
              </div>

              <div className="text-xs text-[#57534E] max-w-sm">
                Rule Check:{" "}
                {sellPrice <= basePrice ? (
                  <span className="text-emerald-700 font-semibold inline-flex items-center space-x-1">
                    <CheckCircle className="w-3.5 h-3.5 inline" /> Valid (sellPrice &lt;= basePrice)
                  </span>
                ) : (
                  <span className="text-rose-700 font-semibold inline-flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 inline" /> Invalid: sellPrice cannot exceed
                    basePrice
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB C: MEDIA GALLERY (IMAGES & VIDEOS) */}
        {/* ======================================================== */}
        {activeTab === "media" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E7E5E4]">
              <div>
                <h2 className="text-lg font-serif text-[#1C1917]">Product Media Attachments</h2>
                <p className="text-xs text-[#78716C] mt-0.5">
                  Mandatory: Minimum 1 media file. Images: 1 to 5 files (max 50MB each). Videos: max
                  2 files (max 200MB each). Total media &lt;= 7.
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs font-semibold">
                <span className="px-2.5 py-1 bg-[#FAF8F5] border border-[#E7E5E4]">
                  Images: {imageCount}/5
                </span>
                <span className="px-2.5 py-1 bg-[#FAF8F5] border border-[#E7E5E4]">
                  Videos: {videoCount}/2
                </span>
                <span
                  className={`px-2.5 py-1 border ${
                    totalMedia >= 1 && totalMedia <= 7
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-rose-50 text-rose-800 border-rose-200"
                  }`}
                >
                  Total: {totalMedia}/7
                </span>
              </div>
            </div>

            {/* Hidden file inputs */}
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageFileChange}
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
            />
            <input
              type="file"
              ref={videoInputRef}
              onChange={handleVideoFileChange}
              multiple
              accept="video/mp4,video/webm,video/quicktime"
              className="hidden"
            />

            {/* Upload Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={imageCount >= 5 || totalMedia >= 7}
                className="flex items-center space-x-2 px-5 py-3 border border-dashed border-[#6B1D2F] bg-[#FAF8F5] hover:bg-white text-xs font-semibold uppercase tracking-wider text-[#6B1D2F] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Upload Images (Max 5, &lt; 50MB)</span>
              </button>

              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                disabled={videoCount >= 2 || totalMedia >= 7}
                className="flex items-center space-x-2 px-5 py-3 border border-dashed border-[#1C1917] bg-[#FAF8F5] hover:bg-white text-xs font-semibold uppercase tracking-wider text-[#1C1917] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Film className="w-4 h-4" />
                <span>Upload Videos (Max 2, &lt; 200MB)</span>
              </button>
            </div>

            {/* Media Gallery Previews */}
            {mediaList.length === 0 ? (
              <div className="border border-dashed border-[#E7E5E4] p-12 text-center bg-[#FAF8F5]/60 space-y-2">
                <Upload className="w-8 h-8 text-[#A8A29E] mx-auto" />
                <p className="text-xs text-[#78716C] font-medium">
                  No media attached yet. At least 1 image or video is required.
                </p>
                <p className="text-[11px] text-[#A8A29E]">
                  Supported formats: .jpg, .jpeg, .png, .webp, .mp4, .webm, .mov
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {mediaList.map((item, idx) => (
                  <div
                    key={idx}
                    className="relative group border border-[#E7E5E4] bg-[#FAF8F5] overflow-hidden"
                  >
                    {item.type === "IMAGE" ? (
                      <img src={item.url} alt={item.name} className="w-full h-44 object-cover" />
                    ) : (
                      <video
                        src={item.url}
                        controls
                        className="w-full h-44 object-cover bg-black"
                      />
                    )}

                    {/* Badge */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <span className="bg-[#1C1917]/80 text-white text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider">
                        {item.type} {idx === 0 ? "(Primary)" : ""}
                      </span>
                      {item.isExisting && (
                        <span className="bg-emerald-800 text-white text-[9px] px-1.5 py-0.2 uppercase">
                          Saved
                        </span>
                      )}
                    </div>

                    {/* Delete action */}
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(idx)}
                      className="absolute top-2 right-2 bg-rose-700 hover:bg-rose-800 text-white p-1.5 shadow-md transition-opacity"
                      title="Remove file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* File info footer */}
                    <div className="p-2 bg-white border-t border-[#E7E5E4] text-[10px] text-[#78716C] truncate">
                      {item.name}
                      {item.size && <span> ({(item.size / (1024 * 1024)).toFixed(1)} MB)</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB D: STOCK INVENTORY */}
        {/* ======================================================== */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            <h2 className="text-lg font-serif text-[#1C1917] pb-3 border-b border-[#E7E5E4]">
              Master Inventory Stock Count
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Total Master Inventory Stock * (&gt;= 0)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={stock}
                  onChange={(e) => setStock(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="30"
                  className="w-full px-4 py-2.5 border border-[#E7E5E4] bg-[#FAF8F5] focus:bg-white text-sm font-semibold text-[#1C1917] focus:outline-none focus:border-[#6B1D2F]"
                />
                <span className="text-[11px] text-[#78716C]">
                  Total master units currently available in warehouse
                </span>
              </div>

              <div className="bg-[#FAF8F5] p-5 border border-[#E7E5E4] space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                  Stock Inventory Breakdown
                </span>
                <div className="text-xl font-serif font-medium text-[#1C1917]">
                  {stock} units total
                </div>
                <p className="text-[11px] text-[#57534E]">
                  Sum of variant sizes: {variants.reduce((acc, v) => acc + (v.stock || 0), 0)} units
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB E: VARIANTS */}
        {/* ======================================================== */}
        {activeTab === "variants" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E7E5E4]">
              <div>
                <h2 className="text-lg font-serif text-[#1C1917]">Product Size Variants</h2>
                <p className="text-xs text-[#78716C] mt-0.5">
                  Array of size and stock objects. Duplicate sizes are rejected.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-[#FAF8F5] border border-[#E7E5E4]">
                Total Variants: {variants.length}
              </span>
            </div>

            {/* Add Variant Form */}
            <div className="flex flex-wrap items-end gap-3 bg-[#FAF8F5] p-4 border border-[#E7E5E4]">
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1C1917]">
                  Size Label (e.g. S, M, L, XL, 38, 40)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 42 / XL"
                  value={variantSizeInput}
                  onChange={(e) => setVariantSizeInput(e.target.value)}
                  className="px-3 py-2 border border-[#E7E5E4] bg-white text-xs text-[#1C1917] focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1C1917]">
                  Stock for Size
                </label>
                <input
                  type="number"
                  min="0"
                  value={variantStockInput}
                  onChange={(e) => setVariantStockInput(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-28 px-3 py-2 border border-[#E7E5E4] bg-white text-xs text-[#1C1917] focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <button
                type="button"
                onClick={handleAddVariant}
                className="flex items-center space-x-1 px-4 py-2 bg-[#1C1917] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Variant</span>
              </button>
            </div>

            {/* Variant Table */}
            {variants.length === 0 ? (
              <p className="text-xs text-[#78716C] italic p-4 text-center">
                No variants configured. Product will be sold as a single standard piece.
              </p>
            ) : (
              <div className="border border-[#E7E5E4] overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] border-b border-[#E7E5E4] uppercase tracking-wider font-semibold text-[#78716C] text-[11px]">
                    <tr>
                      <th className="p-3">Size</th>
                      <th className="p-3">Stock Count</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E5E4]">
                    {variants.map((v, i) => (
                      <tr key={i} className="hover:bg-[#FAF8F5]/50">
                        <td className="p-3 font-semibold text-[#1C1917]">{v.size}</td>
                        <td className="p-3">
                          <input
                            type="number"
                            min="0"
                            value={v.stock}
                            onChange={(e) =>
                              handleVariantStockChange(i, parseInt(e.target.value) || 0)
                            }
                            className="w-24 px-2 py-1 border border-[#E7E5E4] bg-white text-xs"
                          />
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(i)}
                            className="text-rose-600 hover:text-rose-800 p-1"
                            title="Remove variant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-8 pt-6 border-t border-[#E7E5E4] flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate({ to: "/admin/products" as any })}
            disabled={isSubmitting}
            className="px-5 py-2.5 border border-[#E7E5E4] text-[#1C1917] bg-white hover:bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wider"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || validationErrors.length > 0}
            className="flex items-center space-x-2 px-8 py-2.5 bg-[#6B1D2F] text-white hover:bg-[#521624] text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isEditing ? "Save & Update Product" : "Publish Product to Catalog"}</span>
          </button>
        </div>
      </form>

      {/* Quick Add Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E5E4] max-w-md w-full shadow-2xl p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E4]">
              <h3 className="text-base font-serif text-[#1C1917]">Create Category (Admin API)</h3>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-[#78716C] hover:text-[#1C1917]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickCreateCategory} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Linen Shirts / Pure Silk Kurtas"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Category description..."
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 border border-[#E7E5E4] text-xs uppercase font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createCategoryMutation.isPending}
                  className="flex items-center space-x-1 px-5 py-2 bg-[#6B1D2F] text-white text-xs uppercase font-semibold hover:bg-[#521624]"
                >
                  {createCategoryMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  <span>Create Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
