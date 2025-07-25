"use client";

import React, { useState, useRef } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [rowCount, setRowCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload/csv", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`❌ Upload failed.\n${data.error || "Unknown error."}`);
        setRowCount(null);
      } else {
        setMessage(data.message);
        setRowCount(data.inserted || null);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong. Please try again.");
      setRowCount(null);
    }
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value= "";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <h1 className="text-2xl font-bold mb-4">Upload CSV File</h1>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4 bg-white text-black border border-gray-400 rounded px-2 py-1"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Upload
      </button>

      {message && (
        <pre
          className={`mt-4 text-lg whitespace-pre-wrap ${
            message.includes("❌") ? "text-red-400" : "text-green-400"
          }`}
        >
          {message} {rowCount !== null && `(${rowCount} rows)`}
        </pre>
      )}
    </div>
  );
}
