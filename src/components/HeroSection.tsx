interface HeroSectionProps {
  children: React.ReactNode
}

export default function HeroSection({ children }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-nomade-dark py-20 px-4">
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-nomade-orange blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-nomade-mint blur-3xl" />
      </div>
      <div className="relative">
        {children}
      </div>
    </section>
  )
}
