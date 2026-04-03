'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { PostImage } from '@/lib/posts'

export default function PhotoGallery({ images }: { images: PostImage[] }) {
  const [lightbox, setLightbox] = useState<PostImage | null>(null)

  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [lightbox])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightbox) setLightbox(null)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [lightbox])

  if (!images?.length) return null

  return (
    <>
      <div className="not-prose grid grid-cols-2 md:grid-cols-3 gap-2 my-8">
        {images.map((img, i) => (
          <button
            key={img.src}
            onClick={() => setLightbox(img)}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 cursor-zoom-in"
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              priority={i === 0}
              loading={i === 0 ? undefined : 'lazy'}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {img.caption && (
              <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {img.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightbox(null)}
        >
          <Image
            src={lightbox.src}
            alt={lightbox.alt}
            width={lightbox.width}
            height={lightbox.height}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg w-auto h-auto"
          />
          {lightbox.caption && (
            <p className="mt-3 text-white/80 text-sm text-center">{lightbox.caption}</p>
          )}
          <button
            autoFocus
            aria-expanded={!!lightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl leading-none"
            onClick={() => setLightbox(null)}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
      )}
    </>
  )
}
