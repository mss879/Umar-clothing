'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ProductCard } from './ProductCard'

export function NewArrivalsSection({ products = [] }: { products?: any[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  if (!products || products.length === 0) return null

  return (
    <section className="w-full bg-[#f4f6f8] py-24 md:py-32 overflow-hidden" ref={ref}>
      <div className="max-w-[1600px] mx-auto px-6 mb-16 flex justify-between items-end">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-5xl font-medium tracking-tighter text-gray-900"
        >
          New Arrivals
        </motion.h2>
      </div>

      {/* Horizontal Scroll Area */}
      <div className="w-full pl-6 md:pl-[max(1.5rem,calc((100vw-1600px)/2+1.5rem))] overflow-x-auto pb-12 hide-scrollbar snap-x snap-mandatory">
        <div className="flex gap-6 w-max pr-6">
          {products.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="w-[280px] md:w-[350px] shrink-0 snap-start"
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  )
}
