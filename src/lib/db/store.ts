import { Product, collections as seedCollections, products as seedProducts } from "@/data/catalog";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  parentId?: string;
  displayOrder: number;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface CollectionItem {
  handle: string;
  title: string;
  editorialTitle: string;
  group: string;
  description: string;
  image: string;
  bannerImage?: string;
  displayOrder: number;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productHandle: string;
  productTitle: string;
  productImage: string;
  size?: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded" | "partially_refunded";
  orderStatus:
    | "pending"
    | "confirmed"
    | "processing"
    | "packed"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned"
    | "refunded";
  trackingNumber?: string;
  courierName?: string;
  couponCode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  totalOrders: number;
  totalSpent: number;
  status: "active" | "inactive" | "blocked";
  createdAt: string;
  updatedAt: string;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productHandle: string;
  productTitle: string;
  quantityChange: number;
  previousQuantity: number;
  newQuantity: number;
  reason: "restock" | "return" | "damaged" | "audit_adjustment" | "initial_stock";
  note?: string;
  performedBy: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  perCustomerLimit: number;
  startDate: string;
  expiryDate?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  productHandle: string;
  productTitle: string;
  reviewerName: string;
  reviewerEmail: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  status: "draft" | "published";
  publishedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  businessAddress: string;
  currency: string;
  taxRatePercent: number;
  defaultLowStockThreshold: number;
  complimentaryShippingMinOrder: number;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  metaTitle: string;
  metaDescription: string;
}

export interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, any>;
  createdAt: string;
}

// Initial Seed Data Generators
const initialCategories: Category[] = [
  {
    id: "cat-1",
    name: "Handloom Suit Sets",
    slug: "handloom-suit-sets",
    description: "Pure cotton and silk handcrafted suit sets with artisanal embroidery.",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "cat-2",
    name: "Ikat Prints",
    slug: "ikat-prints",
    description: "Traditional hand-woven Ikat cotton and silk ensembles.",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "cat-3",
    name: "Banarasi Silks",
    slug: "banarasi-silks",
    description: "Handwoven Banarasi zari silk sarees and suits from Varanasi.",
    displayOrder: 3,
    isActive: true,
  },
  {
    id: "cat-4",
    name: "Maheshwari Silk",
    slug: "maheshwari-silk",
    description: "Lightweight, lustrous Maheshwari tissue silk creations.",
    displayOrder: 4,
    isActive: true,
  },
];

const initialCollections: CollectionItem[] = seedCollections.map((c, i) => ({
  handle: c.handle,
  title: c.title,
  editorialTitle: c.editorialTitle,
  group: c.group,
  description: c.description,
  image: c.image,
  displayOrder: i + 1,
  isActive: true,
}));

const initialCustomers: Customer[] = [];

const initialOrders: Order[] = [];

const initialCoupons: Coupon[] = [];

const initialReviews: ProductReview[] = [];

const initialBlogs: BlogPost[] = [];


const initialSettings: StoreSettings = {
  storeName: "LaMoksh Fabrics",
  supportEmail: "care@lamoksh.in",
  supportPhone: "+91 99998 75605",
  businessAddress:
    "LG 3, LG 4 & LG 8, HRC Shopping Complex, Vaibhav Khand, Indirapuram, Ghaziabad, Uttar Pradesh 201014",
  currency: "INR (₹)",
  taxRatePercent: 5.0,
  defaultLowStockThreshold: 5,
  complimentaryShippingMinOrder: 0,
  instagramUrl: "https://www.instagram.com/lamokshfabrics",
  facebookUrl: "https://www.facebook.com/LamokshFabrics/",
  youtubeUrl: "https://www.youtube.com/@lamoksh_fabrics",
  metaTitle: "LaMoksh Fabrics — Handcrafted Luxury Clothing",
  metaDescription:
    "An Indian house of handwoven clothing — Banarasi silks, Maheshwari suits, handpaint stole sets and bespoke edits.",
};

// Dummy entity IDs to purge from legacy browser storage
const DUMMY_ENTITY_IDS = new Set([
  "ord-1001",
  "ord-1002",
  "ord-1003",
  "cust-1",
  "cust-2",
  "cust-3",
  "coup-1",
  "coup-2",
  "rev-1",
  "rev-2",
  "blog-1",
  "blog-2",
  "inv-1",
  "audit-1",
]);

