export interface WishlistProductMedia {
  id?: string;
  type?: "IMAGE" | "VIDEO" | string;
  url: string;
  sortOrder?: number;
}

export interface WishlistProduct {
  id: string;
  name: string;
  color?: string;
  gst?: number;
  description?: string;
  basePrice?: number;
  sellPrice: number;
  stock: number;
  media?: WishlistProductMedia[];
  images?: string[];
  handle?: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  createdAt: string;
  product: WishlistProduct;
}

export interface WishlistObject {
  wishlistId?: string | null;
  guestId?: string | null;
  items: WishlistItem[];
  totalItems: number;
}

export interface WishlistResponseData {
  wishlist: WishlistObject;
  guestId?: string;
}

export interface WishlistCheckResponse {
  productId: string;
  isWishlisted: boolean;
}

export interface WishlistMergeResponse {
  merged: boolean;
  wishlist: WishlistObject;
}
