'use client'

import { useState } from 'react'
import { DataTable } from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ProductForm } from '@/components/admin/ProductForm'
import { format } from 'date-fns'
import { Plus, Edit } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ProductsClientProps {
  initialProducts: any[]
  categories: any[]
}

export function ProductsClient({ initialProducts, categories }: ProductsClientProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const router = useRouter()

  const columns = [
    { 
      header: 'Image', 
      accessor: (row: any) => {
        const primaryImage = row.product_images?.find((img: any) => img.is_primary)?.image_url
        return primaryImage ? (
          <img src={primaryImage} alt={row.name} className="w-10 h-10 rounded-md object-cover border border-gray-200" />
        ) : (
          <div className="w-10 h-10 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs">
            No img
          </div>
        )
      }
    },
    { header: 'Product', accessor: (row: any) => <span className="font-medium text-gray-900">{row.name}</span> },
    { header: 'Category', accessor: (row: any) => row.categories?.name || '-' },
    { header: 'Price', accessor: (row: any) => `$${Number(row.price).toFixed(2)}` },
    { header: 'Status', accessor: (row: any) => <StatusBadge status={row.status} type="product" /> },
    { header: 'Created', accessor: (row: any) => format(new Date(row.created_at), 'MMM d, yyyy') },
    { 
      header: 'Actions', 
      accessor: (row: any) => (
        <button 
          onClick={() => {
            setSelectedProduct(row)
            setIsFormOpen(true)
          }}
          className="text-gray-500 hover:text-gray-900 transition-colors p-1"
          title="Edit product"
        >
          <Edit className="w-4 h-4" />
        </button>
      ) 
    },
  ]

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <button 
          onClick={() => {
            setSelectedProduct(null)
            setIsFormOpen(true)
          }}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <DataTable
          data={initialProducts}
          columns={columns}
          keyExtractor={(row) => row.id}
        />
      </div>

      {isFormOpen && (
        <ProductForm 
          product={selectedProduct}
          categories={categories}
          onClose={() => setIsFormOpen(false)} 
          onSave={() => router.refresh()}
        />
      )}
    </>
  )
}