// Helper for Browser Persistent Local Storage Engine
function loadStorage<T>(key: string, seedData: T): T {
  if (typeof window === "undefined") return seedData;
  try {
    const raw = window.localStorage.getItem(`manmayi_db_${key}`);
    if (!raw) {
      window.localStorage.setItem(`manmayi_db_${key}`, JSON.stringify(seedData));
      return seedData;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const cleaned = parsed.filter((item: any) => !DUMMY_ENTITY_IDS.has(item?.id));
      if (cleaned.length !== parsed.length) {
        window.localStorage.setItem(`manmayi_db_${key}`, JSON.stringify(cleaned));
      }
      return cleaned as unknown as T;
    }
    return parsed as T;
  } catch (err) {
    console.error(`Error loading storage key ${key}:`, err);
    return seedData;
  }
}

function saveStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(`manmayi_db_${key}`, JSON.stringify(data));
    // Trigger window event so active storefront React components automatically re-render!
    window.dispatchEvent(new Event("manmayi_db_updated"));
  } catch (err) {
    console.error(`Error saving storage key ${key}:`, err);
  }
}

// Unified Storehouse API
export class UnifiedDatabaseStore {
  // PRODUCTS
  getProducts(): Product[] {
    const seeded = seedProducts.map((p) => ({
      ...p,
      stockQuantity: (p as any).stockQuantity ?? 12,
      status: (p as any).status ?? "active",
      costPrice: Math.round(p.price * 0.55),
    }));
    const loaded = loadStorage<Product[]>("products", seeded);
    if (!Array.isArray(loaded)) return [];
    return loaded
      .filter((p) => {
        if (!p || typeof p !== "object") return false;
        const pid = typeof p.id === "string" ? p.id : "";
        return !pid.startsWith("mn-") && !pid.startsWith("prod-seed-");
      })
      .map((p) => ({
        ...p,
        images: (p.images || []).filter(
          (img: string) => typeof img === "string" && !img.startsWith("blob:"),
        ),
      }));
  }

  getProductByHandle(handle: string): Product | undefined {
    return this.getProducts().find((p) => p.handle === handle);
  }

  getProductById(id: string): Product | undefined {
    return this.getProducts().find((p) => p.id === id);
  }

  saveProduct(product: Partial<Product> & { title: string; price: number }): Product {
    const products = this.getProducts();
    const now = new Date().toISOString();

    let existingIndex = -1;
    if (product.id) {
      existingIndex = products.findIndex((p) => p.id === product.id);
    } else if (product.handle) {
      existingIndex = products.findIndex((p) => p.handle === product.handle);
    }

    const handle =
      product.handle ||
      product.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const newProduct: Product = {
      id: product.id || `prod-${Date.now()}`,
      handle,
      title: product.title,
      price: Number(product.price),
      category: "clothing",
      type: product.type || "Handloom Suit Sets",
      collections: product.collections || ["new-arrivals"],
      material: product.material || "Cotton",
      colour: product.colour || "Ivory",
      inStock: product.inStock ?? true,
      images: product.images?.length ? product.images : (seedProducts[0]?.images ? [seedProducts[0].images[0]] : []),
      description: product.description || "Handcrafted creation from the atelier.",
      craft: product.craft || "Handloom woven.",
      dimensions: product.dimensions || "3-Piece Set",
      care: product.care || "Dry clean recommended.",
      sizes: product.sizes || ["XS", "S", "M", "L", "XL", "XXL"],
      ...(product as any),
    };

    if (existingIndex >= 0) {
      const prevStock = products[existingIndex].stockQuantity ?? 12;
      const newStock = (newProduct as any).stockQuantity ?? prevStock;

      if (prevStock !== newStock) {
        this.addInventoryLog({
          productId: newProduct.id,
          productHandle: newProduct.handle,
          productTitle: newProduct.title,
          quantityChange: newStock - prevStock,
          previousQuantity: prevStock,
          newQuantity: newStock,
          reason: newStock > prevStock ? "restock" : "audit_adjustment",
          note: "Product stock updated via Admin form",
          performedBy: "Administrator",
        });
      }

      products[existingIndex] = newProduct;
    } else {
      products.unshift(newProduct);
      this.addInventoryLog({
        productId: newProduct.id,
        productHandle: newProduct.handle,
        productTitle: newProduct.title,
        quantityChange: (newProduct as any).stockQuantity ?? 12,
        previousQuantity: 0,
        newQuantity: (newProduct as any).stockQuantity ?? 12,
        reason: "initial_stock",
        note: "Initial product stock creation",
        performedBy: "Administrator",
      });
    }

    saveStorage("products", products);
    this.addAuditLog(
      existingIndex >= 0 ? "UPDATE_PRODUCT" : "CREATE_PRODUCT",
      "product",
      newProduct.id,
      { title: newProduct.title, price: newProduct.price },
    );
    return newProduct;
  }

