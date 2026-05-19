'use client'

import { useState } from 'react'
import { X, Loader2, Trash2, Box, Hash, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface InventoryFormProps {
  inventory?: any
  products: any[]
  onClose: () => void
  onSave: () => void
}

export function InventoryForm({ inventory, products, onClose, onSave }: InventoryFormProps) {
  const isEditing = !!inventory
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    product_id: inventory?.product_id || '',
    size: inventory?.size || '',
    color: inventory?.color || '',
    stock_quantity: inventory?.stock_quantity ?? 0,
    low_stock_limit: inventory?.low_stock_limit ?? 5,
  })
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (isEditing) {
        const { error } = await (supabase as any)
          .from('inventory')
          .update({
            product_id: formData.product_id,
            size: formData.size || null,
            color: formData.color || null,
            stock_quantity: Number(formData.stock_quantity),
            low_stock_limit: Number(formData.low_stock_limit),
          })
          .eq('id', inventory.id)
        if (error) throw error
      } else {
        const { error } = await (supabase as any)
          .from('inventory')
          .insert({
            product_id: formData.product_id,
            size: formData.size || null,
            color: formData.color || null,
            stock_quantity: Number(formData.stock_quantity),
            low_stock_limit: Number(formData.low_stock_limit),
          })
        if (error) throw error
      }

      onSave()
      onClose()
    } catch (error: any) {
      alert('Error saving inventory: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this inventory record?')) return
    setIsSaving(true)
    try {
      const { error } = await supabase.from('inventory').delete().eq('id', inventory.id)
      if (error) throw error
      onSave()
      onClose()
    } catch (error: any) {
      alert('Error deleting inventory: ' + error.message)
      setIsSaving(false)
    }
  }

  const Card = ({ children, title, icon: Icon }: { children: React.ReactNode, title?: string, icon?: any }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      {title && (
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-gray-500" />}
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#f4f6f8] rounded-2xl shadow-2xl w-full max-w-3xl h-[90vh] flex flex-col overflow-hidden ring-1 ring-white/10">
        
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Inventory' : 'Add Inventory'}</h2>
          </div>
          
          <div className="flex items-center gap-3">
            {isEditing && (
              <button 
                type="button"
                onClick={handleDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Inventory"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={handleSubmit}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-all disabled:opacity-70 shadow-sm"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Inventory
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            
            <Card title="Product Selection" icon={Box}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Link to Product</label>
              <select 
                required
                value={formData.product_id}
                onChange={e => setFormData({...formData, product_id: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow text-gray-900"
              >
                <option value="">Select a product...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </Card>

            <Card title="Variant Details" icon={Hash}>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Size</label>
                  <input 
                    type="text" 
                    placeholder="e.g., S, M, L, XL"
                    value={formData.size}
                    onChange={e => setFormData({...formData, size: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow placeholder-gray-400 text-gray-900" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Color</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Red, Blue"
                    value={formData.color}
                    onChange={e => setFormData({...formData, color: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow placeholder-gray-400 text-gray-900" 
                  />
                </div>
              </div>
            </Card>

            <Card title="Stock Tracking" icon={AlertTriangle}>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Available Stock</label>
                  <input 
                    required
                    type="number" 
                    min="0"
                    placeholder="0"
                    value={formData.stock_quantity}
                    onChange={e => setFormData({...formData, stock_quantity: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow placeholder-gray-400 text-gray-900" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Low Stock Limit</label>
                  <input 
                    required
                    type="number" 
                    min="0"
                    placeholder="5"
                    value={formData.low_stock_limit}
                    onChange={e => setFormData({...formData, low_stock_limit: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow placeholder-gray-400 text-gray-900 bg-amber-50/50" 
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                You will be alerted on the dashboard when Available Stock falls below the Low Stock Limit.
              </p>
            </Card>

          </div>
        </div>

      </div>
    </div>
  )
}
