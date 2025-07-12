// components/EditSlideModal.tsx
"use client";

import React, { useState } from "react";
import axios from "axios";

interface Slide {
  _id: string;
  pmSerialNumber: string;
  caseId?: string;
  runId?: string;
  slideId?: string;
  createdBy?: string;
  stain?: string;
  markerName?: string;
  processDate?: string;
}

interface Props {
  isOpen: boolean;
  slide: Slide;
  onClose: () => void;
  onUpdate: () => void;
  onSave: (updateData: Partial<Slide>) => void;
}

export default function EditSlideModal({ isOpen, slide, onClose, onSave, onUpdate }: Props) {
  const [formData, setFormData] = useState<Slide>(slide);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
  try {
    setLoading(true);
    await onSave(formData); // Save is now responsible for triggering close and refresh
  } catch (err) {
    console.error("❌ Update failed:", err);
    alert("❌ Failed to update slide");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white text-black p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Slide (Model)</h2>

        {Object.entries(formData).map(([key, value]) => (
          key !== "_id" && (
            <div className="mb-3" key={key}>
              <label className="block text-sm font-semibold mb-1">{key}</label>
              <input
                type="text"
                name={key}
                value={value || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          )
        ))}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
