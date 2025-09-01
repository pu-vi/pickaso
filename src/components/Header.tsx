interface HeaderProps {
  onLogout: () => void
}

export default function Header({ onLogout }: HeaderProps) {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pickaso</h1>
        <button 
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </header>
  )
}