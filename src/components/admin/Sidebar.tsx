'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Archive, 
  Tag, 
  Users,
  Layers,
  LogOut,
  Coffee
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Collections', href: '/admin/collections', icon: Layers },
  { name: 'Inventory', href: '/admin/inventory', icon: Archive },
  { name: 'Promotions', href: '/admin/promotions', icon: Tag },
  { name: 'Customers', href: '/admin/customers', icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="w-64 bg-[#FAF8F5] hidden md:flex flex-col min-h-screen py-6 px-4">
      <div className="flex items-center gap-3 px-4 mb-10">
        <div className="bg-[#6B4E3D] p-2 rounded-full text-white">
          <Coffee className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold text-[#6B4E3D] tracking-tight">Umar <span className="font-medium text-[#8C7A6B]">Admin</span></h1>
      </div>
      
      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200",
                isActive 
                  ? "bg-[#6B4E3D] text-white shadow-md shadow-[#6B4E3D]/20" 
                  : "text-[#7A706A] hover:bg-[#F0EBE1] hover:text-[#4A3525]"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-white/90" : "text-[#A89E96]")} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-6">
        <button 
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium bg-[#FFF0F0] text-[#D32F2F] hover:bg-[#FFE5E5] transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}
