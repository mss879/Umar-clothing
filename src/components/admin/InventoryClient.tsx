'use client'

import { useState } from 'react'
import { DataTable } from '@/components/admin/DataTable'
import { InventoryForm } from '@/components/admin/InventoryForm'
import { Plus, Edit } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface InventoryClientProps {
  initialInventory: any[]
  products: any[]
}

export function InventoryClient({ initialInventory, products }: InventoryClientProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedInventory, setSelectedInventory] = useState<any | null>(null)
  const router = useRouter()

  const columns = [
    { header: 'Product', accessor: (row: any) => <span className="font-medium text-gray-900">{row.products?.name}</span> },
    { header: 'Size', accessor: (row: any) => row.size || '-' },
    { header: 'Color', accessor: (row: any) => row.color || '-' },
    { header: 'Stock', accessor: 'stock_quantity' },
    { header: 'Low Limit', accessor: 'low_stock_limit' },
    { 
      header: 'Status', 
      accessor: (row: any) => {
        let status = 'In Stock'
        let bg = 'bg-green-100'
        let text = 'text-green-800'

        if (row.stock_quantity === 0) {
          status = 'Out of Stock'
          bg = 'bg-red-100'
          text = 'text-red-800'
        } else if (row.stock_quantity <= row.low_stock_limit) {
          status = 'Low Stock'
          bg = 'bg-yellow-100'
          text = 'text-yellow-800'
        }

        return (
          <span className={cn("px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap", bg, text)}>
            {status}
          </span>
        )
      }
    },
    { 
      header: 'Actions', 
      accessor: (row: any) => (
        <button 
          onClick={() => {
            setSelectedInventory(row)
            setIsFormOpen(true)
          }}
          className="text-gray-500 hover:text-gray-900 transition-colors p-1"
          title="Edit inventory"
        >
          <Edit className="w-4 h-4" />
        </button>
      ) 
    },
  ]

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
        <button 
          onClick={() => {
            setSelectedInventory(null)
            setIsFormOpen(true)
          }}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Inventory
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <DataTable
          data={initialInventory}
          columns={columns}
          keyExtractor={(row) => row.id}
        />
      </div>

      {isFormOpen && (
        <InventoryForm 
          inventory={selectedInventory}
          products={products}
          onClose={() => setIsFormOpen(false)} 
          onSave={() => router.refresh()}
        />
      )}
    </>
  )
}
