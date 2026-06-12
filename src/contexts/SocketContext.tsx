"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { io, type Socket } from "socket.io-client"

interface SocketContextValue {
  socket: Socket | null
  connected: boolean
}

const SocketContext = createContext<SocketContextValue>({ socket: null, connected: false })

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const token = session?.user?.backendToken
    if (!token) return

    const instance = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    })

    instance.on("connect", () => {
      setConnected(true)
      instance.emit("register", { token })
      setSocket(instance)
    })

    instance.on("disconnect", () => setConnected(false))

    instance.on("auth_error", () => instance.disconnect())

    return () => {
      instance.disconnect()
      setSocket(null)
      setConnected(false)
    }
  }, [session?.user?.backendToken])

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  return useContext(SocketContext)
}
