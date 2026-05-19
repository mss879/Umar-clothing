'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * CrossSectionTransition
 *
 * A fixed-position floating image that reads the hero special image's
 * actual rendered position, then seamlessly flies into the middle
 * category card using a gentle arc motion path.
 *
 * Uses a wide scroll range starting before the category section is
 * visible, creating a fluid bridge between the two sections.
 */
export function CrossSectionTransition() {
  const floatingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const timer = setTimeout(() => {
      const floatingEl = floatingRef.current
      const categorySection = document.querySelector('[data-section="categories"]')
      const middleCard = document.querySelector('[data-category="middle"]')
      const specialImage = document.querySelector('[data-hero-special]')

      if (!floatingEl || !categorySection || !middleCard) return

      gsap.set(floatingEl, {
        opacity: 0,
        visibility: 'hidden',
      })

      // Capture the special image's resting position when available
      let startRect: DOMRect | null = null
      if (specialImage) {
        startRect = specialImage.getBoundingClientRect()
      }

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: categorySection,
          // Start much earlier — while hero is still fading out
          start: 'top 130%',
          // End later — generous scroll distance for smooth motion
          end: 'top 5%',
          scrub: 2, // Higher scrub = smoother lag
          onUpdate: (self) => {
            const progress = self.progress
            const cardRect = middleCard.getBoundingClientRect()

            // ── Starting position ──
            // Read from the actual special image if we have it,
            // otherwise estimate from the Phase 2 end state
            let sx: number, sy: number, sw: number, sh: number
            if (startRect) {
              sx = startRect.left
              sy = startRect.top
              sw = startRect.width
              sh = startRect.height
            } else {
              // Fallback: approximate Phase 2 end
              sx = window.innerWidth * 0.12
              sy = window.innerHeight * 0.15
              sw = window.innerWidth < 768 ? window.innerWidth * 0.45 : window.innerWidth * 0.17
              sh = sw * (4 / 3)
            }

            // ── End position: the middle category card ──
            const ex = cardRect.left
            const ey = cardRect.top
            const ew = cardRect.width
            const eh = cardRect.height

            // ── Motion progress with easing ──
            // The image should arrive at ~70% of the total scroll so
            // it overlaps with the middle card reveal
            const moveEnd = 0.7
            const rawMove = Math.min(progress / moveEnd, 1)
            // Smooth cubic ease for the flight
            const t = rawMove < 0.5
              ? 4 * rawMove * rawMove * rawMove
              : 1 - Math.pow(-2 * rawMove + 2, 3) / 2

            // ── Interpolate position with a subtle arc ──
            // Add vertical arc: at t=0.5 the image dips ~8vh below
            // the straight line, creating a natural gravity feel
            const arcHeight = window.innerHeight * 0.08
            const arcOffset = Math.sin(t * Math.PI) * arcHeight

            const currentX = sx + (ex - sx) * t
            const currentY = sy + (ey - sy) * t + arcOffset
            const currentW = sw + (ew - sw) * t
            const currentH = sh + (eh - sh) * t

            // Border radius: rounded → sharp
            const currentRadius = 16 * (1 - t)

            // Scale: slight overshoot for organic feel
            const scaleBoost = Math.sin(t * Math.PI) * 0.05
            const currentScale = 1 + scaleBoost

            // Shadow: stronger mid-flight, subtle at rest
            const shadowIntensity = Math.sin(t * Math.PI) * 40

            // ── Opacity ──
            // Fade in 0→10%, fully visible 10→60%, fade out 60→80%
            let opacity = 0
            if (progress < 0.06) {
              opacity = progress / 0.06
            } else if (progress < 0.55) {
              opacity = 1
            } else if (progress < 0.78) {
              opacity = 1 - ((progress - 0.55) / 0.23)
            } else {
              opacity = 0
            }

            gsap.set(floatingEl, {
              left: currentX,
              top: currentY,
              width: currentW,
              height: currentH,
              borderRadius: currentRadius,
              scale: currentScale,
              opacity: opacity,
              visibility: opacity > 0.005 ? 'visible' : 'hidden',
              boxShadow: `0 ${shadowIntensity * 0.5}px ${shadowIntensity}px rgba(0,0,0,${0.08 + shadowIntensity * 0.003})`,
            })
          }
        })
      })

      return () => ctx.revert()
    }, 600)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      ref={floatingRef}
      className="overflow-hidden border border-black/5"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 200,
        height: 300,
        zIndex: 9999,
        opacity: 0,
        visibility: 'hidden' as const,
        pointerEvents: 'none' as const,
        willChange: 'transform, opacity',
      }}
    >
      <Image
        src="/assets/amber_tee_lifestyle_1779130179005.png"
        alt="Transition Image"
        fill
        className="object-cover object-center"
        priority
      />
    </div>
  )
}
