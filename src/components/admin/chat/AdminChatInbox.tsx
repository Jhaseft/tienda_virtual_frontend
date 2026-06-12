import Image from "next/image"
import type { ChatConversation } from "@/types/chat"

interface Props {
  conversations: ChatConversation[]
  activeId: string | null
  onSelect: (conv: ChatConversation) => void
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === today.toDateString()) {
    return d.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" })
  }
  if (d.toDateString() === yesterday.toDateString()) return "Ayer"
  return d.toLocaleDateString("es-BO", { day: "2-digit", month: "short" })
}

export default function AdminChatInbox({ conversations, activeId, onSelect }: Props) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
          <ChatEmptyIcon />
        </div>
        <p className="text-sm text-gray-500 font-medium">Sin conversaciones aún</p>
        <p className="text-xs text-gray-400">Aquí aparecerán los mensajes de tus clientes</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col divide-y divide-gray-50">
      {conversations.map((conv) => {
        const isActive = conv.conversationId === activeId
        const initials = conv.client.name.slice(0, 2).toUpperCase()

        return (
          <button
            key={conv.conversationId}
            onClick={() => onSelect(conv)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${
              isActive ? "bg-violet-50" : "hover:bg-gray-50"
            }`}
          >
            {conv.client.avatarUrl ? (
              <Image
                src={conv.client.avatarUrl}
                alt={conv.client.name}
                width={44}
                height={44}
                className="w-11 h-11 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-violet-600">{initials}</span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className={`text-sm font-semibold truncate ${isActive ? "text-violet-700" : "text-gray-900"}`}>
                  {conv.client.name}
                </p>
                <p suppressHydrationWarning className="text-[11px] text-gray-400 shrink-0">
                  {formatTime(conv.lastMessageAt)}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <p className={`text-xs truncate ${conv.unreadCount > 0 ? "font-semibold text-gray-800" : "text-gray-400"}`}>
                  {conv.lastMessage ?? "Sin mensajes aún"}
                </p>
                {conv.unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
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
