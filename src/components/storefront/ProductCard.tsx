import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Star } from 'lucide-react'

export interface ProductCardProps {
  id: string
  title: string
  image: string
  rating: number
  price: number
  sizes: string
}

export function ProductCard({ id, title, image, rating, price, sizes }: ProductCardProps) {
  return (
    <Link href={`/product/${id}`} className="group flex flex-col gap-5 cursor-pointer">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f8f8f8] mix-blend-multiply">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover object-center transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
        {/* Quick Add Button on Hover */}
        <div className="absolute bottom-4 right-4 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button className="bg-black text-white p-3 rounded-none shadow-xl hover:bg-gray-800 transition-colors">
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col gap-2 px-1">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-lg text-gray-900 tracking-tight line-clamp-1 pr-4">{title}</h4>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 font-medium tracking-widest uppercase text-xs">{sizes}</span>
          <span className="font-medium text-lg text-gray-900">${price}</span>
        </div>
      </div>
    </Link>
  )
}
