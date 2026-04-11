import Head from "next/head";
import Link from "next/link";

const SECTIONS = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: [
      "By accessing or using TiketKu (the \"Platform\"), you agree to be bound by these Terms & Conditions (\"Terms\"). If you do not agree to these Terms, you may not use the Platform.",
      "These Terms apply to all users of the Platform, including buyers, event organizers, and visitors.",
      "TiketKu reserves the right to update these Terms at any time. Continued use of the Platform after any changes constitutes acceptance of the revised Terms. We will notify users of material changes via email.",
    ],
  },
  {
    id: "account",
    title: "2. User Accounts",
    content: [
      "To purchase tickets, you must create an account with accurate, current, and complete information. You are responsible for maintaining the security of your account credentials.",
      "You may not share your account with other persons or allow others to access the Platform through your account.",
      "TiketKu reserves the right to suspend or terminate accounts found to be in violation of these Terms, including but not limited to accounts engaged in ticket scalping, identity fraud, or abuse of the refund system.",
    ],
  },
  {
    id: "tickets",
    title: "3. Ticket Purchases",
    content: [
      "All ticket sales are final unless the event is cancelled or postponed by the organizer (see our Refund Policy).",
      "Tickets are non-transferable unless the Platform provides an official transfer or resale feature for the specific event.",
      "Per-user purchase limits are set by the event organizer and are strictly enforced. Attempting to circumvent purchase limits (e.g., via multiple accounts) may result in cancellation of all associated orders without refund.",
      "Each ticket is linked to the purchaser's national identity number (NIK). Entry may be refused if the presenting person cannot verify their identity matches the ticket.",
      "A 5% service fee is applied to each transaction. This fee is non-refundable except in the case of organizer-initiated event cancellations.",
    ],
  },
  {
    id: "reservation",
    title: "4. Reservation Window",
    content: [
      "When you initiate checkout, a 15-minute reservation is placed on your selected tickets. If payment is not completed within this window, the reservation expires and tickets are released back to the general pool.",
      "TiketKu is not responsible for tickets becoming unavailable after a reservation expires.",
    ],
  },
  {
    id: "identity",
    title: "5. Identity Verification",
    content: [
      "Ticket holders may be required to present a valid government-issued photo ID matching the name and NIK registered at purchase for event entry.",
      "You warrant that all personal information submitted during checkout — including attendee names, NIK numbers, and contact details — is accurate and belongs to the actual attendees.",
      "Providing false identity information is a violation of these Terms and may result in account termination and denial of entry without refund.",
    ],
  },
  {
    id: "organizers",
    title: "6. Event Organizers",
    content: [
      "Organizers are solely responsible for the content, delivery, and conduct of their events. TiketKu acts as a marketplace and is not liable for any failure, cancellation, or quality issues with an event.",
      "Organizers must honour all tickets sold through the Platform. Failure to do so may result in removal from the Platform and financial penalties.",
      "Organizer payouts are disbursed within 24 hours of the event conclusion, after deduction of the Platform fee.",
      "Organizers may configure per-user purchase limits. TiketKu enforces these limits on behalf of the organizer.",
    ],
  },
  {
    id: "ip",
    title: "7. Intellectual Property",
    content: [
      "All content on the Platform, including logos, design, text, and software, is the exclusive property of PT TiketKu Indonesia or its licensors and is protected by applicable intellectual property laws.",
      "You may not reproduce, modify, distribute, or create derivative works from any Platform content without prior written permission.",
    ],
  },
  {
    id: "liability",
    title: "8. Limitation of Liability",
    content: [
      "To the maximum extent permitted by Indonesian law, TiketKu shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform.",
      "TiketKu's total liability to you for any claim arising from these Terms shall not exceed the total amount paid by you for the ticket(s) in question.",
      "TiketKu is not liable for any personal loss, injury, or damage that occurs before, during, or after an event.",
    ],
  },
  {
    id: "privacy",
    title: "9. Privacy",
    content: [
      "Your use of the Platform is also governed by our Privacy Policy, which is incorporated into these Terms by reference.",
      "By using the Platform, you consent to the collection and processing of your personal data as described in the Privacy Policy.",
      "Attendee identity data (name, NIK) is collected solely for ticket verification purposes and is not sold to third parties.",
    ],
  },
  {
    id: "governing",
    title: "10. Governing Law & Disputes",
    content: [
      "These Terms are governed by the laws of the Republic of Indonesia.",
      "Any dispute arising from or relating to these Terms shall first be attempted to be resolved through good-faith negotiation. If unresolved within 30 days, disputes shall be submitted to the jurisdiction of the South Jakarta District Court (Pengadilan Negeri Jakarta Selatan).",
      "Nothing in these Terms limits your statutory rights as a consumer under Indonesian Consumer Protection Law (UU No. 8 Tahun 1999).",
    ],
  },
  {
    id: "contact",
    title: "11. Contact",
    content: [
      "Questions about these Terms? Contact us at legal@tiketku.id or via the Contact page.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms & Conditions – TiketKu</title>
        <meta name="description" content="TiketKu Terms & Conditions — your rights and obligations when using our platform." />
      </Head>

      {/* Hero */}
      <section className="bg-neutral-900 py-14 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Terms &amp; Conditions</h1>
          <p className="text-neutral-400 text-sm">Last updated: April 2026 · Effective immediately</p>
        </div>
      </section>

      {/* Quick nav */}
      <section className="bg-white border-b border-neutral-100 py-5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="text-xs text-neutral-500 mb-2 font-semibold uppercase tracking-wider">Jump to section</p>
          <div className="flex flex-wrap gap-2">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-xs text-neutral-600 hover:text-primary bg-neutral-50 hover:bg-primary hover:bg-opacity-10 px-3 py-1.5 rounded-full border border-neutral-200 transition-colors"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="space-y-10">
            {SECTIONS.map((section) => (
              <div key={section.id} id={section.id} className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-base font-bold text-neutral-800 mb-4">{section.title}</h2>
                <div className="space-y-3">
                  {section.content.map((para, i) => (
                    <p key={i} className="text-sm text-neutral-600 leading-relaxed">{para}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center text-sm text-neutral-400">
            Questions?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact our legal team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
