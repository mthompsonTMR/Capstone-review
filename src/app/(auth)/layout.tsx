// src/app/(auth)/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MedData Dashboard - Public",
  description: "Public routes like login and signup",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center px-4">
      {children}
    </div>
  );
}
