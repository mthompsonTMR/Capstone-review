"use client";
import React, { useEffect, useState } from "react";
import type { Slide } from "@/types/slide";


type ReplaceModalProps = {
  isOpen: boolean;
  slide: Slide | null;
  onClose: () => void;
  onReplace: (updates: Partial<Slide>) => Promise<void>;
  onUpdate: () => Promise<void>; // ✅ ADD THIS LINE
};

export default function ReplaceSlideModal({
  slide,
  onClose,
  onReplace,
}: ReplaceModalProps) {
  const [formData, setFormData] = useState<Partial<Slide>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (slide) {
      setFormData(slide);
    }
  }, [slide]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !formData._id) return;

    try {
      setLoading(true);
      await onReplace(formData);
      setFormData({});
      onClose();
    } catch (err) {
      console.error("❌ Replace error:", err);
      alert("❌ Failed to replace slide");
    } finally {
      setLoading(false);
    }
  };

  if (!slide) return null;

  return (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div className="bg-black text-white p-6 rounded-lg shadow-lg w-full max-w-lg">
      <h2 className="text-xl font-semibold mb-4">Replace Slide (Modal)</h2>
      <form onSubmit={handleSubmit}>
        {[
          "pmSerialNumber",
          "caseId",
          "runId",
          "slideId",
          "createdBy",
          "processDate",
          "markerName",
        ].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            value={String(formData[field as keyof Slide] ?? "")}
            onChange={handleChange}
            placeholder={field}
            className="w-full mb-3 p-2 rounded border border-gray-600 bg-gray-800 text-white"
          />
        ))}

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-white"
          >
            {loading ? "Replacing..." : "Replace"}
          </button>
        </div>
      </form>
    </div>
  </div>
)};
