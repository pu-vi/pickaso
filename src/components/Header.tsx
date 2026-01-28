'use client'
import { useAuthStore } from '@/store/authStore'

export default function Header() {
  const { user, logout } = useAuthStore()

  return (
    <header className="bg-blue-600 text-white p-3 sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Pickaso</h1>
        <div className="flex items-center space-x-2">
          <img src={user?.picture} alt={user?.name} className="w-6 h-6 rounded-full" />
          <button 
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}