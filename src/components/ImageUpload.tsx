'use client'
import { useState } from 'react'

export default function ImageUpload() {
  const [files, setFiles] = useState<FileList | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])

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
        body: formData
      })

      const data = await res.json()
      if (data.uploaded) setUploadedFiles(data.uploaded)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4 max-w-md mx-auto">
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
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <p className="text-green-600">Upload successful!</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="space-y-2">
                <img src={`https://pik.s4v.my${file.thumb}`} alt="Thumbnail" className="w-full h-auto" />
                <p className="text-xs text-gray-600">{file.image}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}