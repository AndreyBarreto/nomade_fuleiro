import { Fragment } from 'react'

interface Stat {
  value: string | number
  label: string
  color: string
}

export default function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      {stats.map((stat, i) => (
        <Fragment key={stat.label}>
          {i > 0 && <div className="w-px h-10 bg-white/20 hidden sm:block" />}
          <div className="text-center">
            <p className={`font-heading font-bold text-3xl ${stat.color}`}>{stat.value}</p>
            <p className="text-white/50 text-xs uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        </Fragment>
      ))}
    </div>
  )
}
