"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import type { ChatConversation } from "@/types/chat"
import AdminChatInbox from "./AdminChatInbox"
import AdminChatWindow from "./AdminChatWindow"

interface Props {
  initialConversations: ChatConversation[]
}

export default function AdminChatPageClient({ initialConversations }: Props) {
  const [conversations, setConversations] = useState<ChatConversation[]>(initialConversations)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showList, setShowList] = useState(true)
  const [search, setSearch] = useState("")

  const filtered = search.trim()
    ? conversations.filter((c) => c.client.name.toLowerCase().includes(search.toLowerCase()))
    : conversations

  const activeConversation = conversations.find((c) => c.conversationId === activeId) ?? null

  function handleSelect(conv: ChatConversation) {
    setActiveId(conv.conversationId)
    setShowList(false)
    setConversations((prev) =>
      prev.map((c) => c.conversationId === conv.conversationId ? { ...c, unreadCount: 0 } : c)
    )
  }

  function handleMessageReceived(conversationId: string, text: string, createdAt: string, isOwn: boolean) {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.conversationId !== conversationId) return c
        const isActive = c.conversationId === activeId
        return {
          ...c,
          lastMessage: text,
          lastMessageAt: createdAt,
          unreadCount: isOwn || isActive ? 0 : c.unreadCount + 1,
        }
      })
    )
  }

  return (
    <div className="flex h-full min-h-0">
      <div className={`w-full md:w-80 md:flex flex-col border-r border-gray-100 bg-white ${showList ? "flex" : "hidden"} md:flex`}>
        <div className="px-4 pt-4 pb-3 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-3">Mensajes</h2>
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
            <Search size={14} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cliente..."
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <AdminChatInbox
            conversations={filtered}
            activeId={activeId}
            onSelect={handleSelect}
          />
        </div>
      </div>

      <div className={`flex-1 flex flex-col min-h-0 ${showList ? "hidden md:flex" : "flex"}`}>
        <AdminChatWindow
          conversation={activeConversation}
          onMessageReceived={(conversationId, text, createdAt, isOwn) =>
            handleMessageReceived(conversationId, text, createdAt, isOwn)
          }
          onBack={() => setShowList(true)}
        />
      </div>
    </div>
  )
}

