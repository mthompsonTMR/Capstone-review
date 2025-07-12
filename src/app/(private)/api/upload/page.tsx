// src/app/slides/upload/page.tsx
"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function UploadTabs() {
  const [activeTab, setActiveTab] = useState<"stain" | "tissue">("stain");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!csvFile) return;
    const formData = new FormData();
    formData.append("file", csvFile);

    const endpoint =
      activeTab === "stain" ? "/api/upload/stain" : "/api/upload/tissue";

    try {
      setLoading(true);
      const res = await axios.post<{ message: string }>(
        "/api/upload/stain", 
        formData,
        {
        headers: { 
          "Content-Type": "multipart/form-data" ,
      },
  }
);
      alert(`✅ ${res.data.message}`);
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("❌ Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Slide Upload Portal</h1>

      <div className="flex gap-6 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "stain"
              ? "bg-green-600"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
          onClick={() => setActiveTab("stain")}
        >
          Upload Stain CSV
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "tissue"
              ? "bg-blue-600"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
          onClick={() => setActiveTab("tissue")}
        >
          Upload Tissue CSV
        </button>
      </div>

      <div className="mb-6">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
          className="text-white"
        />
        <button
          onClick={handleUpload}
          disabled={!csvFile || loading}
          className="ml-4 px-4 py-2 rounded bg-amber-600 hover:bg-amber-700 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload File"}
        </button>
      </div>

      <p className="text-sm text-gray-400">
        Active Upload Mode: <span className="font-bold">{activeTab}</span>
      </p>

      <Link href="/slides" className="underline text-blue-400 mt-4 inline-block">
        ← Back to Dashboard
      </Link>
    </div>
  );
}
