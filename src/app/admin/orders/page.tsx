"use client";

import { useState, useEffect } from "react";
import { adminService, Order } from "../lib/adminService";

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: "#FEF3C7", text: "#D97706" },
  confirmed: { bg: "#DBEAFE", text: "#2563EB" },
  preparing: { bg: "#E0E7FF", text: "#4F46E5" },
  ready: { bg: "#D1FAE5", text: "#059669" },
  completed: { bg: "#D1FAE5", text: "#059669" },
  cancelled: { bg: "#FEE2E2", text: "#DC2626" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");

  useEffect(() => {
    async function loadData() {
      const data = await adminService.getOrders();
      setOrders(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredOrders = orders
    .filter(o => filterStatus === "all" || o.status === filterStatus)
    .filter(o => filterMethod === "all" || o.method === filterMethod);

  const handleUpdateStatus = async (orderId: string, newStatus: Order["status"]) => {
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    localStorage.setItem("admin_orders", JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-[#E8E4DD] rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Commandes</h1>
          <p className="text-[#6B6B6B]">{filteredOrders.length} commandes</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E4DD] overflow-hidden">
        <div className="p-4 border-b border-[#E8E4DD] flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-[#E8E4DD] rounded-xl text-[#1A1A1A]"
          >
            <option value="all">Tous statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="preparing">En préparation</option>
            <option value="ready">Prête</option>
            <option value="completed">Terminée</option>
            <option value="cancelled">Annulée</option>
          </select>
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="px-4 py-2.5 border border-[#E8E4DD] rounded-xl text-[#1A1A1A]"
          >
            <option value="all">Tous modes</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="pickup">Cueillette</option>
            <option value="delivery">Livraison</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F2ED]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#1A1A1A]">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#1A1A1A]">Client</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#1A1A1A]">Mode</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#1A1A1A]">Articles</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#1A1A1A]">Total</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#1A1A1A]">Statut</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#1A1A1A]">Date</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-[#1A1A1A]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4DD]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[#6B6B6B]">
                    Aucune commande trouvée
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F5F2ED]">
                    <td className="px-4 py-3 font-medium text-[#1A1A1A]">{order.id}</td>
                    <td className="px-4 py-3">
                      <p className="text-[#1A1A1A]">{order.customer_name}</p>
                      <p className="text-xs text-[#6B6B6B]">{order.customer_phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#6B6B6B] capitalize">{order.method}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#6B6B6B]">{order.items.length} article(s)</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#1A1A1A]">
                      {order.total.toFixed(2)} $
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value as Order["status"])}
                        className="px-2 py-1 text-xs rounded-full border-0 cursor-pointer"
                        style={{ backgroundColor: statusColors[order.status]?.bg, color: statusColors[order.status]?.text }}
                      >
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmée</option>
                        <option value="preparing">En préparation</option>
                        <option value="ready">Prête</option>
                        <option value="completed">Terminée</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#6B6B6B]">
                      {new Date(order.created_at).toLocaleDateString("fr-CA")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-2 text-[#2D5A3D] hover:bg-[#2D5A3D]/10 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
