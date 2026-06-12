"use client"

import "./ChatBackground.css"

export default function ChatBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="chat-bg">
      <div className="chat-bg-inner">
        {children}
      </div>
    </div>
  )
}
