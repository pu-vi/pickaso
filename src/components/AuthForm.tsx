'use client'
import { useState } from 'react'

interface AuthFormProps {
  onAuth: (token: string) => void
}

export default function AuthForm({ onAuth }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
    
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    const data = await res.json()
    if (data.token) onAuth(data.token)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold">{isLogin ? 'Login' : 'Register'}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        {isLogin ? 'Login' : 'Register'}
      </button>
      <button
        type="button"
        onClick={() => setIsLogin(!isLogin)}
        className="w-full text-blue-500"
      >
        {isLogin ? 'Need to register?' : 'Already have an account?'}
      </button>
    </form>
  )
}