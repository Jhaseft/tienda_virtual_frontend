import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { fetchChats } from "@/app/(explorarTienda)/api/chat.api"
import ChatPageClient from "@/components/explorarTienda/chat/ChatPageClient"

interface Props {
  searchParams: Promise<{ storeId?: string; storeName?: string; storeLogoUrl?: string }>
}

export default async function ChatPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.backendToken) redirect("/signin?callbackUrl=/chat")

  const { storeId, storeName, storeLogoUrl } = await searchParams
  const conversations = await fetchChats(session.user.backendToken)
  const existingConv = storeId
    ? conversations.find((c) => c.store.id === storeId)
    : null

  return (
    <div className="fixed inset-0 top-0 md:top-16.25 bottom-0 pb-0 bg-white overflow-hidden">
      <ChatPageClient
        initialConversations={conversations}
        pendingStoreId={existingConv ? null : storeId}
        pendingStoreName={existingConv ? null : (storeName ?? null)}
        pendingStoreLogoUrl={existingConv ? null : (storeLogoUrl ?? null)}
        initialActiveId={existingConv?.conversationId ?? null}
      />
    </div>
  )
}
