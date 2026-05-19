import { createClient } from '@supabase/supabase-js'
import { HeroSection } from '@/components/storefront/HeroSection'
import { BrandStory } from '@/components/storefront/BrandStory'
import { NewArrivalsSection } from '@/components/storefront/NewArrivalsSection'
import { CategorySection } from '@/components/storefront/CategorySection'
import { DarkFeatureSection } from '@/components/storefront/DarkFeatureSection'
import { CrossSectionTransition } from '@/components/storefront/CrossSectionTransition'

// Using standard supabase client for Server Component public data fetching
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Revalidate every hour since products don't change that frequently
export const revalidate = 3600

export default async function StorefrontHome() {
  // Fetch active products from Supabase
  const { data: products } = await supabase
    .from('products')
    .select(`
      id,
      name,
      price,
      product_images (
        image_url,
        is_primary
      ),
      inventory (
        size
      )
    `)
    .eq('status', 'active')
    .limit(8)

  // Map the DB response to the shape the component expects
  const formattedProducts = products?.map(p => {
    const primaryImage = p.product_images?.find((img: any) => img.is_primary)?.image_url 
                         || p.product_images?.[0]?.image_url 
                         || '/assets/amber_tee_lifestyle_1779130179005.png' // fallback
    
    // Extract unique sizes
    const sizes = p.inventory ? Array.from(new Set(p.inventory.map((i: any) => i.size))).join(' - ') : 'S - L'

    return {
      id: p.id,
      title: p.name,
      image: primaryImage,
      rating: 5,
      price: p.price,
      sizes: sizes || 'ONE SIZE'
    }
  }) || []

  // Create fallback mock products if DB is empty
  const mockProducts = [
    { id: '1', title: 'Amber Heavyweight Hoodie', image: '/assets/amber_hoodie_1779130243297.png', rating: 5, price: 180, sizes: 'S - XL' },
    { id: '2', title: 'Amber Classic Tee', image: '/assets/amber_tee_lifestyle_1779130179005.png', rating: 5, price: 85, sizes: 'XS - XXL' },
    { id: '3', title: 'Amber Wool Overcoat', image: '/assets/amber_coat_1779130215821.png', rating: 5, price: 650, sizes: 'M - L' },
    { id: '4', title: 'Purple Classic Tee', image: '/assets/purple_tee_flat_1779130194261.png', rating: 5, price: 85, sizes: 'S - XL' },
    { id: '5', title: 'Orange Classic Tee', image: '/assets/orange_tee_flat_1779130229231.png', rating: 5, price: 85, sizes: 'S - XL' }
  ]

  const displayProducts = formattedProducts.length > 0 ? formattedProducts : mockProducts

  return (
    <div className="flex flex-col items-center w-full bg-white relative">
      <HeroSection />

      {/* Cross-section flying image transition */}
      <CrossSectionTransition />

      {/* Massive Categories */}
      <CategorySection />
      
      {/* New Arrivals Scroll */}
      <NewArrivalsSection products={displayProducts} />

      {/* Brand Story with Parallax / Fade */}
      <BrandStory />

      {/* Lookbook */}
      <DarkFeatureSection />
    </div>
  )
}
