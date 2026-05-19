'use client'

import { useState } from 'react'
import { DataTable } from './DataTable'
import { Plus } from 'lucide-react'
import { CollectionForm } from './CollectionForm'
import { useRouter } from 'next/navigation'

export function CollectionsClient({ initialCollections }: { initialCollections: any[] }) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCollection, setEditingCollection] = useState<any>(null)
  const router = useRouter()

  const columns = [
    {
      header: 'Title',
      accessor: (c: any) => (
        <div className="flex items-center gap-3">
          {c.image_url ? (
            <img src={c.image_url} alt={c.title} className="w-10 h-10 rounded-md object-cover border border-gray-200" />
          ) : (
            <div className="w-10 h-10 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-400">No Img</div>
          )}
          <span className="font-medium text-gray-900">{c.title}</span>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: (c: any) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          c.collection_type === 'smart' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {c.collection_type === 'smart' ? 'Automated' : 'Manual'}
        </span>
      ),
    },
    {
      header: 'Conditions',
      accessor: (c: any) => (
        <span className="text-gray-500 text-sm">
          {c.collection_type === 'smart' 
            ? `Tag equals "${c.smart_rule_value}"` 
            : 'Manual management'}
        </span>
      ),
    },
  ]

  const handleEdit = (collection: any) => {
    setEditingCollection(collection)
    setIsFormOpen(true)
  }

  const handleSave = () => {
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Collections</h1>
          <p className="mt-1 text-sm text-gray-500">Group your products into collections.</p>
        </div>
        <button
          onClick={() => {
            setEditingCollection(null)
            setIsFormOpen(true)
          }}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create collection
        </button>
      </div>

      <DataTable 
        columns={columns}
        data={initialCollections}
        onRowClick={handleEdit}
      />

      {isFormOpen && (
        <CollectionForm
          collection={editingCollection}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
