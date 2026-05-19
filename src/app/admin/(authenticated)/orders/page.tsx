import { createClient } from '@/lib/supabase/server'
import { OrdersClient } from '@/components/admin/OrdersClient'

export default async function OrdersPage() {
  const supabase = await createClient()

  // Fetch orders with order items
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
      </div>

      <OrdersClient initialOrders={orders || []} />
    </div>
  )
}
