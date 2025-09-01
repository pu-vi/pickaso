'use client'
import { useState } from 'react'
import AuthForm from '@/components/AuthForm'
import ImageUpload from '@/components/ImageUpload'

export default function Home() {
  const [token, setToken] = useState<string | null>(null)

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Pickaso</h1>
        
        {!token ? (
          <AuthForm onAuth={setToken} />
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <p className="text-green-600 mb-4">Welcome! You are logged in.</p>
              <button 
                onClick={() => setToken(null)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
            <ImageUpload />
          </div>
        )}
      </div>
    </div>
  )
}