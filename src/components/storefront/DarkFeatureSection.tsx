'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export function DarkFeatureSection() {
  const tabs = ["Classic", "Everyday", "Soft", "Foundation", "Active", "Essential"]

  return (
    <section className="w-full bg-[#111111] text-white pt-24 pb-8 px-6 overflow-hidden">
      <div className="max-w-[1600px] mx-auto">
        {/* Top Header / Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-24"
        >
          <div className="flex flex-col">
            <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">The Essentials Lookbook</span>
            <div className="flex flex-wrap gap-3">
              {tabs.map((tab, i) => (
                <button 
                  key={tab} 
                  className={`px-6 py-2 rounded-none border text-xs font-semibold tracking-widest uppercase transition-colors ${
                    i === 5 
                      ? 'border-white text-white' 
                      : 'border-white/20 text-white/60 hover:text-white hover:border-white/50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Curated Form
          </div>
        </motion.div>

        {/* Massive Typography */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full mb-16"
        >
          <h2 className="text-[6vw] leading-[0.85] font-semibold tracking-tighter uppercase text-white/90">
            The Science<br/>Of Everyday<br/>Comfort
          </h2>
        </motion.div>

        {/* Product Flat Lays */}
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-32 mb-32 relative">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md aspect-square drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-4 transition-transform duration-700"
          >
            <Image 
              src="/assets/purple_tee_flat_1779130194261.png" 
              alt="Purple classic tee" 
              fill 
              className="object-contain"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md aspect-square drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-4 transition-transform duration-700"
          >
            <Image 
              src="/assets/orange_tee_flat_1779130229231.png" 
              alt="Orange classic tee" 
              fill 
              className="object-contain"
            />
          </motion.div>
        </div>

        {/* Bottom Promo */}
        <div className="w-full pt-8 border-t border-white/10 flex items-center justify-between">
          <p className="text-[10px] font-bold tracking-widest text-white/60 uppercase">
            Use ORMAS25 now, get 25% off your first fit
          </p>
        </div>
      </div>
    </section>
  )
}
