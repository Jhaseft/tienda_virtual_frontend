"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import AdminShell from "@/components/admin/home/AdminShell"
import LoadingState from "@/components/admin/home/LoadingState"
import PaymentResult from "@/components/admin/subscription/PaymentResult"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "")

export default function StripeResultPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [stage, setStage] = useState<"loading" | "success" | "failed">("loading")

  useEffect(() => {
    const clientSecret = params.get("payment_intent_client_secret")
    if (!clientSecret) { setStage("failed"); return }

    stripePromise.then(async (stripe) => {
      if (!stripe) { setStage("failed"); return }
      const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret)
      if (paymentIntent?.status === "succeeded") setStage("success")
      else setStage("failed")
    })
  }, [params])

  if (stage === "loading") return (
    <AdminShell title="Verificando pago">
      <LoadingState text="Verificando pago..." />
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

  return (
    <AdminShell title="Pago fallido">
      <PaymentResult
        type="failed"
        message="Pago no completado"
        sub="El pago fue rechazado o cancelado"
        buttonLabel="Intentar de nuevo"
        onAction={() => router.push("/planes")}
      />
    </AdminShell>
  )
}
