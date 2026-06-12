export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  senderRole: "CLIENT" | "VENDOR"
  text: string
  read: boolean
  createdAt: string
  storeId?: string
}

export interface ChatConversation {
  conversationId: string
  store: { id: string; name: string; logoUrl: string | null }
  client: { id: string; name: string; avatarUrl: string | null }
  lastMessage: string | null
  lastMessageAt: string
  unreadCount: number
}
