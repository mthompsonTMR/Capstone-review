// src/app/(private)/layout.tsx
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MedData Dashboard - Private",
  description: "Protected pages for logged-in users",
};

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="bg-black text-white min-h-screen">{children}</div>
    </>
  );
}
