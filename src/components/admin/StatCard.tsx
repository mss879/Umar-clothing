import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: number
    isPositive: boolean
    label: string
  }
  className?: string
}

export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn("bg-white p-6 rounded-2xl border border-[#F0EBE1] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow", className)}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-[#FFF5F0] rounded-xl text-[#6B4E3D]">
          {icon}
        </div>
        <p className="text-sm font-semibold text-[#5B4A42]">{title}</p>
      </div>
      
      <div>
        <h3 className="text-[32px] font-bold text-[#3B302B] leading-none mb-3">{value}</h3>
        
        {trend && (
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md",
              trend.isPositive ? "text-[#2A9D8F] bg-[#2A9D8F]/10" : "text-[#E76F51] bg-[#E76F51]/10"
            )}>
              {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend.value}%
            </div>
            <span className="text-[13px] text-[#A89E96] font-medium">{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  )
}
