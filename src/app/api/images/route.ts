import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  // TODO: Get user from session
  const userId = 1

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = 10
  const offset = (page - 1) * limit

  try {
    const images = await db.image.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    const totalImages = await db.image.count({
      where: {
        userId: userId
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
