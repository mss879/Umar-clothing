import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  type?: 'product' | 'order' | 'payment' | 'delivery' | 'promotion'
}

export function StatusBadge({ status, type = 'product' }: StatusBadgeProps) {
  let bg = "bg-gray-100"
  let text = "text-gray-700"

  const normalized = status.toLowerCase()

  if (type === 'product' || type === 'promotion') {
    if (normalized === 'active') { bg = "bg-green-100"; text = "text-green-800" }
    else if (normalized === 'draft' || normalized === 'inactive') { bg = "bg-gray-100"; text = "text-gray-800" }
    else if (normalized === 'out_of_stock' || normalized === 'expired') { bg = "bg-red-100"; text = "text-red-800" }
    else if (normalized === 'archived') { bg = "bg-yellow-100"; text = "text-yellow-800" }
  } else if (type === 'order') {
    if (normalized === 'delivered' || normalized === 'confirmed') { bg = "bg-green-100"; text = "text-green-800" }
    else if (normalized === 'pending') { bg = "bg-yellow-100"; text = "text-yellow-800" }
    else if (normalized === 'processing' || normalized === 'shipped') { bg = "bg-blue-100"; text = "text-blue-800" }
    else if (normalized === 'cancelled') { bg = "bg-red-100"; text = "text-red-800" }
  } else if (type === 'payment') {
    if (normalized === 'paid') { bg = "bg-green-100"; text = "text-green-800" }
    else if (normalized === 'pending') { bg = "bg-yellow-100"; text = "text-yellow-800" }
    else if (normalized === 'failed' || normalized === 'refunded') { bg = "bg-red-100"; text = "text-red-800" }
  }

  // Format text (e.g., out_of_stock -> Out of stock)
  const formattedText = status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  return (
    <span className={cn("px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap", bg, text)}>
      {formattedText}
    </span>
  )
}
