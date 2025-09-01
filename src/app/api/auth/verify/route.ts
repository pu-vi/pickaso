import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  const { email, passcode } = await request.json()

  const user = await prisma.user.findUnique({ where: { email } })
  
  if (!user || user.passcode !== passcode) {
    return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
  }

  await prisma.user.update({
    where: { email },
    data: { emailVerified: true, passcode: null }
  })

  return NextResponse.json({ message: 'Email verified successfully' })
}