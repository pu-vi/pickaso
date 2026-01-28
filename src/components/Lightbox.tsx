'use client'
import { useState } from 'react'

interface LightboxProps {
  image: {
    id: number
    url: string
    thumb: string
  }
  onClose: () => void
  onDelete: (imageId: number) => void
}

export default function Lightbox({ image, onClose, onDelete }: LightboxProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this image?')) return
    
    setDeleting(true)
    try {
      const res = await fetch('/api/images/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageId: image.id })
      })
      
      if (res.ok) {
        onDelete(image.id)
        onClose()
      }
    } catch (error) {
      console.error('Delete failed:', error)
    } finally {
      setDeleting(false)
    }
  }

  const fullImageUrl = process.env.NEXT_PUBLIC_IMG_ENDPOINT + image.url
  const thumbUrl = process.env.NEXT_PUBLIC_IMG_ENDPOINT + image.thumb

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center p-4 sticky top-0 bg-black bg-opacity-50">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 disabled:bg-gray-500"
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
        <button
          onClick={onClose}
          className="text-white text-2xl hover:text-gray-300"
        >
          ×
        </button>
      </div>

      {/* Image */}
      <div className="flex-1 flex items-center justify-center p-4 min-h-0">
        <img
          src={fullImageUrl}
          alt="Full size"
          className="max-w-full max-h-[70vh] object-contain"
        />
      </div>

      {/* URL Section */}
      <div className="bg-gray-800 p-4 space-y-3 mt-auto">
        {/* Full Image URL */}
        <div>
          <label className="text-white text-sm block mb-1">Full Image URL:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={fullImageUrl}
              readOnly
              className="flex-1 bg-gray-700 text-white p-2 rounded text-sm"
            />
            <button
              onClick={() => copyToClipboard(fullImageUrl, 'full')}
              className="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
            >
              {copied === 'full' ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Thumbnail URL */}
        <div>
          <label className="text-white text-sm block mb-1">Thumbnail URL:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={thumbUrl}
              readOnly
              className="flex-1 bg-gray-700 text-white p-2 rounded text-sm"
            />
            <button
              onClick={() => copyToClipboard(thumbUrl, 'thumb')}
              className="bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600"
            >
              {copied === 'thumb' ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}