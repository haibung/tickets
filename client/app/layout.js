import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "TiketKu",
  description: "Your ticket platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
