import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-24 text-center">
      <p className="text-6xl mb-6">🗺️</p>
      <h1 className="font-heading font-bold text-4xl text-nomade-dark mb-4">
        Página não encontrada
      </h1>
      <p className="text-gray-500 mb-8">
        Parece que você se perdeu no mapa. Não tem problema, até os melhores viajantes se perdem.
      </p>
      <Link
        href="/"
        className="inline-block bg-nomade-orange text-white font-medium px-6 py-3 rounded-full hover:bg-orange-600 transition-colors"
      >
        Voltar para o início
      </Link>
    </div>
  )
}
