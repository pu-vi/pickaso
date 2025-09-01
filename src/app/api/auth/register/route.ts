import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  const hashedPassword = await bcrypt.hash(password, 10)
  const passcode = Math.floor(100000 + Math.random() * 900000).toString()

  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, passcode }
    })

    await sendVerificationEmail(email, passcode)

    return NextResponse.json({
      message: 'Registration successful. Please check your email for verification code.',
      userId: user.id
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'User already exists' }, { status: 400 })
  }
}