'use client'
import { useAuthStore } from '@/store/authStore'
import GoogleAuth from './GoogleAuth'

interface AuthWrapperProps {
  children: React.ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <GoogleAuth />
  }

  return <>{children}</>
}