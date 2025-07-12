// src/app/upload-url/page.tsx
"use client";

import React, { useState } from "react";
import axios from "axios";

export default function UploadFromUrlPage() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [slides, setSlides] = useState<any[]>([]);

  const handleUpload = async () => {
    setStatus("Uploading...");
    try {
      const response = await axios.post("/api/upload-url", { url });
      setStatus(response.data.message);
    } catch (err: any) {
      setStatus(`Upload failed: ${err.response?.data?.error || err.message}`);
    }
  };

  const fetchSlides = async () => {
    setStatus("Fetching records...");
    try {
      const response = await axios.get("/api/slides");
      setSlides(response.data);
      setStatus("Records loaded.");
    } catch (err: any) {
      setStatus(`Fetch failed: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-10">
      <h1 className="text-2xl font-bold mb-4">Upload Slides from URL</h1>
      <input
        type="text"
        className="p-2 rounded text-black w-full max-w-xl mb-4"
        placeholder="Enter public CSV URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <div className="flex gap-4 mb-4">
        <button
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
          onClick={handleUpload}
        >
          Upload CSV
        </button>
        <button
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          onClick={fetchSlides}
        >
          Get Slides
        </button>
      </div>
      {status && <p className="mb-4 text-sm text-gray-300">{status}</p>}
      {slides.length > 0 && (
        <div className="w-full max-w-4xl bg-white text-black p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Slide Results</h2>
          <ul className="max-h-[400px] overflow-auto text-sm">
            {slides.map((slide, idx) => (
              <li key={idx} className="border-b border-gray-200 py-1">
                <strong>{slide.slideId}</strong> - Marker: {slide.markerName} - Case: {slide.caseId}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
