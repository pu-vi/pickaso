import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  const user = await prisma.user.findUnique({ where: { email } })
  
  if (!user || !await bcrypt.compare(password, user.password)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = jwt.sign({ userId: user.id }, process.env.NEXTAUTH_SECRET!)
  
  return NextResponse.json({ token, user: { id: user.id, email: user.email } })
}