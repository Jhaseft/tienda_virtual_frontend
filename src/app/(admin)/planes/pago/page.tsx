"use client"

import { useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import AdminShell from "@/components/admin/home/AdminShell"
import LoadingState from "@/components/admin/home/LoadingState"
import PaymentResult from "@/components/admin/subscription/PaymentResult"
import QrSteps from "@/components/admin/subscription/QrSteps"
import QrCard from "@/components/admin/subscription/QrCard"
import { initQrPayment, getQrPaymentStatus } from "@/lib/api/subscriptions"

type Stage = "loading" | "qr" | "success" | "failed" | "error"

export default function PagoQrPage() {
  const { data: session, status } = useSession()
  const token = session?.user.backendToken
  const router = useRouter()
  const params = useSearchParams()
  const planId = params.get("planId") ?? ""

  const [stage, setStage] = useState<Stage>("loading")
  const [qrImage, setQrImage] = useState<string | null>(null)
  const [amount, setAmount] = useState(0)
  const [dueDate, setDueDate] = useState("")
  const [paymentId, setPaymentId] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (status === "loading" || !token || !planId) return
    initQrPayment(token, planId)
      .then((res) => {
        setPaymentId(res.paymentId)
        setQrImage(res.qrImage)
        setAmount(res.amount)
        setDueDate(res.dueDate)
        setStage("qr")
      })
      .catch((e) => {
        setErrorMsg(e?.message ?? "Error al generar el QR")
        setStage("error")
      })
  }, [token, status, planId])

  useEffect(() => {
    if (stage !== "qr" || !token || !paymentId) return
    pollingRef.current = setInterval(async () => {
      try {
        const res = await getQrPaymentStatus(token, paymentId)
        if (res.status === "COMPLETED") { clearInterval(pollingRef.current!); setStage("success") }
        else if (res.status === "FAILED") { clearInterval(pollingRef.current!); setStage("failed") }
      } catch { /* seguimos intentando */ }
    }, 4000)
    return () => clearInterval(pollingRef.current!)
  }, [stage, token, paymentId])

  if (stage === "loading") return (
    <AdminShell title="Procesando pago">
      <LoadingState text="Generando QR..." />
    </AdminShell>
  )

  if (stage === "success") return (
    <AdminShell title="¡Pago exitoso!">
      <PaymentResult
        type="success"
        message="¡Suscripción activada!"
        sub="Tu plan está activo por los próximos 30 días"
        buttonLabel="Ir al dashboard"
        onAction={() => router.push("/dashboard")}
      />
    </AdminShell>
  )

  if (stage === "failed") return (
    <AdminShell title="Pago fallido">
      <PaymentResult
        type="failed"
        message="Pago no completado"
        sub="El QR venció o el pago fue rechazado"
        buttonLabel="Intentar de nuevo"
        onAction={() => router.back()}
      />
    </AdminShell>
  )

  if (stage === "error") return (
    <AdminShell title="Error">
      <PaymentResult
        type="error"
        message="No se pudo generar el QR"
        sub={errorMsg}
        buttonLabel="Volver"
        onAction={() => router.back()}
      />
    </AdminShell>
  )

  return (
    <AdminShell title="Pagar con QR">
      <div className="flex flex-col items-center gap-6 px-2">
        <div className="flex items-center gap-3 self-start w-full mb-2">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-700"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-base font-bold text-gray-900">Volver a planes</h1>
        </div>
        <QrSteps />
        <QrCard
          qrImage={qrImage}
          amount={amount}
          dueDate={dueDate}
          onCancel={() => router.back()}
        />
      </div>
    </AdminShell>
  )
}