  deleteProduct(id: string): void {
    const products = this.getProducts().filter((p) => p.id !== id && p.handle !== id);
    saveStorage("products", products);
    this.addAuditLog("DELETE_PRODUCT", "product", id);
  }

  bulkUpdateProductStatus(ids: string[], status: "active" | "draft" | "archived"): void {
    const products = this.getProducts().map((p) =>
      ids.includes(p.id) || ids.includes(p.handle) ? ({ ...p, status } as any) : p,
    );
    saveStorage("products", products);
    this.addAuditLog("BULK_STATUS_PRODUCT", "product", ids.join(","), { status });
  }

  bulkDeleteProducts(ids: string[]): void {
    const products = this.getProducts().filter(
      (p) => !ids.includes(p.id) && !ids.includes(p.handle),
    );
    saveStorage("products", products);
    this.addAuditLog("BULK_DELETE_PRODUCT", "product", ids.join(","));
  }

  // CATEGORIES
  getCategories(): Category[] {
    return loadStorage<Category[]>("categories", initialCategories);
  }

  saveCategory(cat: Partial<Category> & { name: string }): Category {
    const categories = this.getCategories();
    const slug =
      cat.slug ||
      cat.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const newCat: Category = {
      id: cat.id || `cat-${Date.now()}`,
      name: cat.name,
      slug,
      description: cat.description || "",
      imageUrl: cat.imageUrl || "",
      displayOrder: cat.displayOrder || categories.length + 1,
      isActive: cat.isActive ?? true,
      seoTitle: cat.seoTitle || cat.name,
      seoDescription: cat.seoDescription || cat.description,
    };

    const idx = categories.findIndex((c) => c.id === newCat.id);
    if (idx >= 0) {
      categories[idx] = newCat;
    } else {
      categories.push(newCat);
    }
    saveStorage("categories", categories);
    this.addAuditLog("SAVE_CATEGORY", "category", newCat.id, { name: newCat.name });
    return newCat;
  }

  deleteCategory(id: string): void {
    const categories = this.getCategories().filter((c) => c.id !== id);
    saveStorage("categories", categories);
    this.addAuditLog("DELETE_CATEGORY", "category", id);
  }

  // COLLECTIONS
  getCollections(): CollectionItem[] {
    return loadStorage<CollectionItem[]>("collections", initialCollections);
  }

  saveCollection(col: Partial<CollectionItem> & { title: string; handle: string }): CollectionItem {
    const collections = this.getCollections();
    const newCol: CollectionItem = {
      handle: col.handle,
      title: col.title,
      editorialTitle: col.editorialTitle || col.title,
      group: col.group || "clothing",
      description: col.description || "",
      image: col.image || seedProducts[0]?.images?.[0] || "",
      displayOrder: col.displayOrder || collections.length + 1,
      isActive: col.isActive ?? true,
    };

    const idx = collections.findIndex((c) => c.handle === newCol.handle);
    if (idx >= 0) {
      collections[idx] = newCol;
    } else {
      collections.push(newCol);
    }
    saveStorage("collections", collections);
    this.addAuditLog("SAVE_COLLECTION", "collection", newCol.handle, { title: newCol.title });
    return newCol;
  }

  deleteCollection(handle: string): void {
    const collections = this.getCollections().filter((c) => c.handle !== handle);
    saveStorage("collections", collections);
    this.addAuditLog("DELETE_COLLECTION", "collection", handle);
  }

  // ORDERS
  getOrders(): Order[] {
    return loadStorage<Order[]>("orders", initialOrders);
  }

  getOrderById(id: string): Order | undefined {
    return this.getOrders().find((o) => o.id === id || o.orderNumber === id);
  }

