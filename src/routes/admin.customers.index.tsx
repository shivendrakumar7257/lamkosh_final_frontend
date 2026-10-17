import React, { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { dbStore, Customer } from "@/lib/db/store";
import { Search, Users, Eye, Mail, Phone, ShoppingBag, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/admin/customers/")({
  component: AdminCustomersPage,
});

function AdminCustomersPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const loadCustomers = () => {
    setCustomers(dbStore.getCustomers());
  };

  useEffect(() => {
    loadCustomers();
    const handleDbUpdate = () => loadCustomers();
    window.addEventListener("manmayi_db_updated", handleDbUpdate);
    return () => window.removeEventListener("manmayi_db_updated", handleDbUpdate);
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery),
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 border border-[#E7E5E4] shadow-sm">
        <div>
          <h1 className="text-2xl font-serif font-light text-[#1C1917]">Client Profiles & CRM</h1>
          <p className="text-xs text-[#78716C] mt-1 font-sans">
            Client directory, order histories, and lifetime value analytics.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-[#78716C]">
          <span className="font-semibold text-[#1C1917]">{customers.length}</span> Registered
          Clients
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-6 border border-[#E7E5E4] shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
          <input
            type="text"
            placeholder="Search by client name, email address, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-[#E7E5E4] bg-[#FAF8F5] text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-[#E7E5E4] shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF8F5] border-b border-[#E7E5E4] text-[11px] uppercase tracking-wider font-semibold text-[#78716C]">
              <th className="p-4">Client Name & Contact</th>
              <th className="p-4">Location</th>
              <th className="p-4">Total Orders</th>
              <th className="p-4">Lifetime Value</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E5E4] text-xs text-[#1C1917]">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#78716C]">
                  No clients found.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                  <td className="p-4">
                    <Link
                      to={`/admin/customers/$id` as any}
                      params={{ id: cust.id } as any}
                      className="font-medium text-[#1C1917] hover:text-[#6B1D2F]"
                    >
                      {cust.fullName}
                    </Link>
                    <div className="text-[11px] text-[#78716C] flex items-center space-x-2 mt-0.5">
                      <span>{cust.email}</span>
                      <span>•</span>
                      <span>{cust.phone}</span>
                    </div>
                  </td>

                  <td className="p-4 text-[#57534E]">
                    {cust.address ? `${cust.address.city}, ${cust.address.state}` : "India"}
                  </td>

                  <td className="p-4 font-semibold text-[#1C1917]">{cust.totalOrders} order(s)</td>

                  <td className="p-4 font-serif font-medium text-[#6B1D2F] text-sm">
                    ₹{cust.totalSpent.toLocaleString("en-IN")}
                  </td>

                  <td className="p-4">
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {cust.status}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => navigate({ to: `/admin/customers/${cust.id}` as any })}
                      className="px-3 py-1.5 bg-[#FAF8F5] border border-[#E7E5E4] text-[#1C1917] hover:bg-[#6B1D2F] hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
