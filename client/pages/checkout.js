import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { fetchEventById, createOrder } from "@/lib/api";

const RESERVATION_MINUTES = 15;

function CountdownTimer({ secondsLeft, onExpire }) {
  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");
  const urgent = secondsLeft <= 180; // last 3 minutes

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
        urgent ? "bg-red-50 text-red-600 border border-red-200" : "bg-amber-50 text-amber-700 border border-amber-200"
      }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
      </svg>
      <span>
        {secondsLeft === 0
          ? "Time expired!"
          : `Reservation expires in ${mins}:${secs}`}
      </span>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { eventId, ticketId, qty } = router.query;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // 15-minute countdown
  const [secondsLeft, setSecondsLeft] = useState(RESERVATION_MINUTES * 60);
  const [timerExpired, setTimerExpired] = useState(false);
  const timerRef = useRef(null);

  // Multi-step: 1 = contact, 2 = attendees, 3 = payment
  const [step, setStep] = useState(1);

  // Step 1 — contact info (email + phone for ticket delivery)
  const [contact, setContact] = useState({ email: "", phone: "" });

  // Step 2 — one entry per ticket
  const [attendees, setAttendees] = useState([]);

  // Step 3 — payment
  const [paymentMethod, setPaymentMethod] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const quantity = parseInt(qty) || 1;

  // Initialise attendee rows when quantity is known
  useEffect(() => {
    setAttendees(
      Array.from({ length: quantity }, () => ({ name: "", nik: "", phone: "" }))
    );
  }, [quantity]);

  // Start reservation timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          setTimerExpired(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Fetch event
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
          ticketTypes: [{ id: "cat2", name: "Category 2", price: 850000 }],
        })
      )
      .finally(() => setLoading(false));
  }, [eventId]);

  const selectedTicket =
    event?.ticketTypes?.find((t) => t.id === ticketId) ?? event?.ticketTypes?.[0];
  const unitPrice = selectedTicket?.price ?? event?.price ?? 0;
  const serviceFee = Math.round(unitPrice * quantity * 0.05);
  const total = unitPrice * quantity + serviceFee;

  // ── Handlers ──

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContact((c) => ({ ...c, [name]: value }));
  };

  const handleContactNext = (e) => {
    e.preventDefault();
    setError(null);
    if (!contact.email || !contact.phone) {
      setError("Please enter your email and phone number.");
      return;
    }
    setStep(2);
  };

  const handleAttendeeChange = (index, field, value) => {
    setAttendees((prev) =>
      prev.map((a, i) => (i === index ? { ...a, [field]: value } : a))
    );
  };

  const handleAttendeesNext = (e) => {
    e.preventDefault();
    setError(null);
    for (let i = 0; i < attendees.length; i++) {
      const a = attendees[i];
      if (!a.name.trim() || !a.nik.trim() || !a.phone.trim()) {
        setError(`Please fill in all details for Ticket ${i + 1}.`);
        return;
      }
      if (!/^\d{16}$/.test(a.nik.trim())) {
        setError(`NIK for Ticket ${i + 1} must be 16 digits.`);
        return;
      }
    }
    setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }
    if (!agreeTerms) {
      setError("Please agree to the Terms & Conditions.");
      return;
    }
    if (timerExpired) {
      setError("Your reservation has expired. Please go back and select tickets again.");
      return;
    }
    clearInterval(timerRef.current);
    setSubmitting(true);
    try {
      const order = await createOrder({
        eventId,
        ticketId,
        quantity,
        contactDetails: { email: contact.email, phone: contact.phone },
        attendees,
        paymentMethod,
      });
      router.push(`/order-confirmation?orderId=${order?.id ?? "demo-order"}`);
    } catch {
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

  // ── Timer expired overlay ──
  if (timerExpired) {
    return (
      <>
        <Head><title>Reservation Expired – TiketKu</title></Head>
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-sm p-8 max-w-sm w-full text-center">
            <div className="text-5xl mb-4">⏰</div>
            <h1 className="text-xl font-bold text-neutral-800 mb-2">Reservation Expired</h1>
            <p className="text-sm text-neutral-600 mb-6">
              Your 15-minute reservation window has ended. Tickets have been released back to the pool.
            </p>
            <Link
              href={eventId ? `/events/${eventId}` : "/events"}
              className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-orange-700 transition-colors"
            >
              Back to Event
            </Link>
          </div>
        </div>
      </>
    );
  }

  const STEPS = ["Contact Info", "Attendee Details", "Payment"];

  return (
    <>
      <Head>
        <title>Checkout – TiketKu</title>
      </Head>

      <div className="bg-neutral-50 py-10 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
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

          {/* Header row: title + timer */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h1 className="text-2xl font-bold text-neutral-800">Complete Your Order</h1>
            <CountdownTimer secondsLeft={secondsLeft} />
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-0 mb-8">
            {STEPS.map((label, i) => {
              const stepNum = i + 1;
              const done = step > stepNum;
              const active = step === stepNum;
              return (
                <div key={label} className="flex items-center">
                  <div className={`flex items-center gap-2 ${active ? "text-primary" : done ? "text-green-600" : "text-neutral-400"}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${active ? "bg-primary text-white" : done ? "bg-green-600 text-white" : "bg-neutral-200 text-neutral-500"}`}>
                      {done ? "✓" : stepNum}
                    </div>
                    <span className="text-sm font-medium hidden sm:block">{label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`h-0.5 w-8 sm:w-16 mx-2 ${done ? "bg-green-600" : "bg-neutral-200"}`} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left: Step forms ── */}
            <div className="lg:col-span-2">

              {/* STEP 1 — Contact Info */}
              {step === 1 && (
                <form onSubmit={handleContactNext} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-neutral-800">Contact Information</h2>
                  <p className="text-sm text-neutral-500">
                    Your ticket confirmation and e-tickets will be sent to these details.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={contact.email}
                      onChange={handleContactChange}
                      placeholder="you@example.com"
                      className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={contact.phone}
                      onChange={handleContactChange}
                      placeholder="+62 812 3456 7890"
                      className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
                  )}
                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-primary text-white font-semibold text-sm hover:bg-orange-700 transition-colors"
                  >
                    Continue to Attendee Details →
                  </button>
                </form>
              )}

              {/* STEP 2 — Attendee Details */}
              {step === 2 && (
                <form onSubmit={handleAttendeesNext} className="space-y-4">
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-neutral-800 mb-1">Attendee Details</h2>
                    <p className="text-sm text-neutral-500 mb-5">
                      Fill in the details for each ticket holder. NIK is the 16-digit national ID number.
                    </p>
                    <div className="space-y-6">
                      {attendees.map((attendee, i) => (
                        <div key={i} className="border border-neutral-100 rounded-xl p-4">
                          <p className="text-sm font-semibold text-primary mb-3">
                            Ticket {i + 1} — {selectedTicket?.name ?? "General"}
                          </p>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-neutral-700 mb-1">
                                Full Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                required
                                type="text"
                                value={attendee.name}
                                onChange={(e) => handleAttendeeChange(i, "name", e.target.value)}
                                placeholder="As on government ID"
                                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-neutral-700 mb-1">
                                NIK (16-digit national ID) <span className="text-red-500">*</span>
                              </label>
                              <input
                                required
                                type="text"
                                inputMode="numeric"
                                maxLength={16}
                                value={attendee.nik}
                                onChange={(e) => handleAttendeeChange(i, "nik", e.target.value.replace(/\D/g, ""))}
                                placeholder="1234567890123456"
                                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-neutral-700 mb-1">
                                Phone Number <span className="text-red-500">*</span>
                              </label>
                              <input
                                required
                                type="tel"
                                value={attendee.phone}
                                onChange={(e) => handleAttendeeChange(i, "phone", e.target.value)}
                                placeholder="+62 812 3456 7890"
                                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
                  )}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setStep(1); setError(null); }}
                      className="flex-1 py-3 rounded-full border border-neutral-200 text-neutral-600 font-semibold text-sm hover:bg-neutral-100 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-full bg-primary text-white font-semibold text-sm hover:bg-orange-700 transition-colors"
                    >
                      Continue to Payment →
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3 — Payment */}
              {step === 3 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-neutral-800 mb-4">Payment Method</h2>
                    <div className="space-y-3">
                      {[
                        "Bank Transfer (Virtual Account)",
                        "Credit / Debit Card",
                        "GoPay / OVO / DANA",
                      ].map((method) => (
                        <label
                          key={method}
                          className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${
                            paymentMethod === method ? "border-primary bg-primary bg-opacity-5" : "border-neutral-200 hover:border-primary"
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method}
                            checked={paymentMethod === method}
                            onChange={() => setPaymentMethod(method)}
                            className="accent-primary"
                          />
                          <span className="text-sm text-neutral-700">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer bg-white rounded-2xl shadow-sm p-5">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-1 accent-primary"
                    />
                    <span className="text-sm text-neutral-600">
                      I confirm that all attendee information is accurate and I agree to the event&apos;s{" "}
                      <Link href={eventId ? `/events/${eventId}` : "/events"} target="_blank" className="text-primary hover:underline">
                        Terms &amp; Conditions
                      </Link>.
                    </span>
                  </label>

                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setStep(2); setError(null); }}
                      className="flex-1 py-3 rounded-full border border-neutral-200 text-neutral-600 font-semibold text-sm hover:bg-neutral-100 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className={`flex-1 py-3 rounded-full font-semibold text-sm transition-colors ${
                        submitting
                          ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                          : "bg-primary text-white hover:bg-orange-700"
                      }`}
                    >
                      {submitting ? "Processing…" : `Pay IDR ${total.toLocaleString("id-ID")}`}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* ── Right: Order summary ── */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24 space-y-4">
                <h2 className="text-lg font-semibold text-neutral-800">Order Summary</h2>

                {/* Timer reminder in sidebar */}
                <CountdownTimer secondsLeft={secondsLeft} />

                {event && (
                  <div className="pb-4 border-b border-neutral-100">
                    <p className="text-sm font-semibold text-neutral-800 line-clamp-2 mb-1">{event.title}</p>
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

                <div className="space-y-2 text-sm pb-4 border-b border-neutral-100">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">
                      {selectedTicket?.name ?? "Ticket"} × {quantity}
                    </span>
                    <span className="font-medium">IDR {(unitPrice * quantity).toLocaleString("id-ID")}</span>
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

                {/* Contact recap (shown from step 2 onward) */}
                {step >= 2 && contact.email && (
                  <div className="text-xs text-neutral-500 bg-neutral-50 rounded-lg p-3 space-y-0.5">
                    <p className="font-medium text-neutral-700 mb-1">Ticket delivery to:</p>
                    <p>{contact.email}</p>
                    <p>{contact.phone}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