  updateOrderStatus(
    id: string,
    orderStatus: Order["orderStatus"],
    trackingNumber?: string,
    courierName?: string,
  ): Order {
    const orders = this.getOrders();
    const idx = orders.findIndex((o) => o.id === id || o.orderNumber === id);
    if (idx < 0) throw new Error(`Order ${id} not found`);

    orders[idx] = {
      ...orders[idx],
      orderStatus,
      trackingNumber: trackingNumber || orders[idx].trackingNumber,
      courierName: courierName || orders[idx].courierName,
      updatedAt: new Date().toISOString(),
    };

    saveStorage("orders", orders);
    this.addAuditLog("UPDATE_ORDER_STATUS", "order", id, { orderStatus, trackingNumber });
    return orders[idx];
  }

  createOrder(orderData: Partial<Order>): Order {
    const orders = this.getOrders();
    const orderNumber = `MN-${new Date().getFullYear()}-${1000 + orders.length + 1}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerId: orderData.customerId || `cust-${Date.now()}`,
      customerName: orderData.customerName || "Valued Client",
      customerEmail: orderData.customerEmail || "client@example.com",
      customerPhone: orderData.customerPhone || "+91 99999 00000",
      shippingAddress: orderData.shippingAddress || {
        street: "10 Luxury Lane",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110001",
        country: "India",
      },
      billingAddress: orderData.billingAddress || {
        street: "10 Luxury Lane",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110001",
        country: "India",
      },
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      discountAmount: orderData.discountAmount || 0,
      shippingFee: orderData.shippingFee || 0,
      taxAmount: orderData.taxAmount || 0,
      totalAmount: orderData.totalAmount || 0,
      paymentMethod: orderData.paymentMethod || "Online Payment",
      paymentStatus: orderData.paymentStatus || "paid",
      orderStatus: "confirmed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    saveStorage("orders", orders);

    // Update product stock quantities
    newOrder.items.forEach((item) => {
      const products = this.getProducts();
      const pIdx = products.findIndex(
        (p) => p.handle === item.productHandle || p.id === item.productId,
      );
      if (pIdx >= 0) {
        const curStock = (products[pIdx] as any).stockQuantity ?? 12;
        const newStock = Math.max(0, curStock - item.quantity);
        (products[pIdx] as any).stockQuantity = newStock;
        if (newStock === 0) products[pIdx].inStock = false;
        saveStorage("products", products);

        this.addInventoryLog({
          productId: products[pIdx].id,
          productHandle: products[pIdx].handle,
          productTitle: products[pIdx].title,
          quantityChange: -item.quantity,
          previousQuantity: curStock,
          newQuantity: newStock,
          reason: "audit_adjustment",
          note: `Deducted for order ${newOrder.orderNumber}`,
          performedBy: "Storefront Checkout",
        });
      }
    });

    this.addAuditLog("CREATE_ORDER", "order", newOrder.id, { orderNumber: newOrder.orderNumber });
    return newOrder;
  }

  // CUSTOMERS
  getCustomers(): Customer[] {
    return loadStorage<Customer[]>("customers", initialCustomers);
  }

  getCustomerById(id: string): Customer | undefined {
    return this.getCustomers().find((c) => c.id === id || c.email === id);
  }

  saveCustomer(customer: Partial<Customer> & { email: string; fullName: string }): Customer {
    const customers = this.getCustomers();
    const idx = customers.findIndex((c) => c.id === customer.id || c.email === customer.email);

    const newCust: Customer = {
      id: customer.id || `cust-${Date.now()}`,
      email: customer.email,
      fullName: customer.fullName,
      phone: customer.phone || "+91 99999 99999",
      address: customer.address || {
        street: "Main Street",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110001",
        country: "India",
      },
      totalOrders: customer.totalOrders || 0,
      totalSpent: customer.totalSpent || 0,
      status: customer.status || "active",
      createdAt: customer.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (idx >= 0) {
      customers[idx] = newCust;
    } else {
      customers.unshift(newCust);
    }
    saveStorage("customers", customers);
    return newCust;
  }

  // INVENTORY LOGS
  getInventoryLogs(): InventoryLog[] {
    return loadStorage<InventoryLog[]>("inventory_logs", []);
  }

  addInventoryLog(log: Omit<InventoryLog, "id" | "createdAt">): InventoryLog {
    const logs = this.getInventoryLogs();
    const newLog: InventoryLog = {
      ...log,
      id: `inv-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    logs.unshift(newLog);
    saveStorage("inventory_logs", logs);
    return newLog;
  }

