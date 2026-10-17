export interface CartProductMedia {
  id: string;
  type?: "IMAGE" | "VIDEO" | string;
  url: string;
  sortOrder?: number;
}

export interface CartProductVariant {
  id: string;
  size: string;
  stock: number;
}

export interface CartProduct {
  id: string;
  name: string;
  color?: string;
  gst?: number;
  description?: string;
  basePrice?: number;
  sellPrice: number;
  stock: number;
  media?: CartProductMedia[];
  images?: string[];
  variants?: CartProductVariant[];
  handle?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  subtotal: number;
  availableStock: number;
  product: CartProduct;
  variant?: CartProductVariant | null;
}

export interface CartObject {
  cartId?: string | null;
  guestId?: string | null;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

export interface CartResponseData {
  cart: CartObject;
  guestId?: string;
}

export interface AddToCartPayload {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface UpdateQuantityPayload {
  quantity: number;
}

export interface CartCheckResponse {
  inCart: boolean;
  quantity: number;
}

export interface CartAdjustedItem {
  productId: string;
  variantId?: string | null;
  originalQuantity: number;
  mergedQuantity: number;
  reason: string;
}

export interface CartMergeResponse {
  merged: boolean;
  adjustedItems: CartAdjustedItem[];
  cart: CartObject;
}
