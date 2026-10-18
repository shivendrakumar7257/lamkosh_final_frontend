import React, { useMemo } from "react";
import { Check, Sparkles, Gem, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogContentRendererProps {
  content: string;
  className?: string;
  onImageClick?: (url: string, alt?: string) => void;
}

interface ContentBlock {
  type:
    | "h1"
    | "h2"
    | "h3"
    | "bullet-list"
    | "numbered-list"
    | "point-card"
    | "quote-banner"
    | "paragraph"
    | "html";
  raw: string;
  sectionNumber?: string;
  title?: string;
  items?: Array<{ key?: string; text: string }>;
  key?: string;
  text?: string;
}

/**
 * Parses inline markdown: **bold**, *italic*, [link](url)
 */
function renderInlineMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  // Split by markdown link [title](url) or bold **text** or *italic*
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  // Regex to match **bold**, *italic*, or [link](url)
  const regex = /(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/;

  while (remaining.length > 0) {
    const match = remaining.match(regex);
    if (!match || match.index === undefined) {
      parts.push(remaining);
      break;
    }

    // Push text before match
    if (match.index > 0) {
      parts.push(remaining.slice(0, match.index));
    }

    const matchedStr = match[0];

    if (matchedStr.startsWith("**") && matchedStr.endsWith("**")) {
      const boldText = matchedStr.slice(2, -2);
      parts.push(
        <strong key={`b-${keyIdx++}`} className="font-semibold text-[#1C1917]">
          {boldText}
        </strong>,
      );
    } else if (matchedStr.startsWith("*") && matchedStr.endsWith("*")) {
      const italicText = matchedStr.slice(1, -1);
      parts.push(
        <em key={`i-${keyIdx++}`} className="italic font-serif text-[#44403C]">
          {italicText}
        </em>,
      );
    } else if (matchedStr.startsWith("[") && matchedStr.includes("](")) {
      const linkMatch = matchedStr.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        parts.push(
          <a
            key={`a-${keyIdx++}`}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6B1D2F] font-medium underline underline-offset-2 hover:text-[#4A1420] transition-colors"
          >
            {linkMatch[1]}
          </a>,
        );
      } else {
        parts.push(matchedStr);
      }
    } else {
      parts.push(matchedStr);
    }

    remaining = remaining.slice(match.index + matchedStr.length);
  }

  return parts;
}

/**
 * Robust parser converting raw markdown or HTML into structured, point-wise blocks
 */
