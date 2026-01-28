import { NextRequest, NextResponse } from 'next/server'
import { prisma as db } from '@/lib/db'

export async function POST(request: NextRequest) {
  const userEmail = request.headers.get('x-user-email')
  const userSub = request.headers.get('x-user-sub')
  
  if (!userEmail || !userSub) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { imageId } = await request.json()

  if (!imageId) {
    return NextResponse.json({ error: 'Image ID required' }, { status: 400 })
  }

  try {
    const image = await db.image.findFirst({
      where: {
        id: imageId,
        email: userEmail,
        sub: userSub,
        active: true
      }
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    await db.image.update({
      where: { id: imageId },
      data: { active: false }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}