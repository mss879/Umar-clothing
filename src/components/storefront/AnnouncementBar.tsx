import Link from 'next/link'

export function AnnouncementBar() {
  return (
    <div className="w-full bg-black text-white text-[10px] md:text-xs font-semibold tracking-widest py-2 px-4 flex items-center justify-center text-center uppercase z-50 relative">
      <p>
        Complimentary Shipping on all orders over $200. <Link href="/shipping" className="underline underline-offset-4 ml-2 hover:text-gray-300">Details</Link>
      </p>
    </div>
  )
}
