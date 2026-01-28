'use client'
import AuthWrapper from '@/components/AuthWrapper'
import Header from '@/components/Header'
import ImageUpload from '@/components/ImageUpload'

export default function Home() {
  return (
    <AuthWrapper>
      <div className="min-h-screen">
        <Header />
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <ImageUpload />
          </div>
        </div>
      </div>
    </AuthWrapper>
  )
}