'use client'
import { useState } from 'react'

export default function ImageUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState('')

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    const endpoint = process.env.NEXT_PUBLIC_UPLOAD_ENDPOINT || '/api/upload'
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData
      })
      
      const data = await res.json()
      if (data.url) setUploadedUrl(data.url)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold">Upload Image</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          disabled={!file || uploading}
          className="w-full bg-green-500 text-white p-2 rounded disabled:bg-gray-300"
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>
      {uploadedUrl && (
        <div className="mt-4">
          <p className="text-green-600">Upload successful!</p>
          <img src={uploadedUrl} alt="Uploaded" className="max-w-full h-auto mt-2" />
        </div>
      )}
    </div>
  )
}