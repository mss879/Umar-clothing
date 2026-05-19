'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function CategorySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const leftCardRef = useRef<HTMLDivElement>(null)
  const middleCardRef = useRef<HTMLDivElement>(null)
  const rightCardRef = useRef<HTMLDivElement>(null)

  const categories = [
    {
      title: 'Menswear',
      image: '/assets/amber_coat_1779130215821.png',
      href: '/collections/mens'
    },
    {
      title: 'Womenswear',
      image: '/assets/amber_tee_lifestyle_1779130179005.png',
      href: '/collections/womens'
    },
    {
      title: 'Objects',
      image: '/assets/purple_tee_flat_1779130194261.png',
      href: '/collections/objects'
    }
  ]

  const cardRefs = [leftCardRef, middleCardRef, rightCardRef]

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Start everything hidden
      gsap.set(headingRef.current, { opacity: 0, y: 40 })
      gsap.set(leftCardRef.current, { opacity: 0, x: '-80%' })
      gsap.set(middleCardRef.current, { opacity: 0, scale: 0.9, y: 30 })
      gsap.set(rightCardRef.current, { opacity: 0, x: '80%' })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          // Match the wider range of the CrossSectionTransition
          start: 'top 80%',
          end: 'top -5%',
          scrub: 2, // Match the higher scrub for synchronized smoothness
        }
      })

      // Phase 1: Heading fades in early
      tl.to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.25,
        ease: 'power2.out'
      }, 0)

      // Phase 2: Middle card fades in as the floating image arrives & fades out
      // The floating image fades at progress 0.55→0.78 on its trigger,
      // which maps to roughly this portion of the category scroll
      tl.to(middleCardRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.35,
        ease: 'power2.out'
      }, 0.4)

      // Phase 3: Side cards sweep in together, slightly after the middle lands
      tl.to(leftCardRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.4,
        ease: 'power3.out'
      }, 0.55)

      tl.to(rightCardRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.4,
        ease: 'power3.out'
      }, 0.55)

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} data-section="categories" className="w-full bg-white py-24 md:py-32 px-6">
      <div className="max-w-[1600px] mx-auto">
        <div ref={headingRef} className="flex justify-between items-end mb-16">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-gray-900">
            Shop by Category
          </h2>
          <Link href="/collections" className="text-sm font-semibold tracking-widest uppercase hover:text-gray-500 transition-colors hidden md:block">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {categories.map((category, index) => (
            <div
              ref={cardRefs[index]}
              key={category.title}
            >
              <Link href={category.href} className="group flex flex-col gap-6 cursor-pointer">
                <div
                  className="relative aspect-[3/4] w-full overflow-hidden bg-[#f4f6f8]"
                  {...(index === 1 ? { 'data-category': 'middle' } : {})}
                >
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover object-center transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <h3 className="text-2xl font-medium tracking-tight text-gray-900 group-hover:text-gray-500 transition-colors">
                  {category.title}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
