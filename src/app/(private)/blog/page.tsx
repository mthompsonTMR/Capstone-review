'use client';

import Link from 'next/link';

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <h1 className="text-3xl font-bold mb-4">🧠 Research & Comments Blog</h1>
      <p className="text-gray-300 mb-6 max-w-xl text-center">
        This section will allow researchers and users to discuss uploads, share insights,
        and comment on diagnostic workflows. For now,  "it's"  under development.
      </p>
      <Link
        href="/"
        className="text-blue-400 underline hover:text-blue-300 transition"
      >
        ← Return to Home
      </Link>
    </div>
  );
}
