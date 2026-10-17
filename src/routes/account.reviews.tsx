import { createFileRoute, Link } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/RouteGuards";
import { Reveal } from "@/components/site/Reveal";
import { CustomerReviewsTab } from "@/components/reviews/CustomerReviewsTab";

export const Route = createFileRoute("/account/reviews")({
  head: () => ({
    meta: [
      { title: "My Reviews & Ratings — LaMoksh Fabrics" },
      {
        name: "description",
        content: "Track moderation status and feedback on your submitted product reviews.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AccountReviewsPageWrapper,
});

function AccountReviewsPageWrapper() {
  return (
    <ProtectedRoute>
      <AccountReviewsPage />
    </ProtectedRoute>
  );
}

function AccountReviewsPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container-lux py-12 md:py-16">
        <Reveal>
          {/* Top Title & Navigation Tabs */}
          <div className="border-b border-border/80 pb-6">
            <h1 className="font-serif text-3xl font-light text-foreground sm:text-4xl">
              Client Atelier Account
            </h1>
            <p className="mt-2 text-xs text-muted-foreground">
              Manage your personal atelier wardrobe, ongoing deliveries, and reviews.
            </p>

            {/* Account Navigation Tabs */}
            <div className="mt-8 flex flex-wrap gap-8 border-b border-border/60 text-xs">
              <Link
                to="/account/profile"
                className="border-b-2 border-transparent pb-3 font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                Personal Profile
              </Link>
              <Link
                to="/account/orders"
                className="border-b-2 border-transparent pb-3 font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                My Orders
              </Link>
              <Link
                to="/account/reviews"
                className="border-b-2 border-espresso pb-3 font-semibold uppercase tracking-wider text-foreground"
              >
                My Reviews
              </Link>
              <Link
                to="/account/security"
                className="border-b-2 border-transparent pb-3 font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                Security & Password
              </Link>
              <Link
                to="/wishlist"
                className="border-b-2 border-transparent pb-3 font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                Saved Wishlist
              </Link>
            </div>
          </div>

          {/* Customer Reviews Tab Component */}
          <div className="mt-8">
            <CustomerReviewsTab />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
