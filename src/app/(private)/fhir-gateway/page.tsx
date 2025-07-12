"use client";

import React, { useState, useEffect } from "react";
import { Patient } from "@/types/fhir";


export default function FhirGateway() {
  const [patientId, setPatientId] = useState("");
  const [mockCount, setMockCount] = useState(3);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
  const fetchPatients = async () => {
    const res = await fetch(`/api/fhir/patient/list?page=${currentPage}&limit=5`);
    const data = await res.json();
    setPatients(data.patients || []);
    setTotalPages(data.pagination?.totalPages || 1);
  };
  fetchPatients();
}, [currentPage]);

  // Fetch a single FHIR patient by ID
  const handleFetchPatient = async () => {
    if (!patientId) {
      setStatus("⚠️ Please enter a FHIR Patient ID.");
      return;
    }

    setLoading(true);
    
    setStatus("");
    

    
      try {
    const res = await fetch(`/api/fhir/patient/${patientId}`);
    const data = await res.json();

      if (res.ok) {
        
      if (data.message === "Patient already exists") {
        setStatus(`ℹ️ Patient already exists in MongoDB (ID: ${data.id})`);
      } else {
        setStatus(`✅ Patient saved to MongoDB (ID: ${data.id})`);
        setPatientId(""); //clear the input of newly added
      }
    } else {
      setStatus(`❌ Failed: ${data.error || "Unknown error"}`);
    }
  } catch (err) {
    console.error(err);
    setStatus("❌ Error connecting to API.");
  }

  setLoading(false);
};

  // Fetch multiple mock patients
  // ⛏ FIX 1: Correct endpoint path for mock import
const handleFetchMockPatients = async () => {
  setLoading(true);
  setStatus("");

  try {
    const res = await fetch(`/api/fhir/patient/mock?count=${mockCount}`); // ✅ CORRECT ENDPOINT
    const data = await res.json();

    if (res.ok) {
      setStatus(`✅ ${data.inserted} patients saved to MongoDB.`);
    } else {
      setStatus(`❌ Failed: ${data.error || "Unknown error"}`);
    }
  } catch (err) {
    console.error(err);
    setStatus("❌ Error fetching mock patients.");
  }

  setLoading(false);
};

const handleDeletePatient = async (id: string) => {
   const confirmed = confirm("Are you sure you want to delete this patient?");
  if (!confirmed) return;

  try {
    const res = await fetch(`/api/fhir/patient/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

 if (res.ok) {
      setStatus(`🗑️ Patient deleted (ID: ${id})`);
      // Refresh the list after deletion
      setPatients((prev: Patient[]) => prev.filter((p) => p._id !== id));
    } else {
      setStatus(`❌ Failed to delete: ${data.error || "Unknown error"}`);
    }
  } catch (error) {
    console.error(error);
    setStatus("❌ Error deleting patient.");
  }
};


  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto p-6 bg-zinc-900 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6">🔗 FHIR Gateway</h1>

        {/* Input for specific patient */}
        <div className="mb-4">
          <label htmlFor="patientId" className="block text-sm font-semibold mb-2">
            Enter FHIR Patient ID:
          </label>
          <input
            id="patientId"
            type="text"
            placeholder="e.g. 597260"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full p-2 text-white placeholder-white bg-black border border-white rounded"
          />
        </div>

        <button
          onClick={handleFetchPatient}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
        >
          {loading ? "Importing..." : "Fetch & Save Patient"}
        </button>

        {/* Divider */}
        <hr className="my-6 border-gray-700" />

        {/* Mock patient import */}
        <div className="mb-4">
          <label htmlFor="mockCount" className="block text-sm font-semibold mb-2">
            Number of mock patients to import:
          </label>
          <input
            type="range"
            id="mockCount"
            min="1"
            max="10"
            value={mockCount}
            onChange={(e) => setMockCount(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-sm mt-1 text-gray-400">Selected: {mockCount}</p>
        </div>

        <button
          onClick={handleFetchMockPatients}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
        >
          {loading ? "Importing..." : `Import ${mockCount} Mock Patient${mockCount > 1 ? "s" : ""}`}
        </button>
 
       {/* Pagination controls */}
      <div className="mt-6 flex justify-between">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-1 px-3 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-sm text-gray-300">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-1 px-3 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div> {/* end pagination */}

{/* Patient List */}
<div className="mt-8">
  <h2 className="text-lg font-semibold mb-4">📋 FHIR Patients</h2>

  {patients.length === 0 ? (
    <p className="text-gray-400">No patients found.</p>
  ) : (
    <ul className="space-y-4">
      {patients.map((patient: any) => (
        <li key={patient._id} className="bg-gray-800 p-4 rounded shadow flex flex-col gap-1">
          <p><strong>Name:</strong> {patient.firstName} {patient.lastName}</p>
          <p><strong>Birth Date:</strong> {patient.birthDate}</p>
          <p><strong>Gender:</strong> {patient.gender}</p>
          <p className="text-sm text-gray-400"><strong>Updated:</strong> {new Date(patient.updatedAt).toLocaleString()}</p>
          <p className="text-sm text-gray-400"><strong>Updated:</strong> {new Date(patient.updatedAt).toLocaleString()}</p>
          
          <button
            onClick={() => handleDeletePatient(patient._id)}
            className="mt-2 self-start bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-3 py-1 rounded"
          >
            🗑️ Delete
          </button>
        </li>
      ))}
    </ul>
  )}
</div>


    {/* Status box */}
    {status && (
      <div className="mt-6 p-4 bg-green-100 text-green-800 rounded shadow text-sm">
        {status}
      </div>
    )}

    </div> {/* inner card container */}
    </div> //{/* outer black screen container */}

    )}