  adjustStock(
    productId: string,
    change: number,
    reason: InventoryLog["reason"],
    note: string,
    performedBy = "Administrator",
  ): Product {
    const products = this.getProducts();
    const idx = products.findIndex((p) => p.id === productId || p.handle === productId);
    if (idx < 0) throw new Error(`Product ${productId} not found`);

    const curStock = (products[idx] as any).stockQuantity ?? 12;
    const newStock = Math.max(0, curStock + change);

    (products[idx] as any).stockQuantity = newStock;
    products[idx].inStock = newStock > 0;

    saveStorage("products", products);

    this.addInventoryLog({
      productId: products[idx].id,
      productHandle: products[idx].handle,
      productTitle: products[idx].title,
      quantityChange: change,
      previousQuantity: curStock,
      newQuantity: newStock,
      reason,
      note,
      performedBy,
    });

    this.addAuditLog("ADJUST_STOCK", "inventory", productId, { change, newStock, reason });
    return products[idx];
  }

  // COUPONS
  getCoupons(): Coupon[] {
    return loadStorage<Coupon[]>("coupons", initialCoupons);
  }

  saveCoupon(coupon: Partial<Coupon> & { code: string; discountValue: number }): Coupon {
    const coupons = this.getCoupons();
    const newCode = coupon.code.toUpperCase().trim();
    const idx = coupons.findIndex((c) => c.id === coupon.id || c.code === newCode);

    const newCoupon: Coupon = {
      id: coupon.id || `coup-${Date.now()}`,
      code: newCode,
      discountType: coupon.discountType || "percentage",
      discountValue: Number(coupon.discountValue),
      minOrderValue: Number(coupon.minOrderValue || 0),
      maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : undefined,
      usageLimit: coupon.usageLimit ? Number(coupon.usageLimit) : undefined,
      usedCount: coupon.usedCount || 0,
      perCustomerLimit: coupon.perCustomerLimit || 1,
      startDate: coupon.startDate || new Date().toISOString(),
      expiryDate: coupon.expiryDate || undefined,
      isActive: coupon.isActive ?? true,
      createdAt: coupon.createdAt || new Date().toISOString(),
    };

    if (idx >= 0) {
      coupons[idx] = newCoupon;
    } else {
      coupons.unshift(newCoupon);
    }
    saveStorage("coupons", coupons);
    this.addAuditLog("SAVE_COUPON", "coupon", newCoupon.code, { code: newCoupon.code });
    return newCoupon;
  }

  deleteCoupon(id: string): void {
    const coupons = this.getCoupons().filter((c) => c.id !== id && c.code !== id);
    saveStorage("coupons", coupons);
    this.addAuditLog("DELETE_COUPON", "coupon", id);
  }

  validateCoupon(
    code: string,
    orderValue: number,
  ): { valid: boolean; discountAmount: number; message: string } {
    const coupon = this.getCoupons().find(
      (c) => c.code.toUpperCase() === code.toUpperCase().trim(),
    );
    if (!coupon || !coupon.isActive) {
      return { valid: false, discountAmount: 0, message: "Invalid or inactive coupon code." };
    }
    if (orderValue < coupon.minOrderValue) {
      return {
        valid: false,
        discountAmount: 0,
        message: `Minimum order value of ₹${coupon.minOrderValue.toLocaleString("en-IN")} required for this coupon.`,
      };
    }
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return { valid: false, discountAmount: 0, message: "This coupon code has expired." };
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, discountAmount: 0, message: "Coupon usage limit reached." };
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (orderValue * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    return {
      valid: true,
      discountAmount: Math.min(orderValue, Math.round(discount)),
      message: `Coupon ${coupon.code} applied successfully!`,
    };
  }

  // REVIEWS
  getReviews(): ProductReview[] {
    return loadStorage<ProductReview[]>("reviews", initialReviews);
  }

