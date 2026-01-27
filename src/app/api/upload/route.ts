import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { randomBytes } from 'crypto'
import { prisma as db } from '@/lib/db'

export async function POST(request: NextRequest) {
  const userEmail = request.headers.get('x-user-email')
  const userSub = request.headers.get('x-user-sub')
  
  console.log('Headers received:', { userEmail, userSub })
  
  if (!userEmail) {
    console.log('Missing userEmail header')
    return NextResponse.json({ error: 'Unauthorized - missing email' }, { status: 401 })
  }
  
  if (!userSub) {
    console.log('Missing userSub header')
    return NextResponse.json({ error: 'Unauthorized - missing sub' }, { status: 401 })
  }

  const formData = await request.formData()
  const files = formData.getAll('images') as File[]

  if (!files.length) {
    return NextResponse.json({ error: 'No images provided' }, { status: 400 })
  }

  try {
    const results = []

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const ext = file.name.split('.').pop() || 'jpg'
      const randomName = `${randomBytes(16).toString('hex')}.${ext}`
      
      // Generate thumbnail
      const thumbBuffer = await sharp(buffer)
        .resize(200, 200, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toBuffer()
      
      // Create form data for external upload
      const uploadFormData = new FormData()
      uploadFormData.append('sub', userSub)
      uploadFormData.append('image', new Blob([new Uint8Array(buffer)], { type: file.type }), randomName)
      uploadFormData.append('thumbnail', new Blob([new Uint8Array(thumbBuffer)], { type: 'image/jpeg' }), randomName)

      const response = await fetch(process.env.NEXT_PUBLIC_UPLOAD_ENDPOINT!, {
        method: 'POST',
        body: uploadFormData
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        // Save to database
        const dbImage = await db.image.create({
          data: {
            url: data.original,
            thumb: data.thumbnail,
            title: file.name,
            email: userEmail,
            sub: userSub
          }
        })
        results.push(dbImage)
      }
    }

    return NextResponse.json({ success: true, uploaded: results })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}