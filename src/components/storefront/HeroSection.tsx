'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Phase 1 refs
  const topRowRef = useRef<HTMLDivElement>(null)
  const bottomRowRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  // Phase 2 refs
  const specialImageRef = useRef<HTMLDivElement>(null)
  const aboutTextRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Create a master timeline tied to the scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,           // Pin the section
          scrub: 1,            // Smooth scrubbing
          start: 'top top',
          end: '+=300%',       // Double scroll duration
        }
      })

      // ----- PHASE 1: Hero Animation (0% to 50%) -----
      // We use a label 'phase1' to synchronize
      tl.addLabel('phase1', 0)

      // Top Row LEFT
      tl.to(topRowRef.current, {
        xPercent: -30,
        ease: 'none',
        duration: 1
      }, 'phase1')

      // Special Image must move with the top row in Phase 1
      tl.to(specialImageRef.current, {
        x: '-60vw',
        ease: 'none',
        duration: 1
      }, 'phase1')

      // Bottom Row RIGHT
      tl.fromTo(bottomRowRef.current, {
        xPercent: -30
      }, {
        xPercent: 0,
        ease: 'none',
        duration: 1
      }, 'phase1')

      // ----- PHASE 2: Transition to About Us (50% to 100%) -----
      tl.addLabel('phase2', 1)

      // 1. Fade out the hero elements (static text, CTA, and all images EXCEPT specialImage)
      // Since specialImage is in the top row, we cannot fade out the topRow wrapper.
      // Instead, we fade out the specific children of topRow and bottomRow.
      tl.to([textRef.current, ctaRef.current, bottomRowRef.current, '.fade-out-image'], {
        opacity: 0,
        y: -50,
        duration: 0.5,
        ease: 'power2.inOut'
      }, 'phase2')

      // 2. Animate the special image "down to the left"
      tl.to(specialImageRef.current, {
        x: '-45vw',       // Move to left: 15vw (since started at 60vw)
        y: '20vh',        // Move down
        rotation: 0,      // Straighten it out
        scale: 1.5,       // Make it bigger
        duration: 1,
        ease: 'power2.inOut'
      }, 'phase2')

      // 3. Bring in the About Us text on the right
      tl.fromTo(aboutTextRef.current, {
        x: '50vw',
        opacity: 0
      }, {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
      }, 'phase2+=0.2')

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="w-full bg-[#f4f6f8]">
      <section ref={containerRef} data-section="hero" className="relative w-full h-[100vh] flex flex-col items-center justify-center overflow-hidden z-0">

        {/* Central Typography - Static */}
        <div ref={textRef} className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
          <span className="block text-gray-500 text-xs font-bold tracking-[0.3em] uppercase mb-4 drop-shadow-md bg-white/60 px-4 py-1 rounded-full backdrop-blur-md">
            The Fall Winter Collection
          </span>
          <h1 className="text-[15vw] md:text-[12vw] leading-[0.8] font-bold tracking-tighter text-gray-900 select-none text-center drop-shadow-2xl">
            ELEVATED
          </h1>
          <h1 className="text-[15vw] md:text-[12vw] leading-[0.8] font-bold tracking-tighter text-gray-900 select-none text-center drop-shadow-2xl">
            EVERYDAY
          </h1>
        </div>

        {/* Top Image Row (Moves Left) */}
        <div className="absolute top-[10vh] md:top-[15vh] left-0 w-full z-10 pointer-events-none">
          <div ref={topRowRef} className="relative w-[200vw] h-[30vh]">
            <div className="fade-out-image absolute left-[10vw] top-[5vh] w-[40vw] md:w-[18vw] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl rotate-[-6deg] border border-black/5">
              <Image src="/assets/white_bg_coat.png" alt="Look 1" fill className="object-cover" />
            </div>
            {/* The special image used to be here at left: 60vw. We moved it OUT. */}
            <div className="fade-out-image absolute left-[110vw] top-[10vh] w-[42vw] md:w-[16vw] aspect-square rounded-2xl overflow-hidden shadow-2xl rotate-[8deg] border border-black/5">
              <Image src="/assets/white_bg_trousers.png" alt="Look 3" fill className="object-cover" />
            </div>
            <div className="fade-out-image absolute left-[160vw] top-[2vh] w-[35vw] md:w-[18vw] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl rotate-[-4deg] border border-black/5">
              <Image src="/assets/white_bg_tee.png" alt="Look 4" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Special Image - Positioned to look like it's in the top row at left: 60vw initially */}
        <div
          ref={specialImageRef}
          data-hero-special
          className="absolute left-[60vw] top-[13vh] md:top-[13vh] w-[45vw] md:w-[15vw] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl rotate-[12deg] border border-black/5 z-10 pointer-events-none"
        >
          <Image src="/assets/amber_tee_lifestyle_1779130179005.png" alt="Look 2" fill className="object-cover" />
        </div>

        {/* Bottom Image Row (Moves Right) */}
        <div className="absolute bottom-[20vh] md:bottom-[15vh] left-0 w-full z-10 pointer-events-none">
          <div ref={bottomRowRef} className="relative w-[200vw] h-[30vh]">
            <div className="fade-out-image absolute left-[5vw] top-[2vh] w-[45vw] md:w-[16vw] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl rotate-[12deg] border border-black/5">
              <Image src="/assets/white_bg_tee.png" alt="Look 5" fill className="object-cover" />
            </div>
            <div className="fade-out-image absolute left-[55vw] top-[10vh] w-[42vw] md:w-[17vw] aspect-square rounded-2xl overflow-hidden shadow-2xl rotate-[-15deg] border border-black/5">
              <Image src="/assets/white_bg_trousers.png" alt="Look 6" fill className="object-cover" />
            </div>
            <div className="fade-out-image absolute left-[105vw] top-[5vh] w-[40vw] md:w-[16vw] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl rotate-[6deg] border border-black/5">
              <Image src="/assets/white_bg_coat.png" alt="Look 7" fill className="object-cover" />
            </div>
            <div className="fade-out-image absolute left-[160vw] top-[-2vh] w-[38vw] md:w-[15vw] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl rotate-[-8deg] border border-black/5">
              <Image src="/assets/white_bg_hoodie.png" alt="Look 8" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div ref={ctaRef} className="absolute bottom-[5%] left-0 right-0 z-30 flex flex-col items-center gap-4 pointer-events-auto px-6">
          <div className="group flex flex-col items-center gap-2 cursor-pointer">
            <span className="text-gray-900 uppercase tracking-[0.2em] font-bold text-xs bg-white/60 px-4 py-2 rounded-full backdrop-blur-md shadow-lg hover:bg-white transition-colors">
              Scroll to Discover
            </span>
            <div className="w-[1px] h-12 bg-gray-400 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gray-900 origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
            </div>
          </div>
        </div>

        {/* About Us Text - Appears in Phase 2 */}
        <div ref={aboutTextRef} className="absolute right-[10%] w-[80%] md:w-[40%] z-40 pointer-events-none opacity-0">
          <h2 className="text-[10vw] md:text-[5vw] leading-[0.9] font-bold tracking-tighter text-gray-900 mb-6 drop-shadow-lg">
            OUR STORY
          </h2>
          <p className="text-base md:text-xl text-gray-600 leading-relaxed font-medium">
            Crafting elevated everyday essentials with uncompromising quality.
            We believe in minimalist design, premium materials, and a timeless
            aesthetic that transcends fleeting trends. Born from a desire to
            redefine modern menswear.
          </p>
        </div>

      </section>
    </div>
  )
}
