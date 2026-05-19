'use client'

import { useState } from 'react'
import { X, Loader2, Trash2, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface CollectionFormProps {
  collection?: any
  onClose: () => void
  onSave: () => void
}

export function CollectionForm({ collection, onClose, onSave }: CollectionFormProps) {
  const isEditing = !!collection
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: collection?.title || '',
    slug: collection?.slug || '',
    description: collection?.description || '',
    collection_type: collection?.collection_type || 'manual',
    smart_rule_value: collection?.smart_rule_value || '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(collection?.image_url || null)
  const supabase = createClient()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      let imageUrl = collection?.image_url

      // Handle Image Upload first
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('collections')
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from('collections')
          .getPublicUrl(fileName)
        
        imageUrl = data.publicUrl
      }

      const collectionData = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        collection_type: formData.collection_type,
        smart_rule_value: formData.collection_type === 'smart' ? formData.smart_rule_value : null,
        image_url: imageUrl,
      }

      if (isEditing) {
        const { error } = await (supabase as any).from('collections')
          .update(collectionData)
          .eq('id', collection.id)
        if (error) throw error
      } else {
        const { error } = await (supabase as any).from('collections')
          .insert(collectionData)
        if (error) throw error
      }

      onSave()
      onClose()
    } catch (error: any) {
      alert('Error saving collection: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this collection?')) return
    setIsSaving(true)
    try {
      const { error } = await supabase.from('collections').delete().eq('id', collection.id)
      if (error) throw error
      onSave()
      onClose()
    } catch (error: any) {
      alert('Error deleting collection: ' + error.message)
      setIsSaving(false)
    }
  }

  const Card = ({ children, title }: { children: React.ReactNode, title?: string }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      {title && (
        <div className="px-5 py-4 border-b border-gray-100">
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
            <h2 className="text-xl font-bold text-gray-900">{isEditing ? formData.title || 'Edit Collection' : 'Create Collection'}</h2>
          </div>
          
          <div className="flex items-center gap-3">
            {isEditing && (
              <button 
                type="button"
                onClick={handleDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Collection"
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
              Save Collection
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="md:col-span-2">
              <Card title="Collection Details">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Summer Collection"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow placeholder-gray-400 text-gray-900" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description (Optional)</label>
                    <textarea 
                      rows={4}
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow resize-none placeholder-gray-400 text-gray-900" 
                    />
                  </div>
                </div>
              </Card>

              <Card title="Collection Type">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setFormData({...formData, collection_type: 'manual'})}>
                    <input 
                      type="radio" 
                      name="collection_type" 
                      className="mt-1 w-4 h-4 text-gray-900"
                      checked={formData.collection_type === 'manual'}
                      onChange={() => setFormData({...formData, collection_type: 'manual'})}
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">Manual</h4>
                      <p className="text-sm text-gray-500 mt-0.5">Add products to this collection one by one.</p>
                    </div>
                  </div>

                  <div className={`flex flex-col gap-3 p-4 border rounded-xl transition-colors cursor-pointer ${formData.collection_type === 'smart' ? 'border-gray-900 bg-gray-50/50' : 'border-gray-200 bg-white hover:bg-gray-50'}`} onClick={() => setFormData({...formData, collection_type: 'smart'})}>
                    <div className="flex items-start gap-3">
                      <input 
                        type="radio" 
                        name="collection_type" 
                        className="mt-1 w-4 h-4 text-gray-900"
                        checked={formData.collection_type === 'smart'}
                        onChange={() => setFormData({...formData, collection_type: 'smart'})}
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">Automated (Smart Rule)</h4>
                        <p className="text-sm text-gray-500 mt-0.5">Products that match the rule are automatically added to this collection.</p>
                      </div>
                    </div>

                    {formData.collection_type === 'smart' && (
                      <div className="ml-7 mt-3 p-4 bg-white border border-gray-200 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Products must match:</label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-md border border-gray-200">Product Tag</span>
                          <span className="text-sm text-gray-500">is equal to</span>
                          <input 
                            type="text" 
                            placeholder="e.g. summer"
                            value={formData.smart_rule_value}
                            onChange={e => setFormData({...formData, smart_rule_value: e.target.value.toLowerCase()})}
                            className="flex-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow placeholder-gray-400 text-gray-900" 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            <div className="md:col-span-1">
              <Card title="Collection Image">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors group">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="hidden" 
                    id="collection-image-upload" 
                  />
                  <label htmlFor="collection-image-upload" className="cursor-pointer flex flex-col items-center w-full">
                    {imagePreview ? (
                      <div className="relative inline-block w-full">
                        <img src={imagePreview} alt="Preview" className="w-full aspect-square object-cover rounded-lg shadow-sm" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <span className="text-white font-medium text-sm bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-sm">Change</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4">
                        <div className="p-3 bg-gray-100 rounded-full mb-3">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">Upload Image</p>
                      </div>
                    )}
                  </label>
                </div>
              </Card>

              <Card title="URL Handle">
                <input 
                  required
                  type="text" 
                  placeholder="e.g. summer-collection"
                  value={formData.slug}
                  onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow placeholder-gray-400 text-gray-900" 
                />
              </Card>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
