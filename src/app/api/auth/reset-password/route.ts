import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  const { email, passcode, newPassword } = await request.json()

  if (!passcode && !newPassword) {
    // Send reset code
    const user = await prisma.user.findUnique({ where: { email } })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    await prisma.user.update({
      where: { email },
      data: { passcode: resetCode }
    })

    await sendPasswordResetEmail(email, resetCode)
    
    return NextResponse.json({ message: 'Reset code sent to your email' })
  } else {
    // Reset password
    const user = await prisma.user.findUnique({ where: { email } })
    
    if (!user || user.passcode !== passcode) {
      return NextResponse.json({ error: 'Invalid reset code' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword, passcode: null }
    })

    return NextResponse.json({ message: 'Password reset successfully' })
  }
}