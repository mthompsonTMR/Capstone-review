// ✅ Root layout with correct export, globals, and metadata
import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext"; // ✅ Add this line

export const metadata: Metadata = {
  title: "MedData Dashboard",
  description: "Full-stack pathology dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider> {/* ✅ Wrap entire app */}
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
