'use client'

import { useEffect, useState } from 'react'
import { useAppContext } from '@/context/useAppContext'
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

  const { uploadStatus, setUploadStatus } = useAppContext() // ✅ Context state

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
      setUploadStatus('uploading') // ✅ Start global state
      const res = await fetch('/api/tissue/replace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tissueId: selectedTissue?.tissueId, updates }),
      })

      if (!res.ok) throw new Error('Failed to replace tissue')

      await fetchTissues()
      closeReplaceModal()
      setUploadStatus('complete') // ✅ Success
    } catch (err) {
      console.error('❌ Replace failed', err)
      setUploadStatus('error') // ✅ Error state
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
            <p>
              <strong>ID:</strong> {tissue.tissueId}
            </p>
            <p>
              <strong>Slide:</strong> {tissue.stainedSlideId || 'N/A'}
            </p>
            <p>
              <strong>Diagnosis:</strong> {tissue.diagnosis || 'N/A'}
            </p>
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
