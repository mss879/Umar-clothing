import { ChevronDown, Search, X } from 'lucide-react'

export function FilterBar() {
  return (
    <div className="w-full px-6 py-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-t border-gray-200 mt-12">
      <div className="flex flex-col gap-4 flex-1">
        <h3 className="text-3xl font-medium tracking-tight">Filter by</h3>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Category Dropdown */}
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors">
            Category
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          
          {/* Size Dropdown */}
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors">
            Size
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          
          {/* Active Chip */}
          <div className="flex items-center gap-2 px-1 pl-3 py-1 rounded-full bg-gray-900 text-white text-sm font-medium">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              Amber.
            </span>
            <button className="p-1.5 hover:bg-gray-800 rounded-full bg-black ml-1 transition-colors">
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Price Dropdown */}
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors">
            Price
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full md:w-auto">
        <h3 className="text-3xl font-medium tracking-tight md:text-right hidden md:block">Search</h3>
        <div className="relative w-full md:w-[300px]">
          <input 
            type="text" 
            placeholder="search" 
            className="w-full bg-white border border-gray-200 rounded-full px-5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder:text-gray-400"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  )
}
