'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ShoppingBag, User, X, Menu } from 'lucide-react'

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 py-4 text-gray-900 transition-transform duration-300">
        <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between">
          
          {/* Mobile Menu Icon */}
          <button className="md:hidden p-2 -ml-2 text-gray-900 transition-colors hover:text-gray-500">
            <Menu className="w-5 h-5" />
          </button>

          {/* Left Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-widest uppercase">
            <Link href="/collections/mens" className="hover:text-gray-500 transition-colors">Mens</Link>
            <Link href="/collections/womens" className="hover:text-gray-500 transition-colors">Womens</Link>
            <Link href="/collections/new-arrivals" className="hover:text-gray-500 transition-colors">New In</Link>
          </nav>
          
          {/* Center Brand */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="text-2xl font-bold tracking-tighter uppercase select-none">
              Novure
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-5">
            <button 
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 hover:text-gray-500 transition-colors group"
            >
              <Search className="w-5 h-5" />
              <span className="text-xs font-semibold tracking-widest uppercase hidden lg:block group-hover:underline underline-offset-4">Search</span>
            </button>
            <Link href="/account" className="hover:text-gray-500 transition-colors hidden sm:block">
              <User className="w-5 h-5" />
            </Link>
            <Link href="/cart" className="relative hover:text-gray-500 transition-colors flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1.5 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center bg-gray-900 text-white transition-colors">
                0
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Fullscreen Search Overlay */}
      <div 
        className={`fixed inset-0 bg-white z-[60] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col ${
          searchOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-[1600px] w-full mx-auto px-6 py-8 flex items-center justify-between border-b border-gray-100">
          <form className="flex-1 flex items-center gap-4 max-w-3xl">
            <Search className="w-6 h-6 text-gray-400" />
            <input 
              type="text" 
              placeholder="What are you looking for?" 
              className="w-full text-2xl md:text-4xl font-medium outline-none placeholder:text-gray-300 text-gray-900 bg-transparent"
              autoFocus={searchOpen}
            />
          </form>
          <button 
            onClick={() => setSearchOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-8"
          >
            <X className="w-8 h-8 text-gray-900" />
          </button>
        </div>
        
        {/* Search Suggestions Area */}
        <div className="flex-1 overflow-y-auto max-w-[1600px] w-full mx-auto px-6 py-12 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-6">Popular Searches</h4>
              <ul className="flex flex-col gap-4 text-xl md:text-2xl font-medium text-gray-900">
                <li><Link href="/search?q=t-shirts" className="hover:text-gray-500 transition-colors">Classic T-Shirts</Link></li>
                <li><Link href="/search?q=outerwear" className="hover:text-gray-500 transition-colors">Heavy Outerwear</Link></li>
                <li><Link href="/search?q=accessories" className="hover:text-gray-500 transition-colors">Everyday Accessories</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
