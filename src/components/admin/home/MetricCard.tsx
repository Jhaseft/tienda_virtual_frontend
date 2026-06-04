import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

interface Props {
  title: string
  value: string
  hint?: string
  href?: string
  Icon?: LucideIcon
  iconBg?: string
  iconColor?: string
}

export default function MetricCard({ title, value, hint, href, Icon, iconBg = "bg-violet-50", iconColor = "text-violet-600" }: Props) {
  const content = (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-4">
        {Icon && (
          <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
            <Icon size={18} className={iconColor} strokeWidth={2} />
          </div>
        )}
        {hint && href && (
          <ArrowUpRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
        )}
      </div>
      <p className="text-3xl font-bold text-gray-900 leading-none">{value}</p>
      <p className="text-sm text-gray-400 mt-1.5 font-medium">{title}</p>
      {hint && (
        <p className="text-xs text-violet-600 font-semibold mt-3">{hint} →</p>
      )}
    </article>
  )

  if (href) return <Link href={href} className="block">{content}</Link>
  return content
}
