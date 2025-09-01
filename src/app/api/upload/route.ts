import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const path = join(process.cwd(), 'public/uploads', file.name)
  await writeFile(path, buffer)

  return NextResponse.json({ 
    message: 'File uploaded successfully',
    filename: file.name,
    url: `/uploads/${file.name}`
  })
}