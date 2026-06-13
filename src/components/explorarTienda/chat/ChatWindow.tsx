"use client"

import { useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import type { ChatConversation, ChatMessage } from "@/types/chat"
import { fetchMessages, markAsRead, uploadChatMultimedia } from "@/app/(explorarTienda)/api/chat.api"
import { useSocket } from "@/contexts/SocketContext"
import ChatBubble from "./ChatBubble"
import ChatBackground from "../../ui/ChatBackground"

interface Props {
  conversation: ChatConversation | null
  pendingStoreId?: string | null
  pendingStoreName?: string | null
  pendingStoreLogoUrl?: string | null
  onNewConversation: (conv: ChatConversation) => void
  onMessageReceived?: (conversationId: string, text: string, createdAt: string, isOwn: boolean) => void
  onBack?: () => void
}

export default function ChatWindow({ conversation, pendingStoreId, pendingStoreName, pendingStoreLogoUrl, onNewConversation, onMessageReceived, onBack }: Props) {
  const { data: session } = useSession()
  const { socket } = useSocket()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)
  const [pendingImage, setPendingImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const userId = session?.user?.id

  // Cargar historial al cambiar conversación
  useEffect(() => {
    if (!conversation || !session?.user?.backendToken) return
    const token = session.user.backendToken
    const convId = conversation.conversationId
    fetchMessages(token, convId).then((msgs) => setMessages(msgs))
    markAsRead(token, convId)
  }, [conversation?.conversationId, session?.user?.backendToken])

  // Escuchar mensajes en tiempo real
  useEffect(() => {
    if (!socket) return
    const onNew = (msg: ChatMessage) => {
      const relevantId = conversation?.conversationId
      if (msg.conversationId === relevantId) {
        setMessages((prev) => prev.some((m) => m.id === msg.id) ? prev : [...prev, msg])
      }
      onMessageReceived?.(msg.conversationId, msg.text ?? "", msg.createdAt, false)
    }
    // message_sent: confirmación del propio mensaje enviado (incluye conversationId nuevo)
    const onSent = (msg: ChatMessage) => {
      setMessages((prev) => prev.some((m) => m.id === msg.id) ? prev : [...prev, msg])
      onMessageReceived?.(msg.conversationId, msg.text ?? "", msg.createdAt, true)
      if (!conversation && pendingStoreId) {
        onNewConversation({
          conversationId: msg.conversationId,
          store: { id: pendingStoreId, name: pendingStoreName ?? "Tienda", logoUrl: null },
          client: { id: userId ?? "", name: "", avatarUrl: null },
          lastMessage: msg.text,
          lastMessageAt: msg.createdAt,
          unreadCount: 0,
        })
      }
    }
    socket.on("new_message", onNew)
    socket.on("message_sent", onSent)
    return () => {
      socket.off("new_message", onNew)
      socket.off("message_sent", onSent)
    }
  }, [socket, conversation, pendingStoreId, pendingStoreName, userId, onNewConversation, onMessageReceived])

  // Scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith("image/")) return
    setPendingImage(file)
    setPreviewUrl(URL.createObjectURL(file))
    e.target.value = ""
  }

  function clearImage() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPendingImage(null)
    setPreviewUrl(null)
  }

  async function handleSend() {
    if (!socket) return
    const trimmed = text.trim()
    if (!trimmed && !pendingImage) return

    setUploading(true)
    setSending(true)
    try {
      let multimediaUrl: string | undefined
      let multimediaPublicId: string | undefined

      if (pendingImage && session?.user?.backendToken) {
        const uploaded = await uploadChatMultimedia(session.user.backendToken, pendingImage)
        if (uploaded) {
          multimediaUrl = uploaded.multimediaUrl
          multimediaPublicId = uploaded.multimediaPublicId
        }
        clearImage()
      }

      if (conversation) {
        socket.emit("reply_message", { conversationId: conversation.conversationId, text: trimmed || undefined, multimediaUrl, multimediaPublicId })
      } else if (pendingStoreId) {
        socket.emit("send_message", { storeId: pendingStoreId, text: trimmed || undefined, multimediaUrl, multimediaPublicId })
      }
      setText("")
    } finally {
      setUploading(false)
      setSending(false)
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const storeName = conversation?.store.name ?? pendingStoreName ?? "Tienda"
  const storeLogoUrl = conversation?.store.logoUrl ?? pendingStoreLogoUrl ?? null
  const storeInitials = storeName.slice(0, 2).toUpperCase()
  const hasTarget = !!conversation || !!pendingStoreId

  if (!hasTarget) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
          <SelectIcon />
        </div>
        <p className="text-sm font-semibold text-gray-700">Selecciona una conversación</p>
        <p className="text-xs text-gray-400">o escríbele a una tienda desde su página</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center gap-3 px-3 py-2.5 bg-white border-b border-gray-100 shadow-sm">
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors shrink-0 -ml-1"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        {storeLogoUrl ? (
          <Image src={storeLogoUrl} alt={storeName} width={42} height={42} className="w-10 h-10 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-white">{storeInitials}</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold text-gray-900 leading-tight truncate">{storeName}</p>
          <p className="text-xs text-gray-400 leading-tight">Tienda</p>
        </div>
      </div>

      <ChatBackground>
        {messages.length === 0 && (
          <p className="text-center text-xs text-gray-400 mt-8">
            {conversation ? "No hay mensajes aún" : `Inicia la conversación con ${storeName}`}
          </p>
        )}
        {groupMessagesByDate(messages).map(({ date, msgs }) => (
          <div key={date} className="flex flex-col gap-1">
            <div className="flex justify-center my-2">
              <span className="bg-white/80 backdrop-blur-sm text-gray-500 text-[11px] font-medium px-3 py-1 rounded-full shadow-sm border border-gray-100">
                {date}
              </span>
            </div>
            {msgs.map((msg) => (
              <ChatBubble key={msg.id} message={msg} isOwn={msg.senderId === userId} />
            ))}
          </div>
        ))}
        <div ref={bottomRef} />
      </ChatBackground>

      <div className="px-4 py-3 border-t border-gray-100 bg-white">
        {previewUrl && (
          <div className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded-xl border border-gray-200">
            <Image src={previewUrl} alt="preview" width={56} height={56} className="w-14 h-14 rounded-lg object-cover shrink-0" />
            <p className="flex-1 text-xs text-gray-500 truncate">{pendingImage?.name}</p>
            <button onClick={clearImage} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        <div className="flex items-end gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-10 h-10 flex items-center justify-center rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors shrink-0 disabled:opacity-40"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
          </button>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Escribe un mensaje..."
            rows={1}
            className="flex-1 resize-none rounded-2xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 transition-all max-h-32"
          />
          <button
            onClick={handleSend}
            disabled={(!text.trim() && !pendingImage) || sending || uploading}
            className="w-10 h-10 rounded-2xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 flex items-center justify-center transition-colors shrink-0"
          >
            {uploading ? <SpinnerIcon /> : <SendIcon />}
          </button>
        </div>
      </div>
    </div>
  )
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}

function groupMessagesByDate(messages: ChatMessage[]): { date: string; msgs: ChatMessage[] }[] {
  const groups: { date: string; msgs: ChatMessage[] }[] = []
  for (const msg of messages) {
    const d = new Date(msg.createdAt)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    let label: string
    if (d.toDateString() === today.toDateString()) label = "Hoy"
    else if (d.toDateString() === yesterday.toDateString()) label = "Ayer"
    else label = d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })
    const last = groups[groups.length - 1]
    if (last && last.date === label) last.msgs.push(msg)
    else groups.push({ date: label, msgs: [msg] })
  }
  return groups
}

function SelectIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
