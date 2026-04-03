import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'
import NavClient from './NavClient'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between relative">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">✈️</span>
          <span className="font-heading font-bold text-lg text-nomade-dark group-hover:text-nomade-orange transition-colors">
            {SITE_NAME}
          </span>
        </Link>

        <NavClient />
      </div>
    </header>
  )
}
