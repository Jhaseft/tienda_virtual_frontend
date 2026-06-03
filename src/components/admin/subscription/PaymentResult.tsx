"use client"

import { CheckCircle, XCircle } from "lucide-react"

interface Props {
  type: "success" | "failed" | "error"
  message: string
  sub: string
  buttonLabel: string
  onAction: () => void
}

export default function PaymentResult({ type, message, sub, buttonLabel, onAction }: Props) {
  const isSuccess = type === "success"
  return (
    <div className="flex flex-col items-center gap-6 pt-10 px-4">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isSuccess ? "bg-emerald-100" : "bg-red-100"}`}>
        {isSuccess
          ? <CheckCircle size={40} className="text-emerald-500" />
          : <XCircle size={40} className="text-red-500" />
        }
      </div>
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900">{message}</h2>
        <p className="text-sm text-gray-500 mt-1">{sub}</p>
      </div>
      <button
        onClick={onAction}
        className={`w-full max-w-xs py-3 rounded-2xl font-semibold text-sm active:scale-95 transition text-white ${isSuccess ? "bg-violet-600" : "bg-gray-900"}`}
      >
        {buttonLabel}
      </button>
    </div>
  )
}
