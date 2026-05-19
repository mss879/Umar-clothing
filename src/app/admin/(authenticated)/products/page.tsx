import { createClient } from '@/lib/supabase/server'
import { ProductsClient } from '@/components/admin/ProductsClient'

export default async function ProductsPage() {
  const supabase = await createClient()

  // Fetch products with their primary image and category
  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      categories (name),
      product_images (id, image_url, is_primary)
    `)
    .order('created_at', { ascending: false })

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return (
    <ProductsClient 
      initialProducts={products || []} 
      categories={categories || []} 
    />
  )
}
