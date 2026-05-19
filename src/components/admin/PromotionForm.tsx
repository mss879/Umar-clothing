'use client'

import { useState } from 'react'
import { X, Loader2, Trash2, Tag, Calendar, Percent } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface PromotionFormProps {
  promotion?: any
  onClose: () => void
  onSave: () => void
}

export function PromotionForm({ promotion, onClose, onSave }: PromotionFormProps) {
  const isEditing = !!promotion
  const [isSaving, setIsSaving] = useState(false)
  
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const offset = date.getTimezoneOffset()
    date.setMinutes(date.getMinutes() - offset)
    return date.toISOString().slice(0, 16)
  }

  const [formData, setFormData] = useState({
    title: promotion?.title || '',
    code: promotion?.code || '',
    discount_type: promotion?.discount_type || 'percentage',
    discount_value: promotion?.discount_value || '',
    start_date: formatDateForInput(promotion?.start_date),
    end_date: formatDateForInput(promotion?.end_date) || '',
    status: promotion?.status || 'active',
  })
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const dataToSave = {
        title: formData.title,
        code: formData.code.toUpperCase(),
        discount_type: formData.discount_type,
        discount_value: Number(formData.discount_value),
        start_date: new Date(formData.start_date).toISOString(),
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        status: formData.status,
      }

      if (isEditing) {
        const { error } = await supabase
          .from('promotions')
          .update(dataToSave)
          .eq('id', promotion.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('promotions')
          .insert(dataToSave)
        if (error) throw error
      }

      onSave()
      onClose()
    } catch (error: any) {
      alert('Error saving promotion: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this promotion?')) return
    setIsSaving(true)
    try {
      const { error } = await supabase.from('promotions').delete().eq('id', promotion.id)
      if (error) throw error
      onSave()
      onClose()
    } catch (error: any) {
      alert('Error deleting promotion: ' + error.message)
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
      <div className="bg-[#f4f6f8] rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden ring-1 ring-white/10">
        
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-gray-900">{isEditing ? formData.title || 'Edit Promotion' : 'Create Promotion'}</h2>
          </div>
          
          <div className="flex items-center gap-3">
            {isEditing && (
              <button 
                type="button"
                onClick={handleDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Promotion"
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
              Save Discount
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 space-y-6">
              <Card title="Discount details" icon={Tag}>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Internal Title</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Summer Sale 2026"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow placeholder-gray-400 text-gray-900" 
                    />
                    <p className="text-xs text-gray-500 mt-1">Customers will not see this.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount Code</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. SUMMER20"
                      value={formData.code}
                      onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow uppercase font-mono tracking-wider placeholder-gray-400 text-gray-900" 
                    />
                    <p className="text-xs text-gray-500 mt-1">Customers will enter this code at checkout.</p>
                  </div>
                </div>
              </Card>

              <Card title="Value" icon={Percent}>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount Type</label>
                    <select 
                      value={formData.discount_type}
                      onChange={e => setFormData({...formData, discount_type: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow text-gray-900"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed_amount">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount Value</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                        {formData.discount_type === 'percentage' ? '%' : '$'}
                      </span>
                      <input 
                        required
                        type="number" 
                        step="0.01"
                        min="0"
                        placeholder="0"
                        value={formData.discount_value}
                        onChange={e => setFormData({...formData, discount_value: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg p-2.5 pl-8 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow placeholder-gray-400 text-gray-900" 
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card title="Status">
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow bg-gray-50 text-gray-900"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="expired">Expired</option>
                </select>
              </Card>

              <Card title="Active Dates" icon={Calendar}>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Date</label>
                    <input 
                      required
                      type="datetime-local" 
                      value={formData.start_date}
                      onChange={e => setFormData({...formData, start_date: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow text-gray-900" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">End Date</label>
                    <input 
                      type="datetime-local" 
                      value={formData.end_date}
                      onChange={e => setFormData({...formData, end_date: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow text-gray-900" 
                    />
                    <p className="text-xs text-gray-500 mt-2">Leave blank if the discount has no expiration.</p>
                  </div>
                </div>
              </Card>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
