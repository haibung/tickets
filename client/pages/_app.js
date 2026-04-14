import "@/styles/globals.css";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  // Dashboard pages handle their own layout (sidebar + no public nav/footer)
  const isDashboard = router.pathname.startsWith("/dashboard");

  if (isDashboard) {
    return <Component {...pageProps} />;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}
