import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50">
      <div className="text-center">
        <p className="text-8xl font-bold text-primary">403</p>
        <h1 className="mt-4 text-2xl font-bold text-neutral-900">Access Denied</h1>
        <p className="mt-2 text-neutral-700">
          You don&apos;t have permission to view this page.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
