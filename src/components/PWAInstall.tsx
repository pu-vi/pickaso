'use client'
import { useState, useEffect } from 'react'

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstall, setShowInstall] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setShowInstall(false)
    }
    setDeferredPrompt(null)
  }

  if (!showInstall) return null

  return (
    <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
      <p className="mb-2">Install Pickaso app?</p>
      <div className="flex space-x-2">
        <button 
          onClick={handleInstall}
          className="bg-white text-blue-600 px-3 py-1 rounded text-sm"
        >
          Install
        </button>
        <button 
          onClick={() => setShowInstall(false)}
          className="bg-gray-500 px-3 py-1 rounded text-sm"
        >
          Later
        </button>
      </div>
    </div>
  )
}