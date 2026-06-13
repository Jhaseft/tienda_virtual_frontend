"use client"

import { useState } from "react"
import type { ChatConversation } from "@/types/chat"
import ChatList from "./ChatList"
import ChatWindow from "./ChatWindow"
import { Search } from "lucide-react"

interface Props {
  initialConversations: ChatConversation[]
  // si viene desde página de tienda con ?storeId=X
  pendingStoreId?: string | null
  pendingStoreName?: string | null
  pendingStoreLogoUrl?: string | null
  // si ya existe conversación con esa tienda, se pre-selecciona
  initialActiveId?: string | null
}

export default function ChatPageClient({
  initialConversations,
  pendingStoreId,
  pendingStoreName,
  pendingStoreLogoUrl,
  initialActiveId,
}: Props) {
  const [conversations, setConversations] = useState<ChatConversation[]>(initialConversations)
  const [activeId, setActiveId] = useState<string | null>(initialActiveId ?? null)
  const [showList, setShowList] = useState(!initialActiveId && !pendingStoreId)
  const [search, setSearch] = useState("")

  const filtered = search.trim()
    ? conversations.filter((c) => c.store.name.toLowerCase().includes(search.toLowerCase()))
    : conversations

  const activeConversation = conversations.find((c) => c.conversationId === activeId) ?? null

  function handleSelectConversation(conv: ChatConversation) {
    setActiveId(conv.conversationId)
    setShowList(false)
    // Limpiar badge de no leídos al abrir la conversación
    setConversations((prev) =>
      prev.map((c) => c.conversationId === conv.conversationId ? { ...c, unreadCount: 0 } : c)
    )
  }

  function handleNewConversation(conv: ChatConversation) {
    setConversations((prev) => {
      const exists = prev.find((c) => c.conversationId === conv.conversationId)
      return exists ? prev : [conv, ...prev]
    })
    setActiveId(conv.conversationId)
  }

  function handleMessageReceived(conversationId: string, text: string, createdAt: string, isOwn: boolean, currentActiveId: string | null) {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.conversationId !== conversationId) return c
        const isActive = c.conversationId === currentActiveId
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
              placeholder="Buscar conversación..."
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ChatList
            conversations={filtered}
            activeId={activeId}
            onSelect={handleSelectConversation}
          />
        </div>
      </div>

      <div className={`flex-1 flex flex-col min-h-0 ${showList ? "hidden md:flex" : "flex"}`}>
        <ChatWindow
          conversation={activeConversation}
          pendingStoreId={activeConversation ? null : pendingStoreId}
          pendingStoreName={activeConversation ? null : pendingStoreName}
          pendingStoreLogoUrl={activeConversation ? null : pendingStoreLogoUrl}
          onNewConversation={handleNewConversation}
          onMessageReceived={(conversationId, text, createdAt, isOwn) =>
            handleMessageReceived(conversationId, text, createdAt, isOwn, activeId)
          }
          onBack={() => setShowList(true)}
        />
      </div>
    </div>
  )
}

