'use client'

import { useState } from 'react'
import { X, Upload, Loader2, Trash2, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { RichTextEditor } from '@/components/admin/RichTextEditor'

interface ProductFormProps {
  product?: any
  categories: any[]
  onClose: () => void
  onSave: () => void
}

export function ProductForm({ product, categories, onClose, onSave }: ProductFormProps) {
  const isEditing = !!product
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || '',
    category_id: product?.category_id || '',
    status: product?.status || 'draft',
    tags: product?.tags || [],
  })
  const [tagInput, setTagInput] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.product_images?.find((img: any) => img.is_primary)?.image_url || null
  )
  const supabase = createClient()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleDescriptionImageUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `desc-${Math.random()}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(fileName, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      let productId = product?.id

      // 1. Save Product Details
      if (isEditing) {
        const { error } = await supabase
          .from('products')
          .update({
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
            price: Number(formData.price),
            category_id: formData.category_id || null,
            status: formData.status,
            tags: formData.tags,
          })
          .eq('id', productId)
        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert({
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
            price: Number(formData.price),
            category_id: formData.category_id || null,
            status: formData.status,
            tags: formData.tags,
          })
          .select('id')
          .single()
        if (error) throw error
        productId = data.id
      }

      // 2. Handle Image Upload if a new file is selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${productId}-${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage
          .from('products')
          .getPublicUrl(fileName)

        // Remove old primary image if editing
        if (isEditing && product?.product_images?.length > 0) {
          const oldPrimary = product.product_images.find((img: any) => img.is_primary)
          if (oldPrimary) {
             await supabase.from('product_images').delete().eq('id', oldPrimary.id)
          }
        }

        // Insert new image record
        const { error: imgError } = await supabase
          .from('product_images')
          .insert({
            product_id: productId,
            image_url: publicUrlData.publicUrl,
            is_primary: true
          })
        
        if (imgError) throw imgError
      }

      onSave()
      onClose()
    } catch (error: any) {
      alert('Error saving product: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return
    setIsSaving(true)
    try {
      const { error } = await supabase.from('products').delete().eq('id', product.id)
      if (error) throw error
      onSave()
      onClose()
    } catch (error: any) {
      alert('Error deleting product: ' + error.message)
      setIsSaving(false)
    }
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const newTag = tagInput.trim().toLowerCase()
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData({ ...formData, tags: [...formData.tags, newTag] })
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  // Common card style to match Shopify's distinct grouped sections
  const Card = ({ children, title }: { children: React.ReactNode, title?: string }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
      <div className="bg-[#f4f6f8] rounded-2xl shadow-2xl w-full max-w-5xl h-[95vh] flex flex-col overflow-hidden ring-1 ring-white/10">
        
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-gray-900">{isEditing ? formData.name || 'Edit Product' : 'Add Product'}</h2>
          </div>
          
          <div className="flex items-center gap-3">
            {isEditing && (
              <button 
                type="button"
                onClick={handleDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Product"
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
              {isEditing ? 'Save changes' : 'Save product'}
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Column (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* General Details Card */}
              <Card title="General Information">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Premium Cotton T-Shirt"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow placeholder-gray-400 text-gray-900" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <RichTextEditor
                        value={formData.description}
                        onChange={(val) => setFormData({ ...formData, description: val })}
                        onImageUpload={handleDescriptionImageUpload}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Media Card */}
              <Card title="Media">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors group">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="hidden" 
                    id="image-upload" 
                  />
                  <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center w-full">
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img src={imagePreview} alt="Preview" className="max-h-[300px] object-contain rounded-lg shadow-sm" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">Change Image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6">
                        <div className="p-4 bg-gray-100 rounded-full mb-4">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">Click to upload main image</p>
                        <p className="text-xs text-gray-500 mt-1">High resolution images work best</p>
                      </div>
                    )}
                  </label>
                </div>
              </Card>

              {/* Pricing Card */}
              <Card title="Pricing">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                      <input 
                        required
                        type="number" 
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg p-2.5 pl-8 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow placeholder-gray-400 text-gray-900" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Compare at price</label>
                    <div className="relative opacity-60 hover:opacity-100 transition-opacity">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        className="w-full border border-gray-300 rounded-lg p-2.5 pl-8 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow placeholder-gray-400 text-gray-900" 
                      />
                    </div>
                  </div>
                </div>
              </Card>

            </div>

            {/* Sidebar Column (1/3 width) */}
            <div className="space-y-6">
              
              {/* Status Card */}
              <Card title="Product Status">
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow bg-gray-50 text-gray-900"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="archived">Archived</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  This product will be hidden from all sales channels if set to Draft.
                </p>
              </Card>

              {/* Organization Card */}
              <Card title="Product Organization">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                    <select 
                      value={formData.category_id}
                      onChange={e => setFormData({...formData, category_id: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow text-gray-900"
                    >
                      <option value="">None</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">URL Handle (Slug)</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. premium-cotton-tshirt"
                      value={formData.slug}
                      onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow placeholder-gray-400 text-gray-900" 
                    />
                    <p className="text-xs text-gray-500 mt-2">Used for SEO and links.</p>
                  </div>
                </div>
              </Card>

              {/* Tags Card */}
              <Card title="Tags">
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Enter tags and press enter"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow placeholder-gray-400 text-gray-900" 
                  />
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag: string) => (
                        <span key={tag} className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-md">
                          {tag}
                          <button type="button" onClick={() => handleRemoveTag(tag)} className="text-gray-500 hover:text-red-500">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Tags are used to automatically organize products into Smart Collections.
                  </p>
                </div>
              </Card>

            </div>
            
          </div>
        </div>

      </div>
    </div>
  )
}
