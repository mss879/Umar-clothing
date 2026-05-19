import { Sidebar } from '@/components/admin/Sidebar'
import { Header } from '@/components/admin/Header'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex text-[#5A5A5A]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-tl-[2rem] shadow-[-10px_0_30px_rgba(0,0,0,0.02)] border-l border-t border-[#F0EBE1] mt-4 ml-0 md:ml-0 overflow-y-auto">
        <Header />
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
