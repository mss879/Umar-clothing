import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { ProductCard } from './ProductCard'

// Mock fallback data if Supabase is empty
const MOCK_PRODUCTS = [
  {
    id: '1',
    title: 'Amber Blaze Classic Tee',
    image: '/assets/amber_tee_lifestyle_1779130179005.png',
    rating: 5,
    price: 250,
    sizes: 'XS - XXL'
  },
  {
    id: '2',
    title: 'Amber Blaze Everyday Crew',
    image: '/assets/amber_hoodie_1779130243297.png', // Using hoodie as placeholder
    rating: 5,
    price: 350,
    sizes: 'S - XXL'
  },
  {
    id: '3',
    title: 'Amber Blaze Softwear Coat',
    image: '/assets/amber_coat_1779130215821.png',
    rating: 5,
    price: 500,
    sizes: 'S - XL'
  }
]

export function ProductGrid({ products = [] }: { products?: any[] }) {
  const displayProducts = products.length > 0 ? products : MOCK_PRODUCTS

  return (
    <section className="w-full px-6 py-16 flex flex-col lg:flex-row gap-12 lg:gap-24">
      {/* Left Text Column */}
      <div className="w-full lg:w-1/4 flex flex-col justify-between items-start">
        <div className="flex flex-col gap-6">
          <span className="text-sm font-bold tracking-widest text-gray-900">/02</span>
          <h2 className="text-5xl font-medium tracking-tight leading-none text-gray-900">
            Amber<br/>Glow
          </h2>
          <p className="text-sm font-medium text-gray-700 leading-relaxed max-w-xs mt-4">
            Bring warmth to every layer and bold comfort with a soft edge, rich hues for effortless days for you.
          </p>
        </div>
        
        <Link href="/collections/amber-glow" className="mt-12 lg:mt-0 bg-black text-white h-12 px-6 rounded-full flex items-center gap-3 hover:bg-gray-800 transition-colors w-fit">
          <span className="text-sm font-semibold">Explore All</span>
          <div className="bg-white text-black rounded-full p-1">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      {/* Right Product Grid */}
      <div className="w-full lg:w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProducts.map((product) => (
          <ProductCard 
            key={product.id}
            id={product.id}
            title={product.title}
            image={product.image}
            rating={product.rating}
            price={product.price}
            sizes={product.sizes}
          />
        ))}
      </div>
    </section>
  )
}
