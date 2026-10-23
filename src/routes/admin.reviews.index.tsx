import { createFileRoute } from "@tanstack/react-router";
import { AdminReviewTable } from "@/components/reviews/AdminReviewTable";

export const Route = createFileRoute("/admin/reviews/")({
  head: () => ({
    meta: [
      { title: "Review Moderation — LaMoksh Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminReviewsPage,
});

function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 border border-[#E7E5E4] shadow-xs">
        <div>
          <h1 className="text-2xl font-serif font-light text-[#1C1917]">
            Product Reviews Moderation
          </h1>
          <p className="text-xs text-[#78716C] mt-1 font-sans">
            Review, approve, and moderate verified client feedback to display on storefront product pages.
          </p>
        </div>
      </div>

      {/* Production Admin Review Table Component */}
      <AdminReviewTable />
    </div>
  );
}
