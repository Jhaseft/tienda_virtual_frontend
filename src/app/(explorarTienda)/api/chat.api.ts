import type { ChatConversation, ChatMessage } from "@/types/chat"

const BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL}/messages`

export async function fetchChats(token: string, role: "CLIENT" | "VENDOR" = "CLIENT"): Promise<ChatConversation[]> {
  const res = await fetch(`${BASE}/chats?role=${role}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!res.ok) return []
  return res.json()
}

export async function fetchMessages(token: string, conversationId: string): Promise<ChatMessage[]> {
  const res = await fetch(`${BASE}?conversationId=${conversationId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!res.ok) return []
  return res.json()
}

export async function sendMessage(
  token: string,
  storeId: string,
  text: string,
  clientId?: string,
): Promise<ChatMessage | null> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ storeId, text, clientId }),
  })
  if (!res.ok) return null
  return res.json()
}

export async function replyMessage(
  token: string,
  conversationId: string,
  text: string,
): Promise<ChatMessage | null> {
  const res = await fetch(`${BASE}/reply`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ conversationId, text }),
  })
  if (!res.ok) return null
  return res.json()
}

export async function uploadChatMultimedia(
  token: string,
  file: File,
): Promise<{ multimediaUrl: string; multimediaPublicId: string } | null> {
  const formData = new FormData()
  formData.append("file", file)
  const res = await fetch(`${BASE}/upload-multimedia`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  if (!res.ok) return null
  return res.json()
}

export async function markAsRead(token: string, conversationId: string): Promise<void> {
  await fetch(`${BASE}/read`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ conversationId }),
  })
}