  saveReview(
    review: Partial<ProductReview> & {
      productId: string;
      reviewerName: string;
      rating: number;
      comment: string;
    },
  ): ProductReview {
    const reviews = this.getReviews();
    const product =
      this.getProductById(review.productId) || this.getProductByHandle(review.productId);

    const newReview: ProductReview = {
      id: review.id || `rev-${Date.now()}`,
      productId: review.productId,
      productHandle: product?.handle || "general",
      productTitle: product?.title || "LaMoksh Creation",
      reviewerName: review.reviewerName,
      reviewerEmail: review.reviewerEmail || "reviewer@example.com",
      rating: Number(review.rating),
      comment: review.comment,
      status: review.status || "approved",
      isVerifiedPurchase: review.isVerifiedPurchase ?? true,
      createdAt: new Date().toISOString(),
    };

    reviews.unshift(newReview);
    saveStorage("reviews", reviews);
    return newReview;
  }

  updateReviewStatus(id: string, status: ProductReview["status"]): void {
    const reviews = this.getReviews().map((r) => (r.id === id ? { ...r, status } : r));
    saveStorage("reviews", reviews);
    this.addAuditLog("UPDATE_REVIEW_STATUS", "review", id, { status });
  }

  deleteReview(id: string): void {
    const reviews = this.getReviews().filter((r) => r.id !== id);
    saveStorage("reviews", reviews);
    this.addAuditLog("DELETE_REVIEW", "review", id);
  }

  // BLOGS
  getBlogs(): BlogPost[] {
    return loadStorage<BlogPost[]>("blogs", initialBlogs);
  }

  saveBlog(blog: Partial<BlogPost> & { title: string; content: string }): BlogPost {
    const blogs = this.getBlogs();
    const slug =
      blog.slug ||
      blog.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const newBlog: BlogPost = {
      id: blog.id || `blog-${Date.now()}`,
      slug,
      title: blog.title,
      excerpt: blog.excerpt || blog.content.substring(0, 150) + "...",
      content: blog.content,
      coverImage: blog.coverImage || seedProducts[0]?.images?.[0] || "",
      author: blog.author || "LaMoksh Editorial",
      status: blog.status || "published",
      publishedAt: blog.publishedAt || new Date().toISOString(),
      seoTitle: blog.seoTitle || blog.title,
      seoDescription: blog.seoDescription || blog.excerpt,
      createdAt: blog.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const idx = blogs.findIndex((b) => b.id === newBlog.id || b.slug === newBlog.slug);
    if (idx >= 0) {
      blogs[idx] = newBlog;
    } else {
      blogs.unshift(newBlog);
    }
    saveStorage("blogs", blogs);
    this.addAuditLog("SAVE_BLOG", "blog", newBlog.id, { title: newBlog.title });
    return newBlog;
  }

  deleteBlog(id: string): void {
    const blogs = this.getBlogs().filter((b) => b.id !== id && b.slug !== id);
    saveStorage("blogs", blogs);
    this.addAuditLog("DELETE_BLOG", "blog", id);
  }

  // STORE SETTINGS & CONTENT BLOCKS
  getStoreSettings(): StoreSettings {
    return loadStorage<StoreSettings>("settings", initialSettings);
  }

  updateStoreSettings(settings: Partial<StoreSettings>): StoreSettings {
    const current = this.getStoreSettings();
    const updated = { ...current, ...settings };
    saveStorage("settings", updated);
    this.addAuditLog("UPDATE_STORE_SETTINGS", "settings", "global");
    return updated;
  }

  // AUDIT LOGS
  getAuditLogs(): AuditLog[] {
    return loadStorage<AuditLog[]>("audit_logs", []);
  }

  addAuditLog(
    action: string,
    entityType: string,
    entityId?: string,
    details?: Record<string, any>,
  ): void {
    const logs = this.getAuditLogs();
    let adminEmail = "admin@lamkosh.com";
    if (typeof window !== "undefined") {
      try {
        const userStr = window.localStorage.getItem("lamoksh_admin_user");
        if (userStr) {
          const userObj = JSON.parse(userStr);
          if (userObj?.email) adminEmail = userObj.email;
        }
      } catch {}
    }

    const newLog: AuditLog = {
      id: `audit-${Date.now()}`,
      adminEmail,
      action,
      entityType,
      entityId,
      details,
      createdAt: new Date().toISOString(),
    };
    logs.unshift(newLog);
    // Keep last 100 audit logs
    saveStorage("audit_logs", logs.slice(0, 100));
  }
}

export const dbStore = new UnifiedDatabaseStore();
