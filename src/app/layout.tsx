// ✅ Slide 2 Demo Component: Global layout and context wrapper
// 💬 "This file wraps the entire app with shared layout and global context."

import type { Metadata } from "next"; // ✅ App Router metadata support
import "./globals.css";               // ✅ Global styles shared across all pages
import { AppProvider } from "@/context/AppContext"; // ✅ Import global context provider

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
        {/* ✅ AppProvider wraps the app, enabling global state with useAppContext */}
        {/* 💬 "This is what gives all pages access to uploadStatus and login state without prop drilling." */}
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
