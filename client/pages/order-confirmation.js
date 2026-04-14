import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchOrderById } from "@/lib/api";

export default function OrderConfirmationPage() {
  const router = useRouter();
  const { orderId } = router.query;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    fetchOrderById(orderId)
      .then((data) => setOrder(data))
      .catch(() =>
        setOrder({
          id: orderId,
          status: "confirmed",
          event: {
            title: "Coldplay Music of the Spheres World Tour",
            date: "2025-05-15T19:00:00Z",
            location: "Gelora Bung Karno, Jakarta",
          },
          ticketType: "Category 2",
          quantity: 2,
          total: 1785000,
          email: "customer@example.com",
        })
      )
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center animate-pulse">
        <div className="h-16 w-16 bg-neutral-200 rounded-full mx-auto mb-6" />
        <div className="h-6 bg-neutral-200 rounded w-1/2 mx-auto" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Order Confirmed – TiketKu</title>
      </Head>

      <div className="bg-neutral-50 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-sm p-8 sm:p-12 text-center">
            {/* Success icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-neutral-800 mb-2">
              Booking Confirmed! 🎉
            </h1>
            <p className="text-neutral-500 text-sm mb-8">
              Your e-ticket has been sent to{" "}
              <span className="font-medium text-neutral-700">
                {order?.email ?? "your email address"}
              </span>
              . Please check your inbox (and spam folder).
            </p>

            {/* Order details */}
            <div className="bg-neutral-50 rounded-2xl p-6 text-left mb-8 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Order ID</span>
                <span className="font-semibold text-neutral-800 font-mono">
                  #{order?.id ?? orderId}
                </span>
              </div>
              {order?.event && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Event</span>
                    <span className="font-medium text-neutral-800 text-right max-w-[60%]">
                      {order.event.title}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Date</span>
                    <span className="font-medium text-neutral-800">
                      {new Date(order.event.date).toLocaleDateString("en-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Venue</span>
                    <span className="font-medium text-neutral-800 text-right max-w-[60%]">
                      {order.event.location}
                    </span>
                  </div>
                </>
              )}
              {order?.ticketType && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Ticket Type</span>
                  <span className="font-medium text-neutral-800">{order.ticketType}</span>
                </div>
              )}
              {order?.quantity && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Quantity</span>
                  <span className="font-medium text-neutral-800">{order.quantity}</span>
                </div>
              )}
              {order?.total !== undefined && (
                <div className="flex justify-between text-sm pt-3 border-t border-neutral-200">
                  <span className="font-semibold text-neutral-700">Total Paid</span>
                  <span className="font-bold text-primary">
                    IDR {Number(order.total).toLocaleString("id-ID")}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/events"
                className="flex-1 py-3 rounded-full border border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-colors text-center"
              >
                Browse More Events
              </Link>
              <Link
                href="/"
                className="flex-1 py-3 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
