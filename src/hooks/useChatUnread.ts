"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { useSocket } from "@/contexts/SocketContext"
import { fetchChats } from "@/app/(explorarTienda)/api/chat.api"
import type { ChatMessage } from "@/types/chat"

export function useChatUnread(role: "CLIENT" | "VENDOR") {
  const { data: session } = useSession()
  const { socket } = useSocket()
  const pathname = usePathname()
  const [unread, setUnread] = useState(0)

  const chatPath = role === "VENDOR" ? "/mensajes" : "/chat"

  // Cargar conteo inicial desde el backend
  useEffect(() => {
    if (!session?.user?.backendToken) return
    fetchChats(session.user.backendToken, role).then((convs) => {
      const total = convs.reduce((sum, c) => sum + c.unreadCount, 0)
      setUnread(total)
    })
  }, [session?.user?.backendToken])

  // Escuchar mensajes nuevos en tiempo real
  useEffect(() => {
    if (!socket) return
    const myId = session?.user?.id
    const handler = (msg: ChatMessage) => {
      // Solo contar si NO lo envié yo
      if (msg.senderId !== myId) {
        setUnread((prev) => prev + 1)
      }
    }
    socket.on("new_message", handler)
    return () => { socket.off("new_message", handler) }
  }, [socket, session?.user?.id])

  // Resetear al entrar a la página de chat
  useEffect(() => {
    if (pathname === chatPath) {
      const timer = setTimeout(() => setUnread(0), 0)
      return () => clearTimeout(timer)
    }
  }, [pathname, chatPath])

  return unread
}
