'use client'
import AuthWrapper from '@/components/AuthWrapper'
import Header from '@/components/Header'
import ImageUpload from '@/components/ImageUpload'
import PWAInstall from '@/components/PWAInstall'

export default function Home() {
  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="p-4 max-w-md mx-auto">
          <ImageUpload />
        </div>
        <PWAInstall />
      </div>
    </AuthWrapper>
  )
}