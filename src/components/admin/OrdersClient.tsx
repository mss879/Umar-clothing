'use client'

import { useState } from 'react'
import { DataTable } from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { OrderDetails } from '@/components/admin/OrderDetails'
import { format } from 'date-fns'
import { Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface OrdersClientProps {
  initialOrders: any[]
}

export function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const router = useRouter()

  const columns = [
    { header: 'Order ID', accessor: (row: any) => <span className="font-mono text-gray-500">{row.id.split('-')[0]}</span> },
    { header: 'Customer', accessor: 'customer_name' },
    { header: 'Total', accessor: (row: any) => `$${Number(row.total_amount).toFixed(2)}` },
    { header: 'Date', accessor: (row: any) => format(new Date(row.created_at), 'MMM d, yyyy') },
    { header: 'Order Status', accessor: (row: any) => <StatusBadge status={row.order_status} type="order" /> },
    { header: 'Payment', accessor: (row: any) => <StatusBadge status={row.payment_status} type="payment" /> },
    { header: 'Delivery', accessor: (row: any) => <StatusBadge status={row.delivery_status} type="order" /> },
    { 
      header: 'Actions', 
      accessor: (row: any) => (
        <button 
          onClick={() => setSelectedOrder(row)}
          className="text-gray-500 hover:text-gray-900 transition-colors p-1"
          title="View details"
        >
          <Eye className="w-5 h-5" />
        </button>
      ) 
    },
  ]

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <DataTable
          data={initialOrders}
          columns={columns}
          keyExtractor={(row) => row.id}
        />
      </div>

      {selectedOrder && (
        <OrderDetails 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
          onUpdate={() => {
            router.refresh()
          }}
        />
      )}
    </>
  )
}
