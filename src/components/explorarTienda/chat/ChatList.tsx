import Image from "next/image"
import type { ChatConversation } from "@/types/chat"

interface Props {
  conversations: ChatConversation[]
  activeId: string | null
  onSelect: (conv: ChatConversation) => void
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const isYesterday = date.toDateString() === yesterday.toDateString()

  if (isToday) return date.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" })
  if (isYesterday) return "Ayer"
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "2-digit" })
}

export default function ChatList({ conversations, activeId, onSelect }: Props) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
          <ChatEmptyIcon />
        </div>
        <p className="text-sm text-gray-500 font-medium">Aún no tienes conversaciones</p>
        <p className="text-xs text-gray-400">Escríbele a una tienda para empezar</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {conversations.map((conv) => {
        const isActive = conv.conversationId === activeId
        const initials = conv.store.name.slice(0, 2).toUpperCase()
        const hasUnread = conv.unreadCount > 0

        return (
          <button
            key={conv.conversationId}
            onClick={() => onSelect(conv)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-gray-50 ${
              isActive ? "bg-violet-50" : "hover:bg-gray-50"
            }`}
          >
            <div className="shrink-0">
              {conv.store.logoUrl ? (
                <Image
                  src={conv.store.logoUrl}
                  alt={conv.store.name}
                  width={50}
                  height={50}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-violet-500 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{initials}</span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <p className={`text-sm font-semibold truncate ${isActive ? "text-violet-700" : "text-gray-900"}`}>
                  {conv.store.name}
                </p>
                <p suppressHydrationWarning className={`text-[11px] shrink-0 ${hasUnread ? "text-violet-600 font-semibold" : "text-gray-400"}`}>
                  {formatTime(conv.lastMessageAt)}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className={`text-xs truncate ${hasUnread ? "font-semibold text-gray-800" : "text-gray-500"}`}>
                  {conv.lastMessage ?? "Sin mensajes aún"}
                </p>
                {hasUnread && (
                  <span className="shrink-0 min-w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center px-1">
                    {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

function ChatEmptyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
