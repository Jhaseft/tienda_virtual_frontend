"use client"

import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"

interface Props {
  productsUsed: number
  productsLimit: number
  status: string
}

export default function ProductLimitBlock({ productsUsed, productsLimit, status }: Props) {
  const router = useRouter()

  const message =
    status === "TRIAL_EXPIRED"
      ? "Tu periodo de prueba ha vencido"
      : status === "TRIAL"
        ? `Alcanzaste el límite del periodo de prueba`
        : `Alcanzaste el límite de tu plan`

  const sub =
    status === "TRIAL_EXPIRED"
      ? "Elige un plan para seguir agregando productos"
      : `Usaste ${productsUsed} de ${productsLimit} productos permitidos`

  return (
    <div className="flex flex-col items-center gap-6 pt-12 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center">
        <Lock size={36} className="text-violet-500" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-gray-900">{message}</h2>
        <p className="text-sm text-gray-500 mt-1">{sub}</p>
      </div>
      <button
        onClick={() => router.push("/planes")}
        className="w-full max-w-xs bg-violet-600 text-white py-3 rounded-2xl font-semibold text-sm active:scale-95 transition"
      >
        Ver planes
      </button>
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-400 underline"
      >
        Volver
      </button>
    </div>
  )
}
