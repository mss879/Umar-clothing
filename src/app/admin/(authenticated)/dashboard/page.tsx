import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/admin/StatCard'
import { DollarSign, Coffee, ShoppingBag, Users, ExternalLink, MoreHorizontal, Circle } from 'lucide-react'
import { format } from 'date-fns'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch real data
  const [
    { count: productsCount },
    { count: ordersCount },
    { count: customersCount },
    { data: recentOrders }
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('orders').select('id, customer_name, total_amount, order_status, created_at').order('created_at', { ascending: false }).limit(4)
  ])

  // Total revenue (approximate sum)
  const { data: revenueData } = await supabase.from('orders').select('total_amount').neq('order_status', 'cancelled')
  const totalRevenue = revenueData?.reduce((acc, order) => acc + Number(order.total_amount), 0) || 0

  return (
    <div className="space-y-6 max-w-[1200px]">
      
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-[#F0EBE1] p-6 flex flex-col md:flex-row md:items-center justify-between shadow-sm">
        <div>
          <p className="text-[#8C7A6B] text-lg mb-1">Welcome back, Admin</p>
          <h1 className="text-2xl font-bold text-[#3B302B]">Umar Clothing Shop</h1>
        </div>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <div className="flex items-center gap-2 text-[#5B4A42] font-medium text-sm">
            Shop Status <Circle className="w-2.5 h-2.5 fill-[#2A9D8F] text-[#2A9D8F]" /> Online
          </div>
          <button className="flex items-center gap-2 text-sm font-semibold text-[#5B4A42] bg-[#F9F7F4] hover:bg-[#F0EBE1] px-4 py-2 rounded-lg transition-colors border border-[#EBE5DB]">
            <Coffee className="w-4 h-4 text-[#E76F51]" /> Umar Clothing <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} 
          icon={<DollarSign className="w-5 h-5" />}
          trend={{ value: 20, isPositive: true, label: "This month" }}
        />
        <StatCard 
          title="Total Products" 
          value={productsCount || 0} 
          icon={<Coffee className="w-5 h-5" />}
          trend={{ value: 10, isPositive: true, label: "Added this month" }}
        />
        <StatCard 
          title="Total Orders" 
          value={ordersCount || 0} 
          icon={<ShoppingBag className="w-5 h-5" />}
          trend={{ value: 23.8, isPositive: true, label: "This month" }}
        />
        <StatCard 
          title="Total Customers" 
          value={customersCount || 0} 
          icon={<Users className="w-5 h-5" />}
          trend={{ value: 12.5, isPositive: true, label: "This month" }}
        />
      </div>

      {/* Main Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Chart & Recent Orders) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Chart Mockup */}
          <div className="bg-white rounded-2xl border border-[#F0EBE1] p-6 shadow-sm h-[320px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#3B302B]">Revenues VS Sales</h2>
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-2"><Circle className="w-2.5 h-2.5 fill-[#2A9D8F] text-[#2A9D8F]" /> Revenue</div>
                <div className="flex items-center gap-2"><Circle className="w-2.5 h-2.5 fill-[#F4A261] text-[#F4A261]" /> Sale</div>
                <select className="border border-[#EBE5DB] rounded-lg px-3 py-1.5 bg-[#F9F7F4] text-[#5B4A42] outline-none">
                  <option>Monthly</option>
                  <option>Weekly</option>
                </select>
              </div>
            </div>
            <div className="flex-1 relative flex items-end">
              {/* Decorative Chart Mockup */}
              <div className="absolute inset-0 flex flex-col justify-between pb-8">
                {[400, 300, 200, 100, 0].map(val => (
                  <div key={val} className="flex items-center gap-4 w-full">
                    <span className="w-8 text-right text-xs text-[#A89E96] font-medium">{val}</span>
                    <div className="flex-1 border-b border-[#F0EBE1] border-dashed"></div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 left-12 right-0 flex justify-between text-xs text-[#A89E96] font-medium">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                  <span key={m}>{m}</span>
                ))}
              </div>
              {/* Fake SVG lines to simulate the chart in the image */}
              <svg className="absolute inset-0 w-full h-full pb-8 pl-12" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0,70 Q10,60 20,80 T40,60 T60,30 T80,70 T100,60" fill="none" stroke="#6B4E3D" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                <path d="M0,80 Q10,50 20,60 T40,70 T60,40 T80,60 T100,50" fill="none" stroke="#F4A261" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                <rect x="48" y="0" width="4" height="100" fill="url(#grad1)" opacity="0.5" />
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#6B4E3D', stopOpacity: 0}} />
                    <stop offset="100%" style={{stopColor: '#6B4E3D', stopOpacity: 0.5}} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Recent Orders Custom Table */}
          <div className="bg-white rounded-2xl border border-[#F0EBE1] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#F0EBE1] flex justify-between items-center">
              <h2 className="text-lg font-bold text-[#3B302B]">Recent Orders</h2>
              <button className="text-sm font-semibold text-[#5B4A42] hover:text-[#3B302B]">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#F0EBE1]">
                    <th className="px-6 py-4 text-sm font-semibold text-[#5B4A42] bg-[#FCFAF8]">Order ID</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#5B4A42] bg-[#FCFAF8]">Customer</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#5B4A42] bg-[#FCFAF8]">Price</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#5B4A42] bg-[#FCFAF8]">Status</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#5B4A42] bg-[#FCFAF8]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EBE1]">
                  {recentOrders?.map((order) => (
                    <tr key={order.id} className="hover:bg-[#FCFAF8] transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#3B302B]">#{order.id.split('-')[0].toUpperCase()}</p>
                        <p className="text-xs text-[#A89E96] mt-0.5">{format(new Date(order.created_at), 'dd MMM, HH:mm')}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#3B302B]">{order.customer_name}</p>
                        <p className="text-xs text-[#A89E96] mt-0.5">Customer</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#3B302B]">${Number(order.total_amount).toFixed(2)}</p>
                        <p className="text-xs text-[#A89E96] mt-0.5">Paid</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[13px] font-bold text-[#E76F51] flex items-center gap-1.5">
                          <Circle className="w-1.5 h-1.5 fill-[#E76F51]" /> 
                          {order.order_status?.charAt(0).toUpperCase() + order.order_status?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="p-1.5 bg-[#F9F7F4] rounded-md text-[#5B4A42] hover:bg-[#F0EBE1] transition-colors border border-[#EBE5DB]">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>

        {/* Right Column (Live Orders & Top Items) */}
        <div className="space-y-6">
          
          {/* Live Orders Mockup */}
          <div className="bg-white rounded-2xl border border-[#F0EBE1] shadow-sm p-6">
            <h2 className="text-lg font-bold text-[#3B302B] mb-4">Live Orders</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-xl border border-[#F0EBE1] bg-[#FCFAF8]">
                  <p className="text-sm text-[#3B302B] font-medium leading-relaxed">
                    <span className="font-bold">Umar Shopper</span> purchased <span className="font-bold">1x Premium Item</span>
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-[#A89E96] font-medium">Today at {12 - i}:30</span>
                    <button className="text-xs font-bold text-[#6B4E3D] hover:underline">View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Items Mockup */}
          <div className="bg-white rounded-2xl border border-[#F0EBE1] shadow-sm p-6">
            <h2 className="text-lg font-bold text-[#3B302B] mb-4">Top Selling Items</h2>
            <div className="p-4 rounded-xl border border-[#F0EBE1] bg-[#FCFAF8] mb-4">
              <p className="text-xs text-[#A89E96] font-medium mb-1">Items Sold</p>
              <p className="text-xl font-bold text-[#3B302B]">1,099 <span className="text-xs font-medium text-[#A89E96] font-normal">orders created</span></p>
            </div>
            
            <div className="space-y-5 mt-6">
              <div>
                <div className="flex justify-between text-sm font-bold text-[#3B302B] mb-2">
                  <span>Premium T-Shirt</span>
                  <span>756 (80.8%)</span>
                </div>
                <div className="w-full bg-[#F0EBE1] rounded-full h-2">
                  <div className="bg-[#6B4E3D] h-2 rounded-full" style={{ width: '80.8%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold text-[#3B302B] mb-2">
                  <span>Cotton Hoodie</span>
                  <span>243 (19.2%)</span>
                </div>
                <div className="w-full bg-[#F0EBE1] rounded-full h-2">
                  <div className="bg-[#F4A261] h-2 rounded-full" style={{ width: '19.2%' }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
