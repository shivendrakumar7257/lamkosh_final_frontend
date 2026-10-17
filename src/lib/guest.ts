/**
 * Guest ID management and utilities for guest cart & wishlist tracking and merging
 * Prompt requirement: Store guest ID in localStorage under the key 'guest_id' and pass it via X-Guest-ID.
 */

export const GUEST_ID_KEY = "guest_id";

function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback RFC4122 v4 UUID generator
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getGuestId(): string | null {
  if (typeof window === "undefined") return null;
  let id = localStorage.getItem(GUEST_ID_KEY);
  if (!id) {
    // Check fallback legacy keys if any existed
    id = localStorage.getItem("lamoksh_guest_id") || localStorage.getItem("guestId");
    if (id) {
      localStorage.setItem(GUEST_ID_KEY, id);
    }
  }
  return id;
}

export function setGuestId(id: string): void {
  if (typeof window === "undefined" || !id) return;
  localStorage.setItem(GUEST_ID_KEY, id);
}

export function getOrCreateGuestId(): string {
  if (typeof window === "undefined") return generateUUID();
  let id = getGuestId();
  if (!id) {
    id = generateUUID();
    localStorage.setItem(GUEST_ID_KEY, id);
  }
  return id;
}

export function clearGuestId(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_ID_KEY);
  localStorage.removeItem("lamoksh_guest_id");
  localStorage.removeItem("guestId");
}
