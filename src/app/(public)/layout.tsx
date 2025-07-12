// src/app/(public)/layout.tsx
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MedData Dashboard - Public",
  description: "Public routes like login and signup",
};

export default function PublicLayout({
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