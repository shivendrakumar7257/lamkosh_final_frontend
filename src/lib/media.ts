import { BASE_URL } from "@/api/apiClient";

export function getMediaUrl(path?: string | null): string {
  if (!path) return "";

  // If it's a blob URL that leaked from local previews or object URLs, ignore it
  if (path.startsWith("blob:")) {
    return "";
  }

  // Derive backend origin from BASE_URL (stripping /api/v1)
  const backendOrigin = BASE_URL.replace(/\/api\/v1\/?$/, "");

  // If path contains localhost or 127.0.0.1, strip localhost and replace with backend origin
  if (path.includes("localhost") || path.includes("127.0.0.1")) {
    const withoutHost = path
      .replace(/^https?:\/\/localhost(:\d+)?/, "")
      .replace(/^https?:\/\/127\.0\.0\.1(:\d+)?/, "");
    const cleanPath = withoutHost.startsWith("/") ? withoutHost : `/${withoutHost}`;
    return `${backendOrigin}${cleanPath}`;
  }

  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return backendOrigin ? `${backendOrigin}${cleanPath}` : cleanPath;
}
