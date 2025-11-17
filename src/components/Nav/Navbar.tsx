import { Bell, ChevronDown, Plus, User } from 'lucide-react';

export default function Navbar() {

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-4">
            <div className="font-bold text-xl text-blue-600">JiraClone</div>
          </div>
          <div className="flex-1 mx-4">
            <input
              type="text"
              placeholder="Search issues, projects..."
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded hover:bg-gray-100">
              <Plus className="w-5 h-5 text-gray-700" />
            </button>

            <button className="p-2 rounded hover:bg-gray-100 relative">
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Avatar */}
            <div className="relative">
              <button className="flex items-center gap-2 border rounded-full px-2 py-1 hover:bg-gray-100">
                <User className="w-5 h-5 text-gray-700" />
                <span className="text-sm text-gray-700">Rishabh</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
