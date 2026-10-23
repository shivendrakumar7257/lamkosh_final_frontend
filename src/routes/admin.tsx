import { useState, useEffect } from "react";
import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tags,
  ShoppingBag,
  Users,
  Warehouse,
  Ticket,
  MessageSquare,
  FileText,
  BookOpen,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Bell,
  Search,
} from "lucide-react";
import { isAuthenticatedAdmin, getAdminSession, logoutAdmin } from "@/lib/admin-auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminLayoutComponent,
});

function AdminLayoutComponent() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const session = getAdminSession();
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const isLoginPage = normalizedPath === "/admin/login";

  // Route protection guard
  useEffect(() => {
    const isAuthed = isAuthenticatedAdmin();
    if (!isLoginPage && !isAuthed) {
      navigate({ to: "/admin/login", replace: true });
    } else if (isLoginPage && isAuthed) {
      navigate({ to: "/admin", replace: true });
    }
  }, [isLoginPage, navigate]);

  // If on login page, render outlet without admin shell layout
  if (isLoginPage) {
    return <Outlet />;
  }

  if (!isAuthenticatedAdmin()) {
    return null;
  }

  const handleLogout = () => {
    logoutAdmin();
    navigate({ to: "/admin/login", replace: true });
  };

  const navItems = [
    { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
    { label: "Products", to: "/admin/products", icon: Package },
    { label: "Categories", to: "/admin/categories", icon: Tags },
    { label: "Orders", to: "/admin/orders", icon: ShoppingBag },
    { label: "Customers", to: "/admin/customers", icon: Users },
    { label: "Inventory", to: "/admin/inventory", icon: Warehouse },
    { label: "Coupons", to: "/admin/coupons", icon: Ticket },
    { label: "Reviews", to: "/admin/reviews", icon: MessageSquare },
    { label: "Content", to: "/admin/content", icon: FileText },
    { label: "Journal & Blogs", to: "/admin/blogs", icon: BookOpen },
    { label: "Settings", to: "/admin/settings", icon: Settings },
  ];

  const getBreadcrumb = () => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length <= 1) return [{ label: "Dashboard", to: "/admin" }];
    const sub = parts[1];
    const subCap = sub.charAt(0).toUpperCase() + sub.slice(1);
    return [
      { label: "Dashboard", to: "/admin" },
      { label: subCap, to: `/admin/${sub}` },
    ];
  };

  const breadcrumbs = getBreadcrumb();

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "fixed bottom-0 top-0 z-50 flex w-72 flex-col border-r border-[#E7E5E4] bg-white transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-[#E7E5E4] px-6">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center bg-[#6B1D2F] font-serif text-lg font-bold text-white shadow-sm">
              L
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-wider text-[#6B1D2F]">
                LAMOKSH
              </span>
              <span className="block font-sans text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#57534E]">
                LAMOKSH ADMIN
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="text-[#57534E] hover:text-[#1C1917] lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6 no-scrollbar">
          <p className="px-3 pb-3 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#57534E]">
            MANAGEMENT MODULES
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.to === "/admin" ? pathname === "/admin" : pathname.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-none px-3.5 py-2.5 font-sans text-xs font-medium uppercase tracking-wider transition-all duration-200",
                    isActive
                      ? "bg-[#6B1D2F] text-white shadow-sm"
                      : "text-[#57534E] hover:bg-[#FAF8F5] hover:text-[#6B1D2F]",
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-[#57534E]")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#E7E5E4] p-4 bg-[#FAF8F5]/60 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between border border-[#E7E5E4] bg-white px-3.5 py-2.5 font-sans text-xs font-medium text-[#1C1917] transition-colors hover:bg-[#6B1D2F] hover:text-white"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5" />
              Live Storefront
            </span>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          </a>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider text-red-700 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout Administrator</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex flex-1 flex-col lg:pl-72">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#E7E5E4] bg-white/95 px-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-[#1C1917] hover:bg-[#FAF8F5] lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Breadcrumbs */}
            <div className="hidden sm:block">
              <nav className="flex items-center gap-2 font-sans text-xs text-[#57534E]">
                {breadcrumbs.map((b, idx) => (
                  <span key={b.to} className="flex items-center gap-2">
                    {idx > 0 && <ChevronRight className="h-3 w-3 opacity-40" />}
                    <Link
                      to={b.to}
                      className={cn(
                        "hover:text-[#6B1D2F]",
                        idx === breadcrumbs.length - 1 && "font-semibold text-[#1C1917]",
                      )}
                    >
                      {b.label}
                    </Link>
                  </span>
                ))}
              </nav>
            </div>
          </div>

          {/* Right Action Icons & User Info */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 border border-[#E7E5E4] bg-[#FAF8F5] px-3 py-1.5 text-xs text-[#57534E]">
              <ShieldCheck className="h-4 w-4 text-[#6B1D2F]" />
              <span className="font-semibold text-[#1C1917]">Role:</span> Super Admin
            </div>

            <div className="h-8 w-px bg-[#E7E5E4] hidden sm:block" />

            {/* Admin Profile */}
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-[#6B1D2F] font-serif text-sm font-semibold text-white">
                {session?.fullName?.charAt(0) || "A"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="font-sans text-xs font-semibold text-[#1C1917]">
                  {session?.fullName || "Senior Admin"}
                </p>
                <p className="font-sans text-[0.65rem] text-[#57534E]">
                  {session?.email || "admin@lamoksh.in"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Route Viewport */}
        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
