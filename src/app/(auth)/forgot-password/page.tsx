"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ForgotPasswordHeader from "@/components/auth/forgotPassword/ForgotPasswordHeader"
import StepIndicator from "@/components/auth/forgotPassword/StepIndicator"
import StepEmail from "@/components/auth/forgotPassword/StepEmail"
import StepOtp from "@/components/auth/forgotPassword/StepOtp"
import StepPassword from "@/components/auth/forgotPassword/StepPassword"

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL

type Step = "email" | "otp" | "password"

export default function ForgotPasswordPage() {
  const router = useRouter()

  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(Array(6).fill(""))
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isPending, setIsPending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setIsPending(true)
    try {
      const res = await fetch(`${BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message ?? "No se pudo enviar el código")
      }
      setStep("otp")
      startCooldown()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar el código")
    } finally {
      setIsPending(false)
    }
  }

  async function handleVerifyOtp() {
    if (otp.join("").length < 6) return
    setError("")
    setIsPending(true)
    try {
      const res = await fetch(`${BASE}/auth/verify-forgot-password-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp.join("") }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message ?? "Código inválido o expirado")
      }
      setStep("password")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Código inválido o expirado")
      setOtp(Array(6).fill(""))
    } finally {
      setIsPending(false)
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }
    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }
    setError("")
    setIsPending(true)
    try {
      const res = await fetch(`${BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp.join(""), newPassword }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message ?? "Código inválido o expirado")
      }
      router.push("/signin")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Código inválido o expirado")
      setStep("otp")
      setOtp(Array(6).fill(""))
    } finally {
      setIsPending(false)
    }
  }

  async function handleResend() {
    if (resendCooldown > 0) return
    setError("")
    try {
      await fetch(`${BASE}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: email, type: "EMAIL" }),
      })
      startCooldown()
    } catch {
      setError("No se pudo reenviar el código")
    }
  }

  function startCooldown() {
    setResendCooldown(60)
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-md px-8 py-8">

        <ForgotPasswordHeader step={step} email={email} />
        <StepIndicator current={step} />

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {step === "email" && (
          <StepEmail
            email={email}
            isPending={isPending}
            onEmailChange={setEmail}
            onSubmit={handleSendCode}
          />
        )}

        {step === "otp" && (
          <StepOtp
            otp={otp}
            isPending={isPending}
            resendCooldown={resendCooldown}
            onOtpChange={setOtp}
            onVerify={handleVerifyOtp}
            onResend={handleResend}
          />
        )}

        {step === "password" && (
          <StepPassword
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            isPending={isPending}
            onNewPasswordChange={setNewPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onSubmit={handleResetPassword}
          />
        )}

        <div className="text-center mt-5">
          <Link href="/signin" className="text-xs text-gray-500 hover:text-violet-600 transition-colors">
            ← Volver al inicio de sesión
          </Link>
        </div>

      </div>
    </main>
  )
}
