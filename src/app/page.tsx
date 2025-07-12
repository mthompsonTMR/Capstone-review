import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <h1 className="text-4xl font-bold mb-4">MedData Dashboard</h1>
      
      <p className="mb-4 text-lg text-center max-w-xl">
        Welcome to the MedData Dashboard — a full-stack system for uploading, reviewing, 
        and managing pathology slides, tissue data, and synthetic patient records using 
        modern web technologies and healthcare interoperability standards.
      </p>

      <Link
        href="/profile"
        className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded"
      >
        Login to Begin
      </Link>

      <p className="mt-6 text-sm text-gray-400">
        Want to share feedback? Visit the{' '}
        <Link href="/blog" className="underline text-blue-400">
          blog
        </Link>.
      </p>

      <p className="mt-2 text-sm text-gray-500 italic">
        More to come: AI-driven analytics, slide image comparisons, and HL7/FHIR order integration.
      </p>
    </main>
  );
}
