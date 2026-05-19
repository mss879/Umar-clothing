import { createClient } from '@/lib/supabase/server'
import { InventoryClient } from '@/components/admin/InventoryClient'

export default async function InventoryPage() {
  const supabase = await createClient()

  const { data: inventory } = await supabase
    .from('inventory')
    .select(`
      *,
      products (name)
    `)
    .order('created_at', { ascending: false })

  const { data: products } = await supabase
    .from('products')
    .select('id, name')
    .order('name')

  return (
    <InventoryClient 
      initialInventory={inventory || []} 
      products={products || []} 
    />
  )
}
