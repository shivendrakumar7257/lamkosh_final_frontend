import React, { useMemo } from "react";
import { Sparkles, Check, Gem, Scissors, Palette, Lightbulb, Calendar, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductDescriptionViewProps {
  description?: string;
  className?: string;
}

interface ParsedDescription {
  intro: string;
  specs: { label: string; value: string; details?: string }[];
  highlights: string[];
  perfectFor?: string;
  styleTip?: string;
  otherParagraphs: string[];
}

export function parseProductDescription(raw?: string): ParsedDescription {
  if (!raw || !raw.trim()) {
    return {
      intro: "",
      specs: [],
      highlights: [],
      otherParagraphs: [],
    };
  }

  // Normalize line breaks
  const normalized = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = normalized.split("\n").map((l) => l.trim());

  let intro = "";
  const specs: { label: string; value: string; details?: string }[] = [];
  const highlights: string[] = [];
  let perfectFor: string | undefined;
  let styleTip: string | undefined;
  const otherParagraphs: string[] = [];

  let isReadingHighlights = false;
  let currentSpec: { label: string; value: string; details?: string } | null = null;
  let introLines: string[] = [];

  const specKeyRegex =
    /^(Kurti Fabric|Dupatta Fabric|Bottom Fabric|Fabric|Material|Colour|Color|Weave|Work|Craft|Embroidery|Bottom|Dupatta|Kurti|Length|Fit)\s*:\s*(.*)$/i;
  const perfectForRegex = /^(Perfect For|Occasion|Best For)\s*:\s*(.*)$/i;
  const styleTipRegex = /^(Style Tip|Styling Suggestion|Styling Tip|How to Style)\s*:\s*(.*)$/i;
  const highlightsHeaderRegex = /^(Product Highlights|Highlights|Key Features|Features|Details)\s*:?$/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    // Check for "Perfect For"
    const perfectMatch = line.match(perfectForRegex);
    if (perfectMatch) {
      if (currentSpec) {
        specs.push(currentSpec);
        currentSpec = null;
      }
      isReadingHighlights = false;
      perfectFor = perfectMatch[2].trim();
      continue;
    }

    // Check for "Style Tip"
    const styleMatch = line.match(styleTipRegex);
    if (styleMatch) {
      if (currentSpec) {
        specs.push(currentSpec);
        currentSpec = null;
      }
      isReadingHighlights = false;
      styleTip = styleMatch[2].trim();
      continue;
    }

    // Check for "Product Highlights" section header
    if (highlightsHeaderRegex.test(line)) {
      if (currentSpec) {
        specs.push(currentSpec);
        currentSpec = null;
      }
      isReadingHighlights = true;
      continue;
    }

    // Check for bullet items
    if (line.startsWith("- ") || line.startsWith("* ") || line.startsWith("• ")) {
      const cleanBullet = line.replace(/^[-*•]\s*/, "").trim();
      if (cleanBullet) {
        highlights.push(cleanBullet);
      }
      continue;
    }

    // Check for Fabric/Color spec key
    const specMatch = line.match(specKeyRegex);
    if (specMatch) {
      if (currentSpec) {
        specs.push(currentSpec);
      }
      isReadingHighlights = false;
      currentSpec = {
        label: specMatch[1].trim(),
        value: specMatch[2].trim(),
      };
      continue;
    }

    // If we have an active spec and get a follow-up descriptive sentence
    if (currentSpec && !currentSpec.details) {
      currentSpec.details = line;
      specs.push(currentSpec);
      currentSpec = null;
      continue;
    }

    // If still in highlights mode and line is short bullet without symbol
    if (isReadingHighlights && line.length < 80) {
      highlights.push(line);
      continue;
    }

    // Otherwise, before any specs/highlights are found, it's intro
    if (specs.length === 0 && highlights.length === 0 && !perfectFor && !styleTip) {
      introLines.push(line);
    } else {
      otherParagraphs.push(line);
    }
  }

  if (currentSpec) {
    specs.push(currentSpec);
  }

  intro = introLines.join(" ").trim();

  return {
    intro,
    specs,
    highlights,
    perfectFor,
    styleTip,
    otherParagraphs,
  };
}

