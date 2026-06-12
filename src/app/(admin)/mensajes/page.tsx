"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import AdminShell from "@/components/admin/home/AdminShell"
import AdminChatPageClient from "@/components/admin/chat/AdminChatPageClient"
import { fetchChats } from "@/app/(explorarTienda)/api/chat.api"
import { getMySubscription } from "@/lib/api/subscriptions"
import type { ChatConversation } from "@/types/chat"
import type { MySubscription } from "@/lib/api/subscriptions"

export default function AdminChatPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [subscription, setSubscription] = useState<MySubscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.backendToken) return
    const token = session.user.backendToken
    Promise.all([
      fetchChats(token, "VENDOR"),
      getMySubscription(token),
    ]).then(([convs, sub]) => {
      setConversations(convs)
      setSubscription(sub)
    }).finally(() => setLoading(false))
  }, [session?.user?.backendToken])

  const isExpired = subscription?.status === "TRIAL_EXPIRED" || subscription?.status === "PENDING_PAYMENT"
  const noChat = !loading && subscription !== null && !subscription.hasChat

  return (
    <AdminShell title="Mensajes" subtitle="Conversaciones con tus clientes" noPadding hideDesktopHeader>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <AdminChatPageClient initialConversations={conversations} />

          {noChat && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm mx-4 flex flex-col items-center gap-5 text-center">
                <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center">
                  <ChatBlockIcon />
                </div>

                {isExpired ? (
                  <>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Plan caducado</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Verifica que tu plan no esté caducado para acceder al chat con tus clientes.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Actualiza tu plan</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        El chat con clientes está disponible desde el <strong>Plan Intermedio</strong>. Mejora tu plan para usar esta función.
                      </p>
                    </div>
                  </>
                )}

                <button
                  onClick={() => router.push("/planes")}
                  className="w-full py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm transition active:scale-95"
                >
                  Obtener un plan
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </AdminShell>
  )
}

function ChatBlockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <line x1="9" y1="9" x2="15" y2="15" />
      <line x1="15" y1="9" x2="9" y2="15" />
    </svg>
  )
}
