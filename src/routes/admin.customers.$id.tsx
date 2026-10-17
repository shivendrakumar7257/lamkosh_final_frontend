import React, { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { dbStore, Customer, Order } from "@/lib/db/store";
import { ArrowLeft, User, Mail, Phone, MapPin, ShoppingBag, Clock, DollarSign } from "lucide-react";

export const Route = createFileRoute("/admin/customers/$id")({
  component: AdminCustomerDetailPage,
});

function AdminCustomerDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);

  useEffect(() => {
    const found = dbStore.getCustomerById(id);
    if (found) {
      setCustomer(found);
      const orders = dbStore
        .getOrders()
        .filter((o) => o.customerId === found.id || o.customerEmail === found.email);
      setCustomerOrders(orders);
    }
  }, [id]);

  if (!customer) {
    return (
      <div className="p-12 text-center bg-white border border-[#E7E5E4]">
        <h2 className="text-xl font-serif text-[#1C1917]">Client Not Found</h2>
        <p className="text-xs text-[#78716C] mt-2">No client registered under ID "{id}".</p>
        <button
          onClick={() => navigate({ to: "/admin/customers" as any })}
          className="mt-4 px-4 py-2 bg-[#6B1D2F] text-white text-xs uppercase font-semibold"
        >
          Back to Client Directory
        </button>
      </div>
    );
  }

  const avgOrderVal =
    customerOrders.length > 0
      ? Math.round(
          customerOrders.reduce((sum, o) => sum + o.totalAmount, 0) / customerOrders.length,
        )
      : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center space-x-4 bg-white p-6 border border-[#E7E5E4] shadow-sm">
        <button
          onClick={() => navigate({ to: "/admin/customers" as any })}
          className="p-2 border border-[#E7E5E4] bg-white hover:bg-[#FAF8F5] text-[#1C1917] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-serif font-light text-[#1C1917]">{customer.fullName}</h1>
          <p className="text-xs text-[#78716C] mt-0.5">
            Client ID: {customer.id} • Registered since{" "}
            {new Date(customer.createdAt).toLocaleDateString("en-IN")}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-[#E7E5E4] shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#78716C]">
            Total Lifetime Spending
          </div>
          <div className="text-2xl font-serif text-[#6B1D2F] mt-1">
            ₹{customer.totalSpent.toLocaleString("en-IN")}
          </div>
        </div>

        <div className="bg-white p-6 border border-[#E7E5E4] shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#78716C]">
            Total Orders Placed
          </div>
          <div className="text-2xl font-serif text-[#1C1917] mt-1">
            {customerOrders.length} Order(s)
          </div>
        </div>

        <div className="bg-white p-6 border border-[#E7E5E4] shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#78716C]">
            Average Order Value (AOV)
          </div>
          <div className="text-2xl font-serif text-[#1C1917] mt-1">
            ₹{avgOrderVal.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {/* Contact Profile & Order History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E7E5E4] p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-serif text-[#1C1917] pb-3 border-b border-[#E7E5E4]">
            Contact & Address Details
          </h2>
          <div className="text-xs space-y-3 text-[#57534E]">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-[#6B1D2F]" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-[#6B1D2F]" />
              <span>{customer.phone}</span>
            </div>
            {customer.address && (
              <div className="pt-3 border-t border-[#E7E5E4] space-y-1">
                <div className="font-semibold text-[#1C1917] uppercase tracking-wider mb-1 flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-[#6B1D2F]" />
                  <span>Primary Address</span>
                </div>
                <div>{customer.address.street}</div>
                <div>
                  {customer.address.city}, {customer.address.state} - {customer.address.pincode}
                </div>
                <div>{customer.address.country}</div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-[#E7E5E4] p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-serif text-[#1C1917] pb-3 border-b border-[#E7E5E4]">
            Order History
          </h2>

          <div className="divide-y divide-[#E7E5E4] text-xs">
            {customerOrders.length === 0 ? (
              <p className="py-4 text-[#78716C]">No orders placed yet.</p>
            ) : (
              customerOrders.map((o) => (
                <div key={o.id} className="py-3 flex items-center justify-between">
                  <div>
                    <Link
                      to={`/admin/orders/$id` as any}
                      params={{ id: o.id } as any}
                      className="font-mono font-bold text-[#6B1D2F] hover:underline"
                    >
                      {o.orderNumber}
                    </Link>
                    <div className="text-[11px] text-[#78716C]">
                      {new Date(o.createdAt).toLocaleDateString("en-IN")} • {o.items.length} item(s)
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-[#1C1917]">
                      ₹{o.totalAmount.toLocaleString("en-IN")}
                    </div>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {o.orderStatus}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
