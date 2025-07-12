// ✅ Root layout with correct export, globals, and metadata
import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
