import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { requireAuth } from "@/lib/auth";
import { fetchMyOrders } from "@/lib/api";

const PLACEHOLDER_ORDERS = [
  {
    id: "TXN-0091",
    event: "Coldplay Music of the Spheres World Tour",
    date: "2025-05-15",
    time: "19:00",
    location: "Gelora Bung Karno, Jakarta",
    ticket: "Category 2",
    qty: 2,
    amount: 1700000,
    status: "paid",
    orderedAt: "2025-04-10",
  },
  {
    id: "TXN-0078",
    event: "Java Jazz Festival 2025",
    date: "2025-06-01",
    time: "10:00",
    location: "JIExpo Kemayoran, Jakarta",
    ticket: "General Admission",
    qty: 1,
    amount: 500000,
    status: "paid",
    orderedAt: "2025-04-05",
  },
  {
    id: "TXN-0055",
    event: "Bali Arts Festival",
    date: "2025-06-14",
    time: "09:00",
    location: "Ardha Candra, Bali",
    ticket: "General",
    qty: 3,
    amount: 225000,
    status: "cancelled",
    orderedAt: "2025-03-20",
  },
];

const STATUS_BADGE = {
  paid: { cls: "bg-green-100 text-green-700", label: "Confirmed" },
  pending: { cls: "bg-yellow-100 text-yellow-700", label: "Pending Payment" },
  cancelled: { cls: "bg-red-100 text-red-700", label: "Cancelled" },
  used: { cls: "bg-neutral-100 text-neutral-600", label: "Used" },
};

const TAB_OPTIONS = ["all", "paid", "pending", "cancelled"];

export default function UserDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState(PLACEHOLDER_ORDERS);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!requireAuth(router, ["user", "admin", "organizer"])) return;
    fetchMyOrders()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.orders ?? data?.data ?? [];
        if (list.length) setOrders(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const displayed =
    activeTab === "all"
      ? orders
      : orders.filter((o) => o.status === activeTab);

  const fmt = (n) => `IDR ${Number(n).toLocaleString("id-ID")}`;

  return (
    <>
      <Head><title>My Tickets – TiketKu</title></Head>
      <DashboardLayout title="My Tickets">
        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {TAB_OPTIONS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? "bg-primary text-white"
                  : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
              }`}
            >
              {tab === "all" ? "All Orders" : STATUS_BADGE[tab]?.label ?? tab}
            </button>
          ))}
        </div>

        {/* Orders */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm animate-pulse">
                <div className="h-4 bg-neutral-200 rounded w-2/3 mb-3" />
                <div className="h-3 bg-neutral-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-neutral-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-5xl mb-4">🎟️</div>
            <p className="text-lg font-semibold text-neutral-700 mb-2">
              No tickets found
            </p>
            <p className="text-sm text-neutral-500 mb-6">
              {activeTab === "all"
                ? "You haven't booked any tickets yet."
                : `No ${STATUS_BADGE[activeTab]?.label?.toLowerCase() ?? activeTab} orders.`}
            </p>
            <Link
              href="/events"
              className="inline-block bg-primary text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-primary-dark transition-colors"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map((order) => {
              const badge = STATUS_BADGE[order.status] ?? { cls: "bg-neutral-100 text-neutral-600", label: order.status };
              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row">
                    {/* Left stripe */}
                    <div className="sm:w-2 bg-primary flex-shrink-0" />

                    <div className="flex-1 p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>
                              {badge.label}
                            </span>
                            <span className="text-xs text-neutral-400 font-mono">{order.id}</span>
                          </div>
                          <h3 className="text-base font-semibold text-neutral-800 mb-2">
                            {order.event}
                          </h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-500">
                            <span>📅 {order.date} {order.time && `at ${order.time} WIB`}</span>
                            <span>📍 {order.location}</span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-lg font-bold text-neutral-800">{fmt(order.amount)}</p>
                          <p className="text-xs text-neutral-400">Ordered {order.orderedAt}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-4 text-sm text-neutral-600">
                          <span>
                            <span className="font-medium">Ticket:</span> {order.ticket}
                          </span>
                          <span>
                            <span className="font-medium">Qty:</span> {order.qty}
                          </span>
                        </div>
                        {order.status === "paid" && (
                          <Link
                            href={`/order-confirmation?orderId=${order.id}`}
                            className="text-sm text-primary font-semibold hover:underline"
                          >
                            View E-Ticket →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DashboardLayout>
    </>
  );
}
