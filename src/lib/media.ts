import { BASE_URL } from "@/api/apiClient";

export function getMediaUrl(path?: string | null): string {
  if (!path) return "";

  // If it's a blob URL that leaked from local previews or object URLs, ignore it
  if (path.startsWith("blob:")) {
    return "";
  }

  // Derive backend origin from BASE_URL (stripping /api/v1)
  const backendOrigin = BASE_URL.replace(/\/api\/v1\/?$/, "");

  // If already absolute URL or data URI, return as-is
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return backendOrigin ? `${backendOrigin}${cleanPath}` : cleanPath;
}
