import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

const FAQ_DATA = [
  {
    category: "Account & Registration",
    id: "account",
    faqs: [
      { q: "Do I need an account to buy tickets?", a: "Yes. Creating a free account takes under a minute and lets you access your e-tickets at any time, request refunds, and manage orders." },
      { q: "How do I reset my password?", a: 'Click "Forgot Password" on the login page and enter your registered email. You\'ll receive a reset link within 2 minutes.' },
      { q: "Can I use one account for multiple buyers in my group?", a: "Yes, but each ticket is linked to a specific attendee's NIK. You can buy up to the organizer's per-user limit per transaction and fill in each attendee's details separately." },
    ],
  },
  {
    category: "Buying Tickets",
    id: "buy",
    faqs: [
      { q: "How do I search for events?", a: "Use the search bar at the top of any page. Filter by date, city, category, or price. Results are updated in real time." },
      { q: "What is the maximum number of tickets I can buy?", a: "Each event organizer sets their own per-user limit, which is displayed on the event page before purchase. This limit is enforced to prevent scalping." },
      { q: "Why do I need to enter my NIK?", a: "Your 16-digit national ID number (NIK) is used to verify your identity and link your ticket to you specifically, making scalping and fraud impossible." },
      { q: "Can I buy tickets for someone else?", a: "Yes. When purchasing multiple tickets, you will be asked to enter the Name, NIK, and phone number of each attendee individually." },
      { q: "I started checkout but didn't finish — what happens?", a: "A 15-minute reservation window holds your tickets. If you don't complete payment within that window, the tickets are automatically released back to the general pool." },
    ],
  },
  {
    category: "Payments",
    id: "payment",
    faqs: [
      { q: "What payment methods are accepted?", a: "We accept bank transfer (virtual account), credit/debit card (Visa, Mastercard, JCB), and e-wallets (GoPay, OVO, DANA, ShopeePay)." },
      { q: "Is there a service fee?", a: "Yes. A 5% service fee is added at checkout. This is shown clearly before you confirm payment — there are no hidden charges." },
      { q: "My payment failed. What should I do?", a: "First check that your card or e-wallet has sufficient balance. If the issue persists, try a different payment method or contact your bank. Our support team can also assist at support@tiketku.id." },
      { q: "Is my payment data secure?", a: "Yes. We use industry-standard TLS encryption and do not store card numbers. All transactions are processed through PCI-DSS certified payment gateways." },
    ],
  },
  {
    category: "E-Tickets & Entry",
    id: "eticket",
    faqs: [
      { q: "How do I receive my e-ticket?", a: "Your e-ticket is sent to the email address you provided at checkout within 10 seconds of a successful payment. Check your spam folder if it doesn't arrive." },
      { q: "Can I use a screenshot of my e-ticket?", a: "Yes. The QR code on your ticket is the entry credential and works from any screen. Staff will scan it at the venue entrance." },
      { q: "What if I lose my ticket or can't find the email?", a: "Log in to your TiketKu account and go to 'My Tickets'. Your e-tickets are always available there." },
      { q: "Can someone else use my ticket?", a: "No. Entry requires the ticket QR code AND a matching government-issued ID (NIK). If the name and NIK on the ticket don't match the person presenting it, entry will be refused." },
    ],
  },
  {
    category: "Refunds & Cancellations",
    id: "cancelled",
    faqs: [
      { q: "What happens if an event is cancelled?", a: "If the organizer cancels, all ticketholders receive an automatic full refund to their original payment method within 24 hours — no action needed." },
      { q: "Can I get a refund if I change my mind?", a: "Tickets are generally non-refundable once purchased. However, some events have a resale feature that lets you re-list your ticket at face value." },
      { q: "How long does a refund take?", a: "For cancelled events: 1–3 business days. For approved voluntary refunds: 5–7 business days. Bank transfer refunds may take slightly longer depending on your bank." },
    ],
  },
  {
    category: "For Organizers",
    id: "limits",
    faqs: [
      { q: "How do I list my event?", a: "Register as an organizer and use the 'Create Event' dashboard. Your event will be live within minutes after submission." },
      { q: "How do I set per-user ticket limits?", a: "In the event creation form, set 'Max tickets per buyer'. This field is visible to buyers before purchase and is strictly enforced by our system." },
      { q: "When do I receive my payout?", a: "Payouts are processed within 24 hours of the event ending. We hold funds in escrow until the event date to protect buyers." },
      { q: "What is TiketKu's commission?", a: "We charge a 5% platform fee on the face value of each ticket sold. There are no listing fees or monthly charges." },
    ],
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState({});

  const toggle = (catId, idx) => {
    const key = `${catId}-${idx}`;
    setOpenIndex((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <Head>
        <title>FAQs – TiketKu</title>
        <meta name="description" content="Frequently asked questions about TiketKu — tickets, payments, refunds, and more." />
      </Head>

      {/* Hero */}
      <section className="bg-neutral-900 py-14 text-center">
        <div className="max-w-xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Frequently Asked Questions</h1>
          <p className="text-neutral-400 text-base">Everything you need to know about buying and managing tickets on TiketKu.</p>
        </div>
      </section>

      {/* FAQ sections */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">
          {FAQ_DATA.map((section) => (
            <div key={section.id} id={section.id}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">{section.category}</h2>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-neutral-50">
                {section.faqs.map((faq, idx) => {
                  const key = `${section.id}-${idx}`;
                  const open = !!openIndex[key];
                  return (
                    <div key={idx}>
                      <button
                        onClick={() => toggle(section.id, idx)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-neutral-50 transition-colors gap-4"
                      >
                        <span className="text-sm font-semibold text-neutral-800">{faq.q}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 text-neutral-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {open && (
                        <div className="px-5 pb-4 text-sm text-neutral-600 leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still stuck */}
      <section className="bg-white py-14">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-neutral-800 mb-2">Didn&rsquo;t find your answer?</h2>
          <p className="text-neutral-500 text-sm mb-6">Our support team usually responds within one business day.</p>
          <Link href="/contact" className="inline-block bg-primary text-white font-semibold px-7 py-3 rounded-full hover:bg-orange-700 transition-colors text-sm">
            Contact Support
          </Link>
        </div>
      </section>
    </>
  );
}
