import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ConfirmationPage() {
  const router = useRouter();
  const { orderId } = router.query;

  return (
    <>
      <Head>
        <title>Order Confirmed – TicketHub</title>
        <meta name="description" content="Your ticket order has been confirmed." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 bg-gray-50 flex items-center justify-center py-20">
          <div className="container-main text-center max-w-lg">
            {/* Success icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
              <svg
                className="w-12 h-12 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              🎉 Order Confirmed!
            </h1>
            <p className="text-gray-600 mb-2">
              Thank you for your purchase. Your tickets are on their way.
            </p>

            {orderId && (
              <p className="text-sm text-gray-400 mb-8">
                Order ID:{" "}
                <span className="font-mono font-medium text-gray-700">
                  {orderId}
                </span>
              </p>
            )}

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-left mb-8">
              <h2 className="font-semibold text-gray-900 mb-3">What&apos;s next?</h2>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  A confirmation email will be sent to your inbox.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  Your e-tickets will be attached as a PDF.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  Present the QR code at the venue entrance.
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events" className="btn-primary">
                Browse More Events
              </Link>
              <Link href="/" className="btn-secondary">
                Back to Home
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
