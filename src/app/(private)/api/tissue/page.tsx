'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Tissue {
  _id: string;
  sampleId: string;
  description: string;
  [key: string]: any; // Add this if you expect other optional fields
}

export default function TissueDashboard() {
  const [tissues, setTissues] = useState<Tissue[]>([]);

  const fetchTissues = async () => {
    try {
      const res = await axios.get<Tissue[]>('/api/tissue');
      setTissues(res.data);
    } catch (err) {
      console.error('Failed to load tissue data:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/tissue?id=${id}`);
      setTissues((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error('Failed to delete tissue sample:', err);
    }
  };

  useEffect(() => {
    fetchTissues();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">🧬 Tissue ETL Dashboard</h1>

      {tissues.length === 0 ? (
        <p>No tissue records found.</p>
      ) : (
        <ul className="space-y-4">
          {tissues.map((tissue) => (
            <li key={tissue._id} className="bg-white p-4 rounded shadow">
              <p><strong>Sample ID:</strong> {tissue.sampleId}</p>
              <p><strong>Description:</strong> {tissue.description}</p>
              <button
                onClick={() => handleDelete(tissue._id)}
                className="mt-2 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
