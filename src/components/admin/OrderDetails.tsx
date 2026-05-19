'use client'

import { X, User, MapPin, Truck, CreditCard, Package } from 'lucide-react'
import { format } from 'date-fns'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface OrderDetailsProps {
  order: any
  onClose: () => void
  onUpdate: () => void
}

export function OrderDetails({ order, onClose, onUpdate }: OrderDetailsProps) {
  const [orderStatus, setOrderStatus] = useState(order.order_status)
  const [paymentStatus, setPaymentStatus] = useState(order.payment_status)
  const [deliveryStatus, setDeliveryStatus] = useState(order.delivery_status || 'pending')
  const [isUpdating, setIsUpdating] = useState(false)
  const supabase = createClient()

  const handleUpdate = async () => {
    setIsUpdating(true)
    const { error } = await supabase
      .from('orders')
      .update({
        order_status: orderStatus,
        payment_status: paymentStatus,
        delivery_status: deliveryStatus,
      })
      .eq('id', order.id)

    setIsUpdating(false)
    if (!error) {
      onUpdate()
      onClose()
    } else {
      alert('Failed to update order: ' + error.message)
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
      <div className="bg-[#f4f6f8] rounded-2xl shadow-2xl w-full max-w-5xl h-[95vh] flex flex-col overflow-hidden ring-1 ring-white/10">
        
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Order #{order.id.split('-')[0]}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{format(new Date(order.created_at), 'MMMM d, yyyy ')} at {format(new Date(order.created_at), 'h:mm a')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleUpdate}
              disabled={isUpdating}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-all disabled:opacity-70 shadow-sm"
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Column (2/3 width) - Order Items */}
            <div className="lg:col-span-2">
              <Card title="Order Items" icon={Package}>
                <div className="divide-y divide-gray-100 -mx-5 -mt-5">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0">
                          {/* Placeholder for product image if added later */}
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{item.product_name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {item.size && <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-md font-medium">Size: {item.size}</span>}
                            {item.color && <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-md font-medium">Color: {item.color}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{item.quantity} x ${Number(item.price).toFixed(2)}</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">${Number(item.subtotal).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Financial Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span>${Number(order.total_amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    {/* If discount applied, show here */}
                    <div className="flex justify-between font-semibold text-gray-900 text-lg pt-4 border-t border-gray-100">
                      <span>Total</span>
                      <span>${Number(order.total_amount).toFixed(2)}</span>
                    </div>
                    <p className="text-right text-xs text-gray-500 mt-1">Paid via {order.payment_method}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar Column (1/3 width) - Statuses and Customer info */}
            <div className="space-y-6">
              
              <Card title="Statuses" icon={Truck}>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Order Status</label>
                    <select 
                      value={orderStatus} 
                      onChange={e => setOrderStatus(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow text-gray-900"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Status</label>
                    <select 
                      value={paymentStatus} 
                      onChange={e => setPaymentStatus(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow text-gray-900"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Status</label>
                    <select 
                      value={deliveryStatus} 
                      onChange={e => setDeliveryStatus(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow text-gray-900"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              </Card>

              <Card title="Customer" icon={User}>
                <div className="space-y-3 text-sm text-gray-900">
                  <p className="font-semibold">{order.customer_name}</p>
                  <p className="text-gray-600">{order.customer_email}</p>
                  {order.customer_phone && <p className="text-gray-600">{order.customer_phone}</p>}
                </div>
              </Card>

              <Card title="Shipping Address" icon={MapPin}>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>{order.shipping_address}</p>
                  <p>{order.shipping_city}, {order.shipping_postal_code}</p>
                </div>
              </Card>

            </div>
            
          </div>
        </div>

      </div>
    </div>
  )
}
