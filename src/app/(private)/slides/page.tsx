"use client";

import ReplaceSlideModal from "@/components/ReplaceSlideModal";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { UploadResponse } from '@/types/index';
import EditSlideModal from "@/models/components/EditSlideModel";
import type { Slide } from "@/types/slide";
import { MongoInvalidArgumentError } from "mongodb";



export default function SlidesPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [csvUrl, setCsvUrl] = useState("");
  const [pmSerialNumber, setPmSerialNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tissueName, setTissueName] = useState("");
  const [stainId, setStainId] = useState("");
  const [tissueFile, setTissueFile] = useState<File | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);
  const [isReplaceOpen, setIsReplaceOpen] = useState(false);
  

  //delete slide handle
  const handleDeleteSlide = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;

    try {
      await axios.delete(`/api/slides/${id}`);
      alert("✅ Slide deleted successfully");
      // Refetch updated slide list
      fetchSlides(1);
    } catch (err) {
      console.error("❌ Delete failed:", err);
      //alert("❌ Failed to delete slide");
      throw err;
    }
  };

  const handleSlideUpdate = async (updatedData: Partial<Slide>) => {
    if (!selectedSlide) return;

    try {
      await axios.post("/api/slides/update", {
        _id: selectedSlide._id,
        ...updatedData,
      });
    alert("✅ Slide updated successfully");

        // ✅ Handle modal close and refresh from here
        setIsEditOpen(false);
        setSelectedSlide(null);
        fetchSlides(page);
      } catch (err) {
        console.error("❌ Update failed:", err);
        alert("❌ Slide update failed");
      }
    };

  const handleSlideReplace = async (updatedData: Partial<Slide>) => {
    if (!selectedSlide) return;

    try {
      await axios.post("/api/slides/replace", {
        slideId: selectedSlide._id,
        updates: updatedData,
      });

      alert("✅ Slide replaced successfully");
      setIsReplaceOpen(false);
      fetchSlides(page); // Refresh the list
    } catch (err) {
      console.error("❌ Replace failed:", err);
      alert("❌ Slide replace failed");
    }
  };


  const fetchSlides = async (currentPage: number) => {
    try {
      setLoading(true);
      const res = await axios.get<{ slides: Slide[] }>(`/api/slides?page=${currentPage}&limit=10`);
      setSlides(res.data.slides);
      setHasMore(res.data.slides.length === 10);
    } catch (err) {
      console.error("❌ Error fetching slides:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides(page);
  }, [page]);

  const handleFilterByDate = async () => {
    if (!startDate || !endDate) {
      alert("❗ Please select both start and end dates.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get<{ slides: Slide[] }>(
        `/api/slides/filter?start=${startDate}&end=${endDate}`
      );
      setSlides(res.data.slides);
      setHasMore(false);
    } catch (err) {
      console.error("❌ Date filter failed:", err);
      alert("❌ Date filter failed.");
    } finally {
      setLoading(false);
    }
  };

const handleUpload = async () => {
  try {
    setLoading(true);
    const res = await axios.post<{ message: string }>("/api/upload/url", { csvUrl });
    alert(`✅ ${res.data.message}`);
  } catch (err: any) {
    if (err.response?.data?.code === "CSV_SCHEMA_MISMATCH") {
      alert("⚠️ CSV format is invalid. Please contact support with this error code: CSV_SCHEMA_MISMATCH");
    } else {
      alert("❌ Upload failed. Please try again later.");
    }
    // 🔕 No console output in production for clean UX
  } finally {
    setLoading(false);
  }
};



  const handleSearch = async () => {
    try {
      setLoading(true);
      const res = await axios.get<{ slides: Slide[] }>(
        `/api/slides/search?pm=${pmSerialNumber}`
      );
      setSlides(res.data.slides);
      setHasMore(false);
    } catch (err: any) {
      console.error(err);
      alert("❌ Search failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleShowAll = () => {
    setPage(1);
    fetchSlides(1);
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await fetch("/api/slides/export");
      if (!response.ok) throw new Error("Failed to download CSV");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "slides_export.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Error downloading CSV:", error);
      alert("❌ Failed to download CSV.");
    }
  };

  const handleFileUpload = async (file: File) => {
    console.log("📁 handleFileUpload called with:", file.name);

  const formData = new FormData();
  formData.append("file", file);
  setLoading(true);
  try {
    const response = await axios.post("/api/upload/csv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("✅ Upload response:", response);
    alert("✅ File uploaded successfully!");
  } catch (err) {
    console.error("❌ File upload error:", err);
    alert("❌ File upload failed.");
  } finally {
    setLoading(false);
  }
};


  const handleTissueUpload = async () => {
    if (!tissueFile || !tissueName || !stainId) {
      alert("Please provide tissue name, stain ID, and select an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", tissueFile);
    formData.append("tissueName", tissueName);
    formData.append("stainId", stainId);

    try {
      setLoading(true);
      const res = await axios.post<{ message: string }>("/api/upload/tissue", formData);
      alert(`✅ ${res.data.message}`);
    } catch (err: any) {
      console.error("❌ Tissue upload failed:", err);
      alert("❌ Tissue upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Slides ETL Dashboard</h1>

      <div className="mb-6 flex items-center">
        <input
          type="text"
          placeholder="Enter public CSV URL"
          value={csvUrl}
          onChange={(e) => setCsvUrl(e.target.value)}
          className="text-black px-3 py-2 rounded w-96 bg-white"
        />
        <button
          onClick={handleUpload}
          className="bg-green-600 hover:bg-green-700 text-white ml-4 px-4 py-2 rounded"
        >
          Upload CSV
        </button>
      </div>

      <div className="mb-6 flex items-center">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
          className="bg-white text-black border border-gray-300 px-3 py-2 rounded w-64 cursor-pointer"
        />
        <button className="ml-4 px-4 py-2 rounded bg-amber-600 hover:bg-amber-700 text-white">
          Upload File
        </button>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <label className="text-sm">Start Date:</label>
        <input
          type="date"
          className="text-black bg-white border border-gray-300 px-3 py-2 rounded"
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label className="text-sm">End Date:</label>
        <input
          type="date"
          className="text-black bg-white border border-gray-300 px-3 py-2 rounded"
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button
          onClick={handleFilterByDate}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Filter by Date
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by PM Serial Number"
          value={pmSerialNumber}
          onChange={(e) => setPmSerialNumber(e.target.value)}
          className="text-black bg-white border border-gray-300 px-3 py-2 rounded w-80"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white ml-4 px-4 py-2 rounded"
        >
          Search
        </button>
        <button
          onClick={handleShowAll}
          className="bg-gray-700 hover:bg-gray-800 text-white ml-2 px-4 py-2 rounded"
        >
          Show All
        </button>
        <button
          onClick={handleDownloadCSV}
          className="bg-yellow-600 hover:bg-yellow-700 text-white ml-2 px-4 py-2 rounded"
        >
          Download CSV
        </button>
      </div>

      <div className="mb-6 border-t border-gray-500 pt-6">
        <h2 className="text-lg font-semibold mb-4">Tissue Image Upload</h2>
        <input
          type="text"
          placeholder="Tissue Name"
          value={tissueName}
          onChange={(e) => setTissueName(e.target.value)}
          className="text-black bg-white border px-3 py-2 rounded mb-2"
        />
        <input
          type="text"
          placeholder="Stain ID"
          value={stainId}
          onChange={(e) => setStainId(e.target.value)}
          className="text-black bg-white border px-3 py-2 rounded mb-2 ml-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setTissueFile(e.target.files?.[0] || null)}
          className="ml-2 w-64 px-3 py-2 bg-white text-black border border-gray-300 rounded cursor-pointer"
        />
        {tissueFile && (
          <p className="text-sm text-gray-400 mt-1 ml-2">
            Selected file: {tissueFile.name}
          </p>
        )}

        <button
          onClick={handleTissueUpload}
          className="ml-2 px-4 py-2 rounded bg-pink-600 hover:bg-pink-700 text-white"
        >
          Upload Tissue Image
        </button>
      </div>

      {/*new route for tissue map upload*/}
      <div className="mb-6 border-t border-gray-500 pt-6">
        <h2 className="text-lg font-semibold mb-4">Tissue Metadata CSV Upload</h2>
        <input
          type="file"
          accept=".csv"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("file", file);
            setLoading(true);

            try {
              const res = await axios.post<UploadResponse>("/api/upload/tissue-csv", formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });
              alert(`✅ ${res.data.message}`);
            } catch (err) {
              console.error("❌ Tissue CSV upload failed:", err);
              alert("❌ Tissue CSV upload failed.");
            } finally {
              setLoading(false);
            }
          }}
          className="ml-2 w-64 px-3 py-2 bg-white text-black border border-gray-300 rounded cursor-pointer"
        />
      </div>


      <div className="mb-4 flex gap-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          ← Previous
        </button>
        <span className="self-center">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasMore}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next →
        </button>
      </div>

      {loading ? (
  <p>🔄 Loading...</p>
) : (
  <div className="space-y-4">
    {slides.map((slide) => (
      <div key={slide._id} className="border border-gray-600 p-4 rounded">
        <p><strong>PM Serial:</strong> {slide.pmSerialNumber}</p>
        <p><strong>Case ID:</strong> {slide.caseId}</p>
        <p><strong>Slide ID:</strong> {slide.slideId}</p>
        <p><strong>Created By:</strong> {slide.createdBy}</p>
        <p><strong>Process Date:</strong> {slide.processDate}</p>
        <p><strong>Marker Name:</strong> {slide.markerName}</p>
        <p className={`font-semibold mt-2 ${slide.active ? "text-green-500" : "text-red-500"}`}>
          Status: {slide.active ? "Active" : "Replaced"}
        </p>

        {/* 🗑️ Delete Button */}
        <button
          onClick={() => handleDeleteSlide(slide._id)}
          className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
        >
          🗑️ Delete Slide
        </button>

        {/* ✏️ Edit Button */}
        <button
          onClick={() => {
            setSelectedSlide(slide);
            setIsEditOpen(true);
            setIsReplaceOpen(false);
          }}
          className="mt-3 ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
        >
          ✏️ Edit Slide
        </button>

        {/* ♻️ Replace Button */}
        <button
          onClick={() => {
            setSelectedSlide(slide);
            setIsEditOpen(false);
            setIsReplaceOpen(true);
          }}
          className="mt-3 ml-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-1 rounded"
        >
          ♻️ Replace Slide
        </button>
      </div>
    ))}

    {/* Edit Modal */}
    {isEditOpen && selectedSlide && (
      <EditSlideModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSlideUpdate}
        onUpdate={() => fetchSlides(page)}
        slide={selectedSlide}
      />
    )}

    {/* Replace Modal */}
    {isReplaceOpen && selectedSlide && (
      <ReplaceSlideModal
        isOpen={isReplaceOpen}
        onClose={() => setIsReplaceOpen(false)}
        onReplace={handleSlideReplace}
        onUpdate={() => fetchSlides(page)}
        slide={selectedSlide}
      />
    )}
  </div> 
)} {/*← closes ternary*/}
</div>
  )}
