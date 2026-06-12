import type { ChatMessage } from "@/types/chat"

interface Props {
  message: ChatMessage
  isOwn: boolean
}

export default function ChatBubble({ message, isOwn }: Props) {
  const time = new Date(message.createdAt).toLocaleTimeString("es-BO", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-0.5`}>
      <div className={`relative max-w-[75%] ${isOwn ? "mr-2" : "ml-2"}`}>

        {!isOwn && (
          <div
            className="absolute -left-1.5 bottom-0 w-3 h-3 bg-white"
            style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
          />
        )}

        {isOwn && (
          <div
            className="absolute -right-1.5 bottom-0 w-3 h-3 bg-violet-600"
            style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}
          />
        )}

        <div
          className={`px-3 py-2 text-sm shadow-sm ${
            isOwn
              ? "bg-violet-600 text-white rounded-t-2xl rounded-bl-2xl rounded-br-md"
              : "bg-white text-gray-800 rounded-t-2xl rounded-br-2xl rounded-bl-md"
          }`}
        >
          <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>

          <p suppressHydrationWarning className={`text-[10px] text-right -mb-0.5 mt-0.5 ${isOwn ? "text-violet-200" : "text-gray-400"}`}>
            {time}
          </p>
        </div>

      </div>
    </div>
  )
}
