// ✅ Slide 3 Demo Component: Shows React Context in action
// 💬 "This is the only component currently using our AppContext. We'll walk through how uploadStatus is shared and updated globally."

'use client'

import { useEffect, useState } from 'react'
import { useAppContext } from '@/context/useAppContext' // ✅ Custom Context Hook
import ReplaceTissueModal from '@/components/ReplaceTissueModel'

type Tissue = {
  _id: string
  tissueId: string
  stainedSlideId?: string
  imageUrl: string
  diagnosis?: string
  notes?: string
}

export default function TissueDashboard() {
  const [tissues, setTissues] = useState<Tissue[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTissue, setSelectedTissue] = useState<Tissue | null>(null)
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false)

  const { uploadStatus, setUploadStatus } = useAppContext() 
  // ✅ Access shared state: current status + function to update
  // 💬 "We pull in uploadStatus and setUploadStatus using useAppContext, avoiding the need to pass props between components."

  const fetchTissues = async () => {
    try {
      const res = await fetch('/api/tissue', { cache: 'no-store' })
      const data = await res.json()
      console.log('🧪 Fetched:', data)
      setTissues(data)
    } catch (err) {
      console.error('❌ Failed to fetch tissues', err)
    }
  }

  useEffect(() => {
    fetchTissues()
  }, [])

  const openReplaceModal = (tissue: Tissue) => {
    setSelectedTissue(tissue)
    setIsReplaceModalOpen(true)
  }

  const closeReplaceModal = () => {
    setSelectedTissue(null)
    setIsReplaceModalOpen(false)
  }

  const handleReplace = async (updates: Partial<Tissue>) => {
    try {
      setUploadStatus('uploading') // ✅ Global state update (in context)
      const res = await fetch('/api/tissue/replace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tissueId: selectedTissue?.tissueId, updates }),
      })

      if (!res.ok) throw new Error('Failed to replace tissue')

      await fetchTissues()
      closeReplaceModal()
      setUploadStatus('complete') // ✅ Global state update (success)
    } catch (err) {
      console.error('❌ Replace failed', err)
      setUploadStatus('error') // ✅ Global state update (error)
      alert('❌ Failed to replace tissue')
    }
  }

  const filteredTissues = tissues.filter((tissue) =>
    tissue.tissueId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-2">🧬 Tissue Dashboard</h1>
      <p className="text-sm text-gray-400 mb-6">Upload Status: {uploadStatus}</p>
      {/* ✅ Upload status dynamically reflects context value */}

      <input
        type="text"
        placeholder="Search by Tissue ID..."
        className="bg-white text-black px-4 py-2 rounded shadow mb-6"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ul className="space-y-4">
        {filteredTissues.map((tissue) => (
          <li
            key={tissue._id}
            className="border p-4 rounded-lg bg-gray-900 shadow-md"
          >
            <p><strong>ID:</strong> {tissue.tissueId}</p>
            <p><strong>Slide:</strong> {tissue.stainedSlideId || 'N/A'}</p>
            <p><strong>Diagnosis:</strong> {tissue.diagnosis || 'N/A'}</p>
            <img
              src={tissue.imageUrl}
              alt="Tissue"
              className="mt-2 rounded max-w-xs border"
            />
            <div className="mt-4">
              <button
                className="bg-yellow-600 text-white px-4 py-1 rounded hover:bg-yellow-700"
                onClick={() => openReplaceModal(tissue)}
              >
                Replace
              </button>
            </div>
          </li>
        ))}
      </ul>

      <ReplaceTissueModal
        isOpen={isReplaceModalOpen}
        tissue={selectedTissue}
        onClose={closeReplaceModal}
        onReplace={handleReplace}
      />
    </div>
  )
}
