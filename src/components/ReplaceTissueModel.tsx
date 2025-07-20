'use client';

import React, { useEffect, useState } from 'react';

type Tissue = {
  _id: string;
  tissueId: string;
  stainedSlideId?: string;
  imageUrl: string;
  diagnosis?: string;
  notes?: string;
};

type ReplaceTissueModalProps = {
  isOpen: boolean;
  tissue: Tissue | null;
  onClose: () => void;
  onReplace: (updates: Partial<Tissue>) => Promise<void>;
};

export default function ReplaceTissueModal({
  isOpen,
  tissue,
  onClose,
  onReplace,
}: ReplaceTissueModalProps) {
  const [formData, setFormData] = useState<Partial<Tissue>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tissue) {
      setFormData(tissue);
    }
  }, [tissue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !formData.tissueId) return;

    try {
      setLoading(true);
      await onReplace(formData);
      onClose();
    } catch (err) {
      console.error('❌ Failed to replace tissue:', err);
      alert('❌ Replacement failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !tissue) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-black text-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Replace Tissue Record</h2>
        <form onSubmit={handleSubmit}>
          {[
            'tissueId',
            'stainedSlideId',
            'imageUrl',
            'diagnosis',
            'notes',
          ].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              value={String(formData[field as keyof Tissue] ?? '')}
              onChange={handleChange}
              placeholder={field}
              className="w-full mb-3 p-2 rounded border border-gray-600 bg-gray-800 text-white"
            />
          ))}

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded"
            >
              {loading ? 'Replacing...' : 'Replace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
