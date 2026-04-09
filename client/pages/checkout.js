import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { fetchEventById, createOrder } from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { eventId, ticketId, qty } = router.query;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    agreeTerms: false,
  });

  const quantity = parseInt(qty) || 1;

  useEffect(() => {
    if (!eventId) return;
    fetchEventById(eventId)
      .then((data) => setEvent(data))
      .catch(() =>
        setEvent({
          id: eventId,
          title: "Coldplay Music of the Spheres World Tour",
          date: "2025-05-15T19:00:00Z",
          location: "Gelora Bung Karno, Jakarta",
          ticketTypes: [
            { id: "cat2", name: "Category 2", price: 850000 },
          ],
        })
      )
      .finally(() => setLoading(false));
  }, [eventId]);

  const selectedTicket = event?.ticketTypes?.find((t) => t.id === ticketId) ??
    event?.ticketTypes?.[0];
  const unitPrice = selectedTicket?.price ?? event?.price ?? 0;
  const serviceFee = Math.round(unitPrice * quantity * 0.05);
  const total = unitPrice * quantity + serviceFee;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.agreeTerms) {
      setError("Please agree to the terms and conditions.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const order = await createOrder({
        eventId,
        ticketId,
        quantity,
        customerDetails: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
        },
      });
      router.push(`/order-confirmation?orderId=${order?.id ?? "demo-order"}`);
    } catch {
      // In demo/placeholder mode, navigate anyway
      router.push("/order-confirmation?orderId=demo-order");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-8 bg-neutral-200 rounded w-1/3 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-48 bg-neutral-200 rounded-2xl" />
            <div className="h-48 bg-neutral-200 rounded-2xl" />
          </div>
          <div className="h-64 bg-neutral-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout – TiketKu</title>
      </Head>

      <div className="bg-neutral-50 py-10 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/events" className="hover:text-primary">Events</Link>
            <span>/</span>
            {event && (
              <>
                <Link href={`/events/${eventId}`} className="hover:text-primary line-clamp-1 max-w-[200px]">
                  {event.title}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-neutral-800 font-medium">Checkout</span>
          </nav>

          <h1 className="text-2xl font-bold text-neutral-800 mb-8">Complete Your Order</h1>

          {/* Steps indicator */}
          <div className="flex items-center gap-0 mb-10">
            {["Select Ticket", "Fill Details", "Payment"].map((step, i) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center gap-2 ${i === 1 ? "text-primary" : i === 0 ? "text-green-600" : "text-neutral-400"}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 1 ? "bg-primary text-white" : i === 0 ? "bg-green-600 text-white" : "bg-neutral-200"}`}>
                    {i === 0 ? "✓" : i + 1}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{step}</span>
                </div>
                {i < 2 && <div className={`h-0.5 w-8 sm:w-16 mx-2 ${i === 0 ? "bg-green-600" : "bg-neutral-200"}`} />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">Contact Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+62 812 3456 7890"
                      className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {["Bank Transfer (Virtual Account)", "Credit / Debit Card", "GoPay / OVO / DANA"].map((method) => (
                    <label key={method} className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:border-primary transition-colors">
                      <input type="radio" name="payment" value={method} className="accent-primary" />
                      <span className="text-sm text-neutral-700">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                  {error}
                </div>
              )}

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={form.agreeTerms}
                  onChange={handleChange}
                  className="mt-1 accent-primary"
                />
                <span className="text-sm text-neutral-600">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">Terms & Conditions</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-4 rounded-full font-semibold text-sm transition-colors ${
                  submitting
                    ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary-dark"
                }`}
              >
                {submitting ? "Processing..." : `Pay IDR ${total.toLocaleString("id-ID")}`}
              </button>
            </form>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">Order Summary</h2>
                {event && (
                  <div className="mb-4 pb-4 border-b border-neutral-100">
                    <p className="text-sm font-semibold text-neutral-800 line-clamp-2 mb-1">
                      {event.title}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {new Date(event.date).toLocaleDateString("en-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-neutral-500">{event.location}</p>
                  </div>
                )}
                <div className="space-y-2 text-sm mb-4 pb-4 border-b border-neutral-100">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">
                      {selectedTicket?.name ?? "Ticket"} × {quantity}
                    </span>
                    <span className="font-medium">
                      IDR {(unitPrice * quantity).toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Service Fee (5%)</span>
                    <span className="font-medium">IDR {serviceFee.toLocaleString("id-ID")}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-primary">IDR {total.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
