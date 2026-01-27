'use client'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

interface Image {
  id: number;
  url: string;
  thumb: string;
}

export default function ImageUpload() {
  const { user } = useAuthStore()
  const [files, setFiles] = useState<FileList | null>(null)
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<Image[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
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
        fetchImages() // Refresh images after upload
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold">Upload Images</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(e.target.files)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          disabled={!files?.length || uploading}
          className="w-full bg-green-500 text-white p-2 rounded disabled:bg-gray-300"
        >
          {uploading ? 'Uploading...' : 'Upload Images'}
        </button>
      </form>

      <h2 className="text-2xl font-bold mt-8">Your Images</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
        {images && images.map((image) => (
          <div key={image.id} className="space-y-2">
            <a href={process.env.NEXT_PUBLIC_IMG_ENDPOINT + image.url} target="_blank" rel="noopener noreferrer">
              <img src={process.env.NEXT_PUBLIC_IMG_ENDPOINT + image.thumb} alt="Image" className="w-full h-auto" />
            </a>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="p-2 border rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="p-2 border rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
