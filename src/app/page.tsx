import ImageUpload from '@/components/ImageUpload'

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Pickaso</h1>
          <ImageUpload />
        </div>
      </div>
    </div>
  )
}
