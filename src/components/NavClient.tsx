'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/destinos', label: 'Destinos' },
  { href: '/sobre', label: 'Sobre' },
]

export default function NavClient() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-1">
        {navLinks.map((l) => {
          const active = pathname === l.href
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                active
                  ? 'bg-nomade-orange text-white shadow-[2px_2px_0px_0px_rgba(26,26,46,0.15)]'
                  : 'text-gray-600 hover:text-nomade-orange hover:bg-nomade-orange/5'
              }`}
            >
              {l.label}
            </Link>
          )
        })}
      </nav>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        <span className={`block w-5 h-0.5 bg-gray-700 transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block w-5 h-0.5 bg-gray-700 transition-all ${open ? 'opacity-0' : ''}`} />
        <span className={`block w-5 h-0.5 bg-gray-700 transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Mobile menu */}
      {open && (
        <nav id="mobile-menu" className="md:hidden absolute top-full left-0 right-0 border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-body text-sm font-medium text-gray-600 hover:text-nomade-orange transition-colors px-3 py-2 rounded-lg hover:bg-nomade-orange/5"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </>
  )
}
