'use client'
import { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/authStore'
import Lightbox from './Lightbox'

interface Image {
  id: number;
  url: string;
  thumb: string;
}

export default function ImageUpload() {
  const { user } = useAuthStore()
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<Image[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedImage, setSelectedImage] = useState<Image | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const fetchImages = async () => {
    try {
      const res = await fetch(`/api/images?page=${page}`, {
        headers: {
          'x-user-email': user?.email || '',
          'x-user-sub': user?.sub || ''
        }
      })
      const data = await res.json()
      setImages(data.images || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('Error fetching images:', error)
      setImages([])
      setTotalPages(1)
    }
  }

  useEffect(() => {
    fetchImages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const handleFileUpload = async (files: FileList | null) => {
    if (!files?.length) return

    setUploading(true)
    const formData = new FormData()

    Array.from(files).forEach(file => {
      formData.append('images', file)
    })

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'x-user-email': user?.email || '',
          'x-user-sub': user?.sub || ''
        },
        body: formData
      })

      if (res.ok) {
        fetchImages()
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => cameraInputRef.current?.click()}
          disabled={uploading}
          className="bg-green-500 text-white p-4 rounded-lg flex flex-col items-center space-y-2 disabled:bg-gray-300"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-medium">Take Photo</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-blue-500 text-white p-4 rounded-lg flex flex-col items-center space-y-2 disabled:bg-gray-300"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium">Gallery</span>
        </button>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        onChange={(e) => handleFileUpload(e.target.files)}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFileUpload(e.target.files)}
        className="hidden"
      />

      {/* Upload Status */}
      {uploading && (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            <span className="text-white">Uploading images...</span>
          </div>
          <div className="mt-3 bg-gray-700 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
        </div>
      )}

      {/* Images Grid */}
      <div className="grid grid-cols-2 gap-2">
        {images && images.map((image) => (
          <div key={image.id} className="aspect-square">
            <button
              onClick={() => setSelectedImage(image)}
              className="w-full h-full"
            >
              <img 
                src={process.env.NEXT_PUBLIC_IMG_ENDPOINT + image.thumb} 
                alt="Image" 
                className="w-full h-full object-cover rounded-lg"
              />
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-4 pt-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:bg-gray-100 disabled:text-gray-400"
          >
            Previous
          </button>
          <span className="px-4 py-2">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:bg-gray-100 disabled:text-gray-400"
          >
            Next
          </button>
        </div>
      )}
      {/* Lightbox */}
      {selectedImage && (
        <Lightbox 
          image={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </div>
  )
}