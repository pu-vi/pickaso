'use client'
import { useAuthStore } from '@/store/authStore'

export default function Header() {
  const { user, logout } = useAuthStore()

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pickaso</h1>
        <div className="flex items-center space-x-4">
          <img src={user?.picture} alt={user?.name} className="w-8 h-8 rounded-full" />
          <span>{user?.email}</span>
          <button 
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}