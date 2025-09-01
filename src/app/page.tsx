'use client'
import { useState } from 'react'
import AuthForm from '@/components/AuthForm'
import ImageUpload from '@/components/ImageUpload'
import Header from '@/components/Header'
import Toast from '@/components/Toast'
import VerifyEmail from '@/components/VerifyEmail'

export default function Home() {
  const [token, setToken] = useState<string | null>(null)
  const [needsVerification, setNeedsVerification] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const handleNotify = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
  }

  const handleLogout = () => {
    setToken(null)
    handleNotify('Logged out successfully', 'success')
  }

  const handleVerified = () => {
    setNeedsVerification(null)
  }

  return (
    <div className="min-h-screen">
      {token && <Header onLogout={handleLogout} />}
      
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          {token ? (
            <ImageUpload token={token} />
          ) : needsVerification ? (
            <VerifyEmail 
              email={needsVerification} 
              onVerified={handleVerified} 
              onNotify={handleNotify} 
            />
          ) : (
            <>
              <h1 className="text-4xl font-bold text-center mb-8">Pickaso</h1>
              <AuthForm 
                onAuth={setToken} 
                onNotify={handleNotify} 
                onNeedVerification={setNeedsVerification}
              />
            </>
          )}
        </div>
      </div>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  )
}