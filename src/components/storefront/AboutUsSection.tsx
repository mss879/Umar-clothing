'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function AboutUsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: '+=150%', // Make it a bit longer for a cinematic feel
        }
      })

      // Image starts centered and moves to the right
      tl.to(imageRef.current, {
        x: '30vw', // Move it 30vw to the right from the center
        ease: 'power1.inOut'
      }, 0)

      // Text starts off-screen left and moves in
      tl.fromTo(textRef.current, {
        x: '-50vw',
        opacity: 0
      }, {
        x: 0,
        opacity: 1,
        ease: 'power1.inOut'
      }, 0)

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative w-full h-[100vh] bg-white overflow-hidden flex items-center justify-center">
      
      {/* Text on the Left */}
      <div ref={textRef} className="absolute left-[10%] w-[80%] md:w-[35%] z-20 pointer-events-none">
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

      {/* Image starts in Center, moves to Right */}
      <div 
        ref={imageRef} 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] md:w-[30vw] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl z-10"
      >
        <Image src="/assets/white_bg_hoodie.png" alt="About Us" fill className="object-cover" />
      </div>

    </section>
  )
}
