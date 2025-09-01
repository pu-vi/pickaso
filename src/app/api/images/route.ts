import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma as db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let userId: number
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as { userId: number }
    userId = decoded.userId
  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

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
