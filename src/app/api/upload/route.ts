import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const file: File | null = data.get('fileToUpload') as unknown as File
  const directory = data.get('directory') as string

  if (!directory) {
    return NextResponse.json({ error: 'Directory name is required.' }, { status: 400 })
  }

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 })
  }

  const targetDir = join(process.cwd(), 'public', directory)
  
  try {
    await mkdir(targetDir, { recursive: true })
  } catch (error) {
    return NextResponse.json({ error: `Failed to create directory: ${directory}` }, { status: 500 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const targetFile = join(targetDir, file.name)

  try {
    await writeFile(targetFile, buffer)
    return NextResponse.json({ 
      message: 'File uploaded successfully.',
      file: `${directory}/${file.name}`
    })
  } catch (error) {
    return NextResponse.json({ error: 'There was an error uploading the file.' }, { status: 500 })
  }
}