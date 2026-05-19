import { createClient } from '@/lib/supabase/server'
import { DataTable } from '@/components/admin/DataTable'
import { format } from 'date-fns'

export default async function CustomersPage() {
  const supabase = await createClient()

  // Fetch customers (profiles with role='customer')
  // Note: For total orders and spent, we ideally need a joined view or RPC in Supabase.
  // For this implementation, we will fetch customers and their orders and aggregate in JS.
  const { data: customers } = await supabase
    .from('profiles')
    .select('*, orders(id, total_amount, created_at)')
    .eq('role', 'customer')
    .order('created_at', { ascending: false })

  const processedCustomers = (customers as any[])?.map((customer) => {
    const orders = customer.orders || []
    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum: number, order: any) => sum + Number(order.total_amount), 0)
    
    // Find the latest order date
    let lastOrderDate = null
    if (totalOrders > 0) {
      const dates = orders.map((o: any) => new Date(o.created_at).getTime())
      lastOrderDate = new Date(Math.max(...dates))
    }

    return {
      id: customer.id,
      name: customer.full_name || 'Unknown',
      email: customer.email,
      phone: customer.phone || 'N/A',
      totalOrders,
      totalSpent,
      lastOrderDate,
      joinedAt: customer.created_at,
    }
  }) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
      </div>

      <DataTable
        data={processedCustomers}
        keyExtractor={(row) => row.id}
        columns={[
          { header: 'Name', accessor: (row) => <span className="font-medium text-gray-900">{row.name}</span> },
          { header: 'Email', accessor: 'email', className: 'text-gray-500' },
          { header: 'Phone', accessor: 'phone' },
          { header: 'Total Orders', accessor: 'totalOrders' },
          { header: 'Total Spent', accessor: (row) => `$${row.totalSpent.toFixed(2)}` },
          { 
            header: 'Last Order', 
            accessor: (row) => row.lastOrderDate ? format(row.lastOrderDate, 'MMM d, yyyy') : 'Never' 
          },
        ]}
      />
    </div>
  )
}
