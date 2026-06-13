"use client"

import { useState } from "react"
import Image from "next/image"
import type { ChatMessage } from "@/types/chat"

interface Props {
  message: ChatMessage
  isOwn: boolean
}

export default function ChatBubble({ message, isOwn }: Props) {
  const [lightbox, setLightbox] = useState(false)

  const time = new Date(message.createdAt).toLocaleTimeString("es-BO", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <>
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
            className={`text-sm shadow-sm overflow-hidden ${
              isOwn
                ? "bg-violet-600 text-white rounded-t-2xl rounded-bl-2xl rounded-br-md"
                : "bg-white text-gray-800 rounded-t-2xl rounded-br-2xl rounded-bl-md"
            } ${message.multimediaUrl && !message.text ? "p-1" : "px-3 py-2"}`}
          >
            {message.multimediaUrl && (
              <button onClick={() => setLightbox(true)} className="block w-full">
                <Image
                  src={message.multimediaUrl}
                  alt="imagen"
                  width={240}
                  height={240}
                  className="rounded-xl object-cover max-h-60 w-auto cursor-pointer hover:opacity-90 transition-opacity"
                />
              </button>
            )}

            {message.text && (
              <p className={`whitespace-pre-wrap leading-relaxed ${message.multimediaUrl ? "mt-1 px-2 pb-1" : ""}`}>
                {message.text}
              </p>
            )}

            <p suppressHydrationWarning className={`text-[10px] text-right -mb-0.5 mt-0.5 ${message.multimediaUrl && !message.text ? "px-2 pb-1" : ""} ${isOwn ? "text-violet-200" : "text-gray-400"}`}>
              {time}
            </p>
          </div>

        </div>
      </div>

      {lightbox && message.multimediaUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <Image
            src={message.multimediaUrl}
            alt="imagen completa"
            width={900}
            height={900}
            className="max-w-full max-h-full object-contain rounded-xl"
          />
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      )}
    </>
  )
}
