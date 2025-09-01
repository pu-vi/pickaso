import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword }
    })
    return NextResponse.json({ id: user.id, email: user.email })
  } catch (error) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 })
  }
}