import { Header } from '@/components/storefront/Header'
import { Footer } from '@/components/storefront/Footer'
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar'

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f8] text-gray-900 font-sans selection:bg-gray-900 selection:text-white">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 w-full relative">
        {children}
      </main>
      <Footer />
    </div>
  )
}
