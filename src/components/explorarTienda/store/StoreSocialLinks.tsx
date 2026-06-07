import SocialIcon, { SOCIAL_NETWORK_LABELS, SOCIAL_NETWORK_COLORS } from "@/components/ui/SocialIcon"
import type { SocialNetwork } from "@/types/admin"

interface Link {
  id: string
  network: SocialNetwork
  url: string
}

interface Props {
  links: Link[]
}

export default function StoreSocialLinks({ links }: Props) {
  if (links.length === 0) return null

  return (
    <div className="flex items-center gap-3 flex-wrap pt-1">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={SOCIAL_NETWORK_LABELS[link.network]}
          className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          style={{ backgroundColor: `${SOCIAL_NETWORK_COLORS[link.network]}18` }}
        >
          <SocialIcon network={link.network} size={18} />
        </a>
      ))}
    </div>
  )
}