function parseContentToBlocks(content: string): ContentBlock[] {
  if (!content) return [];

  // Check if content is predominantly raw HTML
  const hasHtmlTags = /<[a-z][\s\S]*>/i.test(content) && !content.includes("## ");
  if (hasHtmlTags) {
    return [{ type: "html", raw: content }];
  }

  // Normalize newlines
  const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const paragraphs = normalized.split(/\n\s*\n/);
  const blocks: ContentBlock[] = [];

  for (let rawParagraph of paragraphs) {
    const trimmed = rawParagraph.trim();
    if (!trimmed) continue;

    // 1. Heading 1: `# Title`
    if (trimmed.startsWith("# ")) {
      blocks.push({
        type: "h1",
        raw: trimmed,
        title: trimmed.replace(/^#\s+/, "").trim(),
      });
      continue;
    }

    // 2. Heading 2: `## Title` or `## 1. Title`
    if (trimmed.startsWith("## ")) {
      const rawTitle = trimmed.replace(/^##\s+/, "").trim();
      // Check for section number e.g. "1. Why..." or "01."
      const numMatch = rawTitle.match(/^(\d+[\.\)]?)\s+(.*)/);
      if (numMatch) {
        blocks.push({
          type: "h2",
          raw: trimmed,
          sectionNumber: numMatch[1].replace(/[\.\)]/, ""),
          title: numMatch[2],
        });
      } else {
        blocks.push({
          type: "h2",
          raw: trimmed,
          title: rawTitle,
        });
      }
      continue;
    }

    // 3. Heading 3: `### Title`
    if (trimmed.startsWith("### ")) {
      blocks.push({
        type: "h3",
        raw: trimmed,
        title: trimmed.replace(/^###\s+/, "").trim(),
      });
      continue;
    }

    // 4. Brand quote banner / slogan e.g. "**LaMoksh Fabric — ...**"
    if (
      trimmed.startsWith("**") &&
      trimmed.endsWith("**") &&
      (trimmed.includes("LaMoksh") || trimmed.includes("Atelier") || trimmed.includes("—"))
    ) {
      blocks.push({
        type: "quote-banner",
        raw: trimmed,
        text: trimmed.slice(2, -2).trim(),
      });
      continue;
    }

    // 5. Unordered List `- ` or `* `
    const lines = trimmed.split("\n");
    const isBulletList = lines.every((line) => line.trim().startsWith("- ") || line.trim().startsWith("* "));
    if (isBulletList) {
      const items = lines.map((line) => {
        const itemText = line.trim().replace(/^[-*]\s+/, "");
        // Check for `- **Key:** Description`
        const keyMatch = itemText.match(/^\*\*(.*?)\*\*[:\-]?\s*(.*)/);
        if (keyMatch) {
          return {
            key: keyMatch[1].trim(),
            text: keyMatch[2].trim(),
          };
        }
        return { text: itemText };
      });
      blocks.push({
        type: "bullet-list",
        raw: trimmed,
        items,
      });
      continue;
    }

    // 6. Point-wise bold paragraph items: e.g.
    // `**Footwear:** Description...`
    // Or multiple lines where each starts with `**Key:**`
    const isMultiPointBlock = lines.every((l) => /^\*\*(.*?)\*\*[:\-]\s*(.*)/.test(l.trim()));
    if (isMultiPointBlock && lines.length > 0) {
      const items = lines.map((line) => {
        const m = line.trim().match(/^\*\*(.*?)\*\*[:\-]\s*(.*)/);
        return {
          key: m ? m[1].trim() : "",
          text: m ? m[2].trim() : line.trim(),
        };
      });
      blocks.push({
        type: "bullet-list",
        raw: trimmed,
        items,
      });
      continue;
    }

    // Single point-card paragraph e.g. `**Footwear:** Description`
    const singlePointMatch = trimmed.match(/^\*\*(.*?)\*\*[:\-]\s*([\s\S]+)/);
    if (singlePointMatch && !singlePointMatch[2].includes("\n\n")) {
      blocks.push({
        type: "point-card",
        raw: trimmed,
        key: singlePointMatch[1].trim(),
        text: singlePointMatch[2].trim(),
      });
      continue;
    }

    // 7. Regular paragraph
    blocks.push({
      type: "paragraph",
      raw: trimmed,
      text: trimmed,
    });
  }

  return blocks;
}

export function BlogContentRenderer({
  content,
  className,
}: BlogContentRendererProps) {
  const blocks = useMemo(() => parseContentToBlocks(content), [content]);

  return (
    <div className={cn("space-y-6 text-[#292524]", className)}>
      {blocks.map((block, index) => {
        switch (block.type) {
          // HTML fallback
          case "html":
            return (
              <div
                key={index}
                className="prose prose-stone max-w-none leading-relaxed text-[#292524] prose-headings:font-serif prose-headings:font-normal prose-headings:text-[#1C1917] prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-p:my-4 prose-p:text-base prose-p:leading-8 prose-a:text-[#6B1D2F] prose-a:underline hover:prose-a:text-[#4A1420]"
                dangerouslySetInnerHTML={{ __html: block.raw }}
              />
            );

          // H1 Title
          case "h1":
            return (
              <h1
                key={index}
                className="font-serif text-3xl md:text-4xl font-normal leading-tight text-[#1C1917] mt-8 mb-4 border-b border-[#28201C]/15 pb-4"
              >
                {renderInlineMarkdown(block.title || "")}
              </h1>
            );

          // H2 Section with Modern Numbered Pill & Gold Accent
          case "h2":
            return (
              <div key={index} className="pt-8 pb-2 mt-8 border-t border-[#28201C]/10 first:border-t-0 first:pt-0">
                <div className="flex items-center gap-3 mb-2">
                  {block.sectionNumber ? (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xs bg-[#6B1D2F] font-serif text-xs font-semibold text-white shadow-xs">
                      {block.sectionNumber.padStart(2, "0")}
                    </span>
                  ) : (
                    <span className="flex h-2 w-2 rounded-full bg-[#6B1D2F]" />
                  )}
                  <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#6B1D2F]">
                    Atelier Guide Section
                  </span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-normal leading-snug text-[#1C1917]">
                  {renderInlineMarkdown(block.title || "")}
                </h2>
                <div className="mt-3 h-0.5 w-16 bg-gradient-to-r from-[#6B1D2F] to-[#6B1D2F]/20 rounded-full" />
              </div>
            );

          // H3 Subheading
          case "h3":
            return (
              <div key={index} className="flex items-center gap-2.5 mt-7 mb-2">
                <Gem className="h-4 w-4 text-[#6B1D2F] shrink-0 stroke-[1.6]" />
                <h3 className="font-serif text-lg md:text-xl font-normal text-[#1C1917]">
                  {renderInlineMarkdown(block.title || "")}
                </h3>
              </div>
            );

          // Modern Point-wise Bullet Cards
          case "bullet-list":
            return (
              <div key={index} className="my-5 grid grid-cols-1 gap-3">
                {block.items?.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="group relative flex items-start gap-3.5 rounded-xs border border-[#28201C]/10 bg-white p-4 shadow-xs transition-all duration-200 hover:border-[#6B1D2F]/40 hover:shadow-sm"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FAF7F2] border border-[#6B1D2F]/30 text-[#6B1D2F] group-hover:bg-[#6B1D2F] group-hover:text-white transition-colors">
                      <Check className="h-3 w-3 stroke-[2.5]" />
                    </div>
                    <div className="flex-1 text-sm md:text-[15px] leading-relaxed text-[#44403C]">
                      {item.key && (
                        <span className="block font-serif text-[15px] font-semibold text-[#1C1917] mb-1">
                          {renderInlineMarkdown(item.key)}
                        </span>
                      )}
                      <div>{renderInlineMarkdown(item.text)}</div>
                    </div>
                  </div>
                ))}
              </div>
            );

          // Modern Point-Card (for single items like **Footwear:** Description)
          case "point-card":
            return (
              <div
                key={index}
                className="my-3.5 rounded-r-xs border-l-3 border-[#6B1D2F] bg-[#FAF8F5] p-4.5 shadow-xs transition-all hover:bg-[#F5F1EB]"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-[#6B1D2F]" />
                  <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#6B1D2F]">
                    {renderInlineMarkdown(block.key || "")}
                  </span>
                </div>
                <div className="mt-1.5 text-sm md:text-base leading-relaxed text-[#44403C]">
                  {renderInlineMarkdown(block.text || "")}
                </div>
              </div>
            );

          // Luxury Brand Quote / Slogan Banner
          case "quote-banner":
            return (
              <div
                key={index}
                className="relative my-8 overflow-hidden rounded-xs border border-[#6B1D2F]/25 bg-[#FAF7F2] p-6 md:p-8 text-center shadow-xs"
              >
                <Quote className="mx-auto h-7 w-7 text-[#6B1D2F]/40 stroke-[1.2] mb-2" />
                <p className="font-serif text-lg md:text-xl font-medium text-[#1C1917] italic leading-relaxed">
                  {renderInlineMarkdown(block.text || "")}
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="h-px w-10 bg-[#6B1D2F]/30" />
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.25em] text-[#6B1D2F]">
                    LaMoksh Atelier Guarantee
                  </span>
                  <span className="h-px w-10 bg-[#6B1D2F]/30" />
                </div>
              </div>
            );

          // Standard Paragraph
          case "paragraph":
          default:
            return (
              <p
                key={index}
                className="font-sans text-base md:text-[16.5px] leading-relaxed text-[#44403C] tracking-[0.01em] my-3.5"
              >
                {renderInlineMarkdown(block.text || "")}
              </p>
            );
        }
      })}
    </div>
  );
}
