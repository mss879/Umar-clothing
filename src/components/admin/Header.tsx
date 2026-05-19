'use client'

import { Search, Bell, MessageSquare, Menu } from 'lucide-react'

export function Header() {
  return (
    <header className="h-20 bg-white border-b border-[#F0EBE1] flex items-center justify-between px-6 lg:px-10 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <button className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md">
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="hidden md:flex items-center">
          <h2 className="text-[22px] font-bold text-[#3B302B]">Dashboard</h2>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="hidden lg:flex items-center bg-[#F9F7F4] border border-[#EBE5DB] rounded-full px-4 py-2 w-72 transition-colors focus-within:bg-white focus-within:border-[#D0C5B5] focus-within:ring-2 focus-within:ring-[#6B4E3D]/10">
          <Search className="w-4 h-4 text-[#A89E96] mr-2" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full text-[#5B4A42] placeholder:text-[#A89E96]"
          />
          <div className="text-xs font-medium text-[#A89E96] ml-2 flex gap-1">
            <span className="bg-white border border-[#EBE5DB] rounded px-1.5 py-0.5">⌘</span>
            <span className="bg-white border border-[#EBE5DB] rounded px-1.5 py-0.5">S</span>
          </div>
        </div>

        <div className="h-8 w-px bg-[#EBE5DB] hidden md:block"></div>

        {/* Action Icons */}
        <div className="flex items-center gap-3">
          <button className="p-2 text-[#7A706A] hover:bg-[#F9F7F4] rounded-full transition-colors relative">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button className="p-2 text-[#7A706A] hover:bg-[#F9F7F4] rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E76F51] rounded-full border border-white"></span>
          </button>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-2">
          <div className="w-10 h-10 rounded-full bg-[#EBE5DB] overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
            <img 
              src="https://api.dicebear.com/7.x/notionists/svg?seed=Admin&backgroundColor=F0EBE1" 
              alt="Admin Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-[#3B302B] leading-tight">Admin User</p>
            <p className="text-xs text-[#8C7A6B]">Store Manager</p>
          </div>
        </div>
      </div>
    </header>
  )
}
