import type { PracticalInfoData } from '@/lib/posts'

const fields: { key: keyof PracticalInfoData; label: string; icon: string }[] = [
  { key: 'currency', label: 'Moeda', icon: '💰' },
  { key: 'language', label: 'Idioma', icon: '🗣️' },
  { key: 'visa', label: 'Visto', icon: '📋' },
  { key: 'bestTime', label: 'Melhor época', icon: '🗓️' },
  { key: 'transport', label: 'Transporte', icon: '🚌' },
  { key: 'internet', label: 'Internet', icon: '📶' },
  { key: 'emergencyNumber', label: 'Emergência', icon: '🆘' },
]

export default function PracticalInfo({ info }: { info: PracticalInfoData }) {
  const rows = fields.filter((f) => info[f.key])
  if (!rows.length) return null

  return (
    <div className="not-prose my-8 rounded-2xl border border-gray-100 overflow-hidden">
      <div className="bg-nomade-orange px-5 py-3">
        <h3 className="font-heading font-semibold text-white text-sm">📌 Informações práticas</h3>
      </div>
      <dl className="divide-y divide-gray-100">
        {rows.map(({ key, label, icon }) => (
          <div key={key} className="flex items-start gap-3 px-5 py-3 text-sm">
            <span className="text-base">{icon}</span>
            <dt className="font-medium text-gray-700 w-32 shrink-0">{label}</dt>
            <dd className="text-gray-500">{String(info[key])}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
