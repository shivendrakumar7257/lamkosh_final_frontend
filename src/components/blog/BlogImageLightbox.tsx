import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ZoomIn, ZoomOut, RotateCw } from "lucide-react";

interface BlogImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText?: string;
}

export function BlogImageLightbox({
  isOpen,
  onClose,
  imageUrl,
  altText,
}: BlogImageLightboxProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-8 animate-in fade-in-0 duration-200">
      {/* Dark overlay backdrop */}
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Top Floating Controls */}
      <div className="fixed top-4 right-4 z-20 flex items-center gap-2">
        <button
          type="button"
          aria-label="Close image preview"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/30"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Uncropped Image Display */}
      <div className="relative z-10 max-h-[92vh] max-w-[94vw] flex flex-col items-center justify-center">
        <img
          src={imageUrl}
          alt={altText || "LaMoksh image preview"}
          className="max-h-[85vh] max-w-[90vw] object-contain rounded-xs shadow-2xl transition-transform"
        />
        {altText && (
          <p className="mt-3 text-center text-xs text-white/80 max-w-lg font-sans">
            {altText}
          </p>
        )}
      </div>
    </div>,
    document.body,
  );
}
