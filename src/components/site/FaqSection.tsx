import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Search,
  X,
  ChevronDown,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { FAQS, FAQ_CATEGORIES, FAQCategory, FAQItem } from "@/data/faqs";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

interface FaqSectionProps {
  showTitle?: boolean;
  showSupportCards?: boolean;
  className?: string;
  limit?: number;
}

export function FaqSection({
  showTitle = true,
  showSupportCards = true,
  className,
  limit,
}: FaqSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>("All Questions");
  // Default first FAQ open
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([1]));

  // Toggle single item
  const toggleItem = (id: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Expand all / collapse all
  const expandAll = (itemsToExpand: FAQItem[]) => {
    setOpenItems(new Set(itemsToExpand.map((item) => item.id)));
  };

  const collapseAll = () => {
    setOpenItems(new Set());
  };

  // Filter items
  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FAQS.filter((item) => {
      const matchesCategory =
        selectedCategory === "All Questions" || item.category === selectedCategory;
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    }).slice(0, limit ?? FAQS.length);
  }, [searchQuery, selectedCategory, limit]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      "All Questions": FAQS.length,
    };
    FAQ_CATEGORIES.forEach((cat) => {
      if (cat !== "All Questions") {
        counts[cat] = FAQS.filter((f) => f.category === cat).length;
      }
    });
    return counts;
  }, []);

  const allFilteredOpen =
    filteredFaqs.length > 0 && filteredFaqs.every((f) => openItems.has(f.id));

  return (
    <section className={cn("py-12 md:py-20", className)}>
      <div className="container-lux max-w-5xl">
        {showTitle && (
          <Reveal className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.2em] uppercase bg-[#6B1D2F]/10 text-[#6B1D2F]">
              <Sparkles className="w-3.5 h-3.5" />
              Help &amp; LaMoksh Support
            </span>
            <h2 className="display-lg mt-4 text-[#1C1917]">Frequently Asked Questions</h2>
            <p className="body-lux mt-3 max-w-2xl mx-auto text-[#57534E]">
              Have questions about our handcrafted ethnic wear, customisations, sizing, or delivery?
              Find everything you need right here.
            </p>
          </Reveal>
        )}

        {/* Search & Filter Toolbar */}
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-[#57534E]/60 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions by keywords (e.g. saree, customisation, sizing, delivery)..."
                className="w-full pl-12 pr-11 py-3.5 text-sm sm:text-base bg-white border border-[#E7E5E4] rounded-sm text-[#1C1917] placeholder:text-[#57534E]/50 shadow-sm outline-none transition-all focus:border-[#6B1D2F] focus:ring-1 focus:ring-[#6B1D2F]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 p-1 rounded hover:bg-[#FAF8F5] text-[#57534E] transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills & Toggle All */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              {FAQ_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm text-xs font-medium uppercase tracking-wider transition-all",
                      isActive
                        ? "bg-[#6B1D2F] text-white shadow-sm"
                        : "bg-white border border-[#E7E5E4] text-[#57534E] hover:border-[#6B1D2F]/50 hover:text-[#1C1917]",
                    )}
                  >
                    <span>{cat}</span>
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.2 rounded-full",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[#FAF8F5] text-[#78716C] border border-[#E7E5E4]",
                      )}
                    >
                      {categoryCounts[cat] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>

            {filteredFaqs.length > 0 && (
              <button
                type="button"
                onClick={() => (allFilteredOpen ? collapseAll() : expandAll(filteredFaqs))}
                className="text-xs font-semibold uppercase tracking-wider text-[#6B1D2F] hover:text-[#4A101E] transition-colors py-1 px-2"
              >
                {allFilteredOpen ? "Collapse All" : "Expand All"}
              </button>
            )}
          </div>
        </div>

        {/* Results Counter if Filtered */}
        {(searchQuery.trim() || selectedCategory !== "All Questions") && (
          <div className="mt-4 flex items-center justify-between text-xs text-[#78716C]">
            <span>
              Showing {filteredFaqs.length} of {FAQS.length} questions
              {searchQuery ? ` matching "${searchQuery}"` : ""}
            </span>
            {(searchQuery || selectedCategory !== "All Questions") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All Questions");
                }}
                className="hover:underline text-[#6B1D2F]"
              >
                Reset filters
              </button>
            )}
          </div>
        )}

        {/* Accordion FAQ List */}
        <div className="mt-8 space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16 px-4 border border-[#E7E5E4] bg-white rounded-sm">
              <HelpCircle className="h-10 w-10 text-[#57534E]/40 mx-auto mb-3" />
              <h3 className="font-display text-xl text-[#1C1917]">No questions found</h3>
              <p className="body-lux text-sm text-[#78716C] mt-2 max-w-md mx-auto">
                We couldn&apos;t find any FAQs matching your search query. Please try different
                keywords or contact our client support team directly.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Questions");
                  }}
                  className="px-5 py-2 text-xs uppercase tracking-wider font-semibold border border-[#E7E5E4] hover:bg-[#FAF8F5] transition-colors"
                >
                  Clear search
                </button>
                <Link
                  to="/contact"
                  className="px-5 py-2 text-xs uppercase tracking-wider font-semibold bg-[#6B1D2F] text-white hover:bg-[#4A101E] transition-colors"
                >
                  Ask LaMoksh Support
                </Link>
              </div>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openItems.has(faq.id);
              const formattedNumber = String(faq.id).padStart(2, "0");

              return (
                <div
                  key={faq.id}
                  className={cn(
                    "group border transition-all duration-200 rounded-sm bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
                    isOpen
                      ? "border-[#6B1D2F]/30 bg-[#FAF9F6]/50 shadow-sm"
                      : "border-[#E7E5E4] hover:border-[#6B1D2F]/30",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-4">
                      {/* Number Badge */}
                      <span
                        className={cn(
                          "shrink-0 font-mono text-xs font-semibold px-2.5 py-1 rounded-xs transition-colors",
                          isOpen
                            ? "bg-[#6B1D2F] text-white"
                            : "bg-[#FAF8F5] text-[#6B1D2F] border border-[#E7E5E4] group-hover:border-[#6B1D2F]/30",
                        )}
                      >
                        {formattedNumber}
                      </span>

                      <div>
                        {/* Category Badge */}
                        <div className="mb-1.5 flex items-center gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#78716C]">
                            {faq.badge}
                          </span>
                        </div>

                        {/* Question Text */}
                        <h3
                          className={cn(
                            "font-display text-lg sm:text-xl font-normal leading-snug transition-colors",
                            isOpen
                              ? "text-[#6B1D2F]"
                              : "text-[#1C1917] group-hover:text-[#6B1D2F]",
                          )}
                        >
                          {faq.question}
                        </h3>
                      </div>
                    </div>

                    {/* Rotating Indicator */}
                    <div
                      className={cn(
                        "shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300",
                        isOpen
                          ? "bg-[#6B1D2F] text-white rotate-180"
                          : "bg-[#FAF8F5] text-[#57534E] border border-[#E7E5E4] group-hover:border-[#6B1D2F]/40",
                      )}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </button>

                  {/* Collapsible Answer Body */}
                  {isOpen && (
                    <div className="px-5 pb-6 pt-0 sm:px-6 sm:pb-6 border-t border-[#E7E5E4]/60 mt-1">
                      <div className="pt-4 pl-0 sm:pl-11">
                        <p className="body-lux text-sm sm:text-base leading-relaxed text-[#57534E]">
                          {faq.answer}
                        </p>

                        {/* Action Link if Available */}
                        {faq.action && (
                          <div className="mt-4 pt-3 flex items-center">
                            <Link
                              to={faq.action.to}
                              className="group/link inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#6B1D2F] hover:text-[#4A101E] transition-colors"
                            >
                              <span>{faq.action.label}</span>
                              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Support Concierge Section */}
        {showSupportCards && (
          <div className="mt-16 pt-12 border-t border-[#E7E5E4]">
            <div className="text-center max-w-xl mx-auto mb-8">
              <p className="eyebrow text-[#6B1D2F]">Still have a question?</p>
              <h3 className="font-display text-2xl sm:text-3xl text-[#1C1917] mt-2">
                We are here to assist you personally
              </h3>
              <p className="body-lux text-sm text-[#57534E] mt-2">
                Our client care team replies to inquiries with bespoke attention. Reach us by
                phone, message, or visit our Indirapuram store.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {/* Card 1: Phone Support */}
              <div className="border border-[#E7E5E4] bg-white p-6 rounded-sm text-center flex flex-col items-center justify-between hover:border-[#6B1D2F]/40 transition-colors shadow-sm">
                <div>
                  <div className="h-11 w-11 rounded-full bg-[#6B1D2F]/10 text-[#6B1D2F] flex items-center justify-center mb-4 mx-auto">
                    <Phone className="h-5 w-5" />
                  </div>
                  <h4 className="font-sans font-semibold text-sm uppercase tracking-wider text-[#1C1917]">
                    Call LaMoksh
                  </h4>
                  <p className="text-xs text-[#78716C] mt-1.5 leading-relaxed">
                    Direct helpline for orders, sizing and delivery queries.
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6B1D2F]">
                  <a
                    href="tel:+919999875605"
                    className="hover:text-[#4A101E]"
                  >
                    +91 99998 75605
                  </a>
                  <span>/</span>
                  <a
                    href="tel:+918882510158"
                    className="hover:text-[#4A101E]"
                  >
                    +91 88825 10158
                  </a>
                </div>
              </div>

              {/* Card 2: Contact Form */}
              <div className="border border-[#E7E5E4] bg-white p-6 rounded-sm text-center flex flex-col items-center justify-between hover:border-[#6B1D2F]/40 transition-colors shadow-sm">
                <div>
                  <div className="h-11 w-11 rounded-full bg-[#6B1D2F]/10 text-[#6B1D2F] flex items-center justify-center mb-4 mx-auto">
                    <Mail className="h-5 w-5" />
                  </div>
                  <h4 className="font-sans font-semibold text-sm uppercase tracking-wider text-[#1C1917]">
                    Online Enquiry
                  </h4>
                  <p className="text-xs text-[#78716C] mt-1.5 leading-relaxed">
                    Write to our team for customisations or bespoke fittings.
                  </p>
                </div>
                <Link
                  to="/contact"
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6B1D2F] hover:text-[#4A101E]"
                >
                  <span>Open Contact Form</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Card 3: Store Location */}
              <div className="border border-[#E7E5E4] bg-white p-6 rounded-sm text-center flex flex-col items-center justify-between hover:border-[#6B1D2F]/40 transition-colors shadow-sm">
                <div>
                  <div className="h-11 w-11 rounded-full bg-[#6B1D2F]/10 text-[#6B1D2F] flex items-center justify-center mb-4 mx-auto">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <h4 className="font-sans font-semibold text-sm uppercase tracking-wider text-[#1C1917]">
                    Visit LaMoksh
                  </h4>
                  <p className="text-xs text-[#78716C] mt-1.5 leading-relaxed">
                    LG 3, LG 4 &amp; LG 8, HRC Shopping Complex, Vaibhav Khand, Indirapuram, Ghaziabad.
                  </p>
                </div>
                <Link
                  to="/contact"
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6B1D2F] hover:text-[#4A101E]"
                >
                  <span>LaMoksh Details</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
