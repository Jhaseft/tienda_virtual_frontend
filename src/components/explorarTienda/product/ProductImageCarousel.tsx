"use client"

import Image from "next/image"
import { useState, useEffect, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface Props {
  photos: { url: string; order: number }[]
  productName: string
}

export default function ProductImageCarousel({ photos, productName }: Props) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1) // 1 = siguiente, -1 = anterior
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const next = useCallback(() => {
    setDirection(1)
    setCurrent(i => (i + 1) % photos.length)
  }, [photos.length])

  function prev() {
    setDirection(-1)
    setCurrent(i => (i - 1 + photos.length) % photos.length)
  }

  function goTo(index: number) {
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }

  useEffect(() => {
    if (photos.length <= 1 || paused) return
    intervalRef.current = setInterval(next, 3500)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [next, paused, photos.length])

  if (photos.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-3xl flex items-center justify-center">
        <ImagePlaceholder />
      </div>
    )
  }

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  }

  return (
    <div
      className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gray-100 select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <Image
            src={photos[current].url}
            alt={`${productName} - foto ${current + 1}`}
            fill
            className="object-cover"
            priority={current === 0}
          />
        </motion.div>
      </AnimatePresence>

      {photos.length > 1 && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full z-10"
        >
          {current + 1}/{photos.length}
        </motion.span>
      )}

      {photos.length > 1 && (
        <>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors z-10"
            aria-label="Foto anterior"
          >
            <ChevronLeft />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors z-10"
            aria-label="Foto siguiente"
          >
            <ChevronRight />
          </motion.button>
        </>
      )}

      {photos.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
          {photos.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i)}
              animate={{
                width: i === current ? 16 : 6,
                backgroundColor: i === current ? "#ffffff" : "rgba(255,255,255,0.5)",
              }}
              transition={{ duration: 0.3 }}
              className="h-1.5 rounded-full"
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 18l6-6-6-6" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ImagePlaceholder() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="#d1d5db" strokeWidth="1.5" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="#d1d5db" />
      <path d="M3 15l5-5 4 4 3-3 6 6" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
