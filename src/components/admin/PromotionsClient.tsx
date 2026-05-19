'use client'

import { useState } from 'react'
import { DataTable } from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { PromotionForm } from '@/components/admin/PromotionForm'
import { Plus, Edit } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'

interface PromotionsClientProps {
  initialPromotions: any[]
}

export function PromotionsClient({ initialPromotions }: PromotionsClientProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedPromotion, setSelectedPromotion] = useState<any | null>(null)
  const router = useRouter()

  const columns = [
    { header: 'Title', accessor: (row: any) => <span className="font-medium text-gray-900">{row.title}</span> },
    { header: 'Code', accessor: (row: any) => <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">{row.code}</span> },
    { 
      header: 'Discount', 
      accessor: (row: any) => row.discount_type === 'percentage' ? `${row.discount_value}%` : `$${row.discount_value}`
    },
    { header: 'Start Date', accessor: (row: any) => format(new Date(row.start_date), 'MMM d, yyyy') },
    { header: 'End Date', accessor: (row: any) => row.end_date ? format(new Date(row.end_date), 'MMM d, yyyy') : '-' },
    { header: 'Status', accessor: (row: any) => <StatusBadge status={row.status} type="promotion" /> },
    { 
      header: 'Actions', 
      accessor: (row: any) => (
        <button 
          onClick={() => {
            setSelectedPromotion(row)
            setIsFormOpen(true)
          }}
          className="text-gray-500 hover:text-gray-900 transition-colors p-1"
          title="Edit promotion"
        >
          <Edit className="w-4 h-4" />
        </button>
      ) 
    },
  ]

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Promotions</h1>
        <button 
          onClick={() => {
            setSelectedPromotion(null)
            setIsFormOpen(true)
          }}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Promotion
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <DataTable
          data={initialPromotions}
          columns={columns}
          keyExtractor={(row) => row.id}
        />
      </div>

      {isFormOpen && (
        <PromotionForm 
          promotion={selectedPromotion}
          onClose={() => setIsFormOpen(false)} 
          onSave={() => router.refresh()}
        />
      )}
    </>
  )
}
