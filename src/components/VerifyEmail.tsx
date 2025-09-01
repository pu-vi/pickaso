'use client'
import { useState } from 'react'

interface VerifyEmailProps {
  email: string
  onVerified: () => void
  onNotify: (message: string, type: 'success' | 'error') => void
}

export default function VerifyEmail({ email, onVerified, onNotify }: VerifyEmailProps) {
  const [passcode, setPasscode] = useState('')

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const res = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, passcode })
    })
    
    const data = await res.json()
    if (res.ok) {
      onNotify('Email verified successfully!', 'success')
      onVerified()
    } else {
      onNotify(data.error, 'error')
    }
  }

  return (
    <form onSubmit={handleVerify} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold">Verify Email</h2>
      <p className="text-gray-600">Enter the verification code sent to {email}</p>
      <input
        type="text"
        placeholder="Verification Code"
        value={passcode}
        onChange={(e) => setPasscode(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        Verify Email
      </button>
    </form>
  )
}