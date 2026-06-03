"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import AdminShell from "@/components/admin/home/AdminShell"
import LoadingState from "@/components/admin/home/LoadingState"
import { initStripePayment, getMySubscription } from "@/lib/api/subscriptions"
import { CheckCircle, XCircle } from "lucide-react"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
)

// ── Formulario interno ────────────────────────────────────────────────────────

function CheckoutForm({
  token,
  planName,
  amount,
  onSuccess,
}: {
  token: string
  planName: string
  amount: number
  onSuccess: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsSubmitting(true)
    setErrorMsg(null)

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    })

    if (error) {
      setErrorMsg(error.message ?? "Error al procesar el pago")
      setIsSubmitting(false)
      return
    }

    let attempts = 0
    const interval = setInterval(async () => {
      attempts++
      try {
        const sub = await getMySubscription(token)
        if (sub.status === "ACTIVE") {
          clearInterval(interval)
          onSuccess()
        }
      } catch {
        // seguimos intentando
      }
      if (attempts >= 15) clearInterval(interval)
    }, 2000)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-violet-600 to-violet-500 px-5 py-4 mb-1">
        <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute top-1 left-1/3 w-20 h-6 rounded-full bg-white/20 blur-xl pointer-events-none" />
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-violet-200 mb-1">Plan seleccionado</p>
        <p className="text-xl font-black text-white leading-none">{planName}</p>
        <div className="h-px w-full bg-white/15 my-2.5" />
        <div className="flex items-end gap-1">
          <span className="text-2xl font-black text-white leading-none">${amount.toFixed(2)}</span>
          <span className="text-sm text-violet-200 mb-0.5">USD / mes</span>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 p-4">
        <PaymentElement />
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-sm text-red-600">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isSubmitting}
        className="w-full bg-violet-600 text-white py-3.5 rounded-2xl font-semibold text-sm disabled:opacity-50 active:scale-95 transition"
      >
        {isSubmitting ? "Procesando..." : "Confirmar pago"}
      </button>
    </form>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────

export default function PagoStripePage() {
  const { data: session, status } = useSession()
  const token = session?.user.backendToken
  const router = useRouter()
  const params = useSearchParams()
  const planId = params.get("planId") ?? ""

  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [planName, setPlanName] = useState("")
  const [amount, setAmount] = useState(0)
  const [stage, setStage] = useState<"loading" | "form" | "success" | "error">("loading")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    if (status === "loading" || !token || !planId) return

    initStripePayment(token, planId)
      .then((res) => {
        setClientSecret(res.clientSecret)
        setPlanName(res.planName)
        setAmount(res.amount)
        setStage("form")
      })
      .catch((e) => {
        setErrorMsg(e?.message ?? "Error al iniciar el pago")
        setStage("error")
      })
  }, [token, status, planId])

  if (stage === "loading") return (
    <AdminShell title="Pagar con tarjeta">
      <LoadingState text="Preparando pago..." />
    </AdminShell>
  )

  if (stage === "success") return (
    <AdminShell title="¡Pago exitoso!">
      <div className="flex flex-col items-center gap-6 pt-10 px-4">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle size={40} className="text-emerald-500" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">¡Suscripción activada!</h2>
          <p className="text-sm text-gray-500 mt-1">Tu plan está activo por los próximos 30 días</p>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full max-w-xs bg-violet-600 text-white py-3 rounded-2xl font-semibold text-sm active:scale-95 transition"
        >
          Ir al dashboard
        </button>
      </div>
    </AdminShell>
  )

  if (stage === "error") return (
    <AdminShell title="Error">
      <div className="flex flex-col items-center gap-6 pt-10 px-4">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
          <XCircle size={40} className="text-red-500" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">No se pudo iniciar el pago</h2>
          <p className="text-sm text-gray-500 mt-1">{errorMsg}</p>
        </div>
        <button
          onClick={() => router.back()}
          className="w-full max-w-xs bg-gray-900 text-white py-3 rounded-2xl font-semibold text-sm active:scale-95 transition"
        >
          Volver
        </button>
      </div>
    </AdminShell>
  )

  return (
    <AdminShell title="Pagar con tarjeta">
      <div className="px-1">
        <div className="flex items-center gap-3 mb-4">
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
        {clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{ clientSecret, appearance: { theme: "stripe" } }}
          >
            <CheckoutForm
              token={token!}
              planName={planName}
              amount={amount}
              onSuccess={() => setStage("success")}
            />
          </Elements>
        )}
      </div>
    </AdminShell>
  )
}
