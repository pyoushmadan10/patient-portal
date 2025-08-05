import { FileHeart } from "lucide-react"

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <FileHeart className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Patient Document Portal</h1>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
