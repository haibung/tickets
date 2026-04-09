import Head from "next/head";
import Link from "next/link";

export default function OrganizerCreatePage() {
  return (
    <>
      <Head>
        <title>Create Event – TiketKu Organizer</title>
      </Head>

      <div className="bg-neutral-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-white rounded-3xl shadow-sm p-12">
            <div className="w-20 h-20 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🎫</span>
            </div>
            <h1 className="text-2xl font-bold text-neutral-800 mb-2">
              Create a New Event
            </h1>
            <p className="text-neutral-500 text-sm mb-8 max-w-md mx-auto">
              The event creation dashboard is coming soon. Sign in as an organizer
              to manage your events, track sales, and reach thousands of attendees.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth/login"
                className="px-8 py-3 rounded-full border border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="px-8 py-3 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors"
              >
                Register as Organizer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
