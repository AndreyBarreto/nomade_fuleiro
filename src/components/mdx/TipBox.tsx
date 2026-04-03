import type { ReactNode } from 'react'

type TipType = 'tip' | 'warning' | 'info'

const styles: Record<TipType, { border: string; bg: string; icon: string; label: string }> = {
  tip: { border: 'border-nomade-mint', bg: 'bg-nomade-mint/10', icon: '💡', label: 'Dica' },
  warning: { border: 'border-yellow-400', bg: 'bg-yellow-50', icon: '⚠️', label: 'Atenção' },
  info: { border: 'border-blue-400', bg: 'bg-blue-50', icon: 'ℹ️', label: 'Saiba mais' },
}

export default function TipBox({
  children,
  type = 'tip',
}: {
  children: ReactNode
  type?: TipType
}) {
  const s = styles[type]

  return (
    <div className={`not-prose my-6 border-l-4 ${s.border} ${s.bg} rounded-r-xl p-4`}>
      <p className="font-heading font-semibold text-sm mb-1">
        {s.icon} {s.label}
      </p>
      <div className="text-sm text-gray-700 leading-relaxed">{children}</div>
    </div>
  )
}
