'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function BrandStory() {
  return (
    <section className="w-full bg-white py-24 md:py-32 px-6 overflow-hidden">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center gap-16 lg:gap-32">
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full md:w-1/2 flex flex-col items-start order-2 md:order-1"
        >
          <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-6">The Pursuit of Perfection</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-gray-900 mb-8 leading-[1.1]">
            Fabricated for the<br/>modern aesthetic.
          </h2>
          <p className="text-base text-gray-600 leading-relaxed max-w-md mb-10">
            We believe that true luxury lies in the details. Every stitch, every fold, and every thread is purposefully chosen to create garments that not only look exceptional but feel like a second skin. Our commitment to sustainable practices and master craftsmanship ensures that what you wear is built to endure.
          </p>
          <Link href="/pages/about" className="group inline-flex items-center gap-2 border-b border-gray-900 pb-1 text-sm font-semibold tracking-widest uppercase hover:text-gray-600 hover:border-gray-600 transition-colors">
            Discover Our Story
          </Link>
        </motion.div>

        {/* Image */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full md:w-1/2 order-1 md:order-2"
        >
          <div className="relative aspect-[4/5] w-full max-w-lg mx-auto md:ml-auto md:mr-0 overflow-hidden bg-gray-100">
            <Image 
              src="/assets/amber_tee_lifestyle_1779130179005.png" 
              alt="Brand Story"
              fill
              className="object-cover object-center transition-transform duration-[2s] hover:scale-105"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
