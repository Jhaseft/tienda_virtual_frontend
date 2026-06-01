import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface Props {
  title: string
  value: string
  hint?: string
  href?: string
  Icon?: LucideIcon
  from?: string
  to?: string
  shadow?: string
}

export default function MetricCard({
  title, value, hint, href,
  Icon,
  from = "from-violet-500",
  to = "to-violet-400",
  shadow = "shadow-violet-100",
}: Props) {
  const content = (
    <article className={`relative md:p-2 bg-linear-to-br ${from} ${to} rounded-2xl shadow-lg ${shadow} overflow-hidden`}>

      <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
      <div className="absolute -bottom-6 -left-3 w-16 h-16 rounded-full bg-white/10" />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          {Icon && (
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Icon size={17} className="text-white" strokeWidth={2.5} />
            </div>
          )}
        </div>

        <p className="text-3xl font-bold text-white leading-none text-center">{value}</p>
        <p className="text-sm font-semibold text-white/80 mt-1 text-center">{title}</p>

        {hint && (
          <div className="flex items-center gap-0.5 mt-3">
            <span className="text-xs font-semibold text-white/70">{hint}</span>
            <ChevronRight size={12} className="text-white/70" />
          </div>
        )}
      </div>
    </article>
  )

  if (href) return <Link href={href} className="block">{content}</Link>
  return content
}
