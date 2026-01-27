import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { randomBytes } from 'crypto'
import { prisma as db } from '@/lib/db'

export async function POST(request: NextRequest) {
  const userEmail = request.headers.get('x-user-email')
  
  if (!userEmail) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const files = formData.getAll('images') as File[]

  if (!files.length) {
    return NextResponse.json({ error: 'No images provided' }, { status: 400 })
  }

  try {
    const uploadFormData = new FormData()

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const buffer = Buffer.from(await file.arrayBuffer())
      const ext = file.name.split('.').pop() || 'jpg'
      const randomName = `${randomBytes(16).toString('hex')}.${ext}`

      // Generate thumbnail
      const thumbBuffer = await sharp(buffer)
        .resize(200, 200, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toBuffer()

      // Create blobs for upload
      const imageBlob = new Blob([new Uint8Array(buffer)], { type: file.type })
      const thumbBlob = new Blob([new Uint8Array(thumbBuffer)], { type: 'image/jpeg' })

      uploadFormData.append('images[]', imageBlob, randomName)
      uploadFormData.append('thumbs[]', thumbBlob, randomName)
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_IMG_ENDPOINT!}/imgup.php`, {
      method: 'POST',
      body: uploadFormData
    })

    const data = await response.json()

    if (response.ok && data.uploaded) {
      for (const image of data.uploaded) {
        await db.image.create({
          data: {
            url: image.image,
            thumb: image.thumb,
            userEmail: userEmail
          }
        })
      }
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}