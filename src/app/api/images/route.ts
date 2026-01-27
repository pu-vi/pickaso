import { NextRequest, NextResponse } from 'next/server'
import { prisma as db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const userEmail = request.headers.get('x-user-email')
  const userSub = request.headers.get('x-user-sub')
  
  if (!userEmail || !userSub) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = 10
  const offset = (page - 1) * limit

  try {
    const images = await db.image.findMany({
      where: {
        email: userEmail,
        sub: userSub
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    const totalImages = await db.image.count({
      where: {
        email: userEmail,
        sub: userSub
      }
    })

    return NextResponse.json({
      images,
      totalPages: Math.ceil(totalImages / limit)
    })
  } catch (error) {
    console.error('Error fetching images:', error)
    return NextResponse.json({ error: 'Error fetching images' }, { status: 500 })
  }
}