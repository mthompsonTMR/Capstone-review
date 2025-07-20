


import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <h1 className="text-3xl font-bold mb-4">Contact & Development</h1>

      <p className="mb-2 text-lg text-center max-w-xl">
        This project is under active development. If you have questions,
        suggestions, or collaboration ideas, feel free to reach out.
      </p>

      <p className="text-blue-400 mt-2">
        📧 Email:{" "}
        <a href="mailto:yourname@yourdomain.com" className="underline">
          yourname@yourdomain.com
        </a>
      </p>

      <p className="text-sm mt-4 text-gray-400">
        (This email is an alias for development inquiries only.)
      </p>

      {/* 🔗 Back to Login Link */}
      <div className="mt-6">
        <Link
          href="/login"
          className="text-blue-400 underline hover:text-blue-300 transition"
        >
          ← Back to Login
        </Link>
      </div>
    </main>
  );
}