export const ProductDescriptionView: React.FC<ProductDescriptionViewProps> = ({
  description,
  className,
}) => {
  const parsed = useMemo(() => parseProductDescription(description), [description]);

  const hasStructuredContent =
    parsed.specs.length > 0 ||
    parsed.highlights.length > 0 ||
    Boolean(parsed.perfectFor) ||
    Boolean(parsed.styleTip);

  if (!description || !description.trim()) {
    return (
      <p className="body-lux text-[#78716C] italic text-sm">
        Handcrafted artisanal creation from the LaMoksh atelier.
      </p>
    );
  }

  // If completely plain unstructured text without any matching keys or bullets
  if (!hasStructuredContent) {
    return (
      <div className={cn("space-y-3.5 text-sm leading-relaxed text-[#44403C]", className)}>
        {description
          .split(/\n\s*\n/)
          .map((para, i) => (
            <p key={i} className="body-lux text-[#44403C]">
              {para.trim()}
            </p>
          ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-6 text-sm", className)}>
      {/* 1. Introduction / Story Overview */}
      {parsed.intro && (
        <div className="relative pl-3.5 border-l-2 border-[#6B1D2F]/40 py-0.5">
          <p className="font-sans text-sm text-[#44403C] leading-relaxed">
            {parsed.intro}
          </p>
        </div>
      )}

      {/* 2. Key Fabric & Silhouette Specifications Grid */}
      {parsed.specs.length > 0 && (
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B1D2F]">
            <Gem className="h-3 w-3" />
            <span>Fabric & Atelier Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {parsed.specs.map((spec, i) => {
              const isFabric = spec.label.toLowerCase().includes("fabric");
              const isColor = spec.label.toLowerCase().includes("colo");

              return (
                <div
                  key={i}
                  className="rounded-sm border border-[#E7E5E4] bg-[#FAF8F5]/80 p-3 transition-colors hover:border-[#6B1D2F]/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-[#78716C]">
                      {spec.label}
                    </span>
                    {spec.value && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide",
                          isFabric
                            ? "bg-[#6B1D2F]/10 text-[#6B1D2F] font-semibold"
                            : isColor
                              ? "bg-amber-100/70 text-amber-900"
                              : "bg-stone-200/70 text-stone-800"
                        )}
                      >
                        {spec.value}
                      </span>
                    )}
                  </div>
                  {spec.details && (
                    <p className="mt-1.5 text-xs text-[#57534E] leading-relaxed font-sans">
                      {spec.details}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Point-wise Highlights Checklist */}
      {parsed.highlights.length > 0 && (
        <div className="rounded-sm border border-[#E7E5E4] bg-white p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1C1917]">
            <Sparkles className="h-3 w-3 text-[#6B1D2F]" />
            <span>Product Highlights</span>
          </div>

          <ul className="grid grid-cols-1 gap-2 pt-1">
            {parsed.highlights.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-[#28201C] leading-snug">
                <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#6B1D2F]/10 text-[#6B1D2F] mt-0.5">
                  <Check className="h-2.5 w-2.5 stroke-[2.5]" />
                </span>
                <span className="font-sans text-xs sm:text-[13px]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 4. Occasion / Perfect For Banner */}
      {parsed.perfectFor && (
        <div className="flex items-start gap-2.5 rounded-sm border border-emerald-900/15 bg-emerald-50/50 p-3 text-xs">
          <Calendar className="h-4 w-4 shrink-0 text-emerald-800 mt-0.5" />
          <div>
            <span className="font-semibold uppercase tracking-wider text-emerald-900 text-[10px] block">
              Perfect For
            </span>
            <span className="text-emerald-950 font-sans text-xs leading-relaxed">
              {parsed.perfectFor}
            </span>
          </div>
        </div>
      )}

      {/* 5. Styling Suggestion Callout */}
      {parsed.styleTip && (
        <div className="flex items-start gap-2.5 rounded-sm border border-amber-900/15 bg-amber-50/40 p-3 text-xs">
          <Lightbulb className="h-4 w-4 shrink-0 text-amber-800 mt-0.5" />
          <div>
            <span className="font-semibold uppercase tracking-wider text-amber-900 text-[10px] block">
              Atelier Styling Tip
            </span>
            <span className="text-stone-800 font-sans text-xs leading-relaxed italic">
              "{parsed.styleTip}"
            </span>
          </div>
        </div>
      )}

      {/* 6. Remaining Paragraphs (if any) */}
      {parsed.otherParagraphs.length > 0 && (
        <div className="space-y-2 text-xs text-[#57534E] leading-relaxed pt-1">
          {parsed.otherParagraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDescriptionView;
