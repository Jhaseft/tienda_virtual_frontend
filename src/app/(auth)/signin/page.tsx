"use client"

import { Suspense, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/"

  const [error, setError] = useState("")
  const [isPending, setIsPending] = useState(false)

  async function handleAction(formData: FormData) {
    setError("")
    setIsPending(true)
    try {
      const result = await signIn("credentials", {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        redirect: false,
      })
      if (result?.error) setError("Email o contraseña incorrectos.")
      else router.push(callbackUrl)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-md px-8 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <StoreIcon />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 leading-snug">
            ¡Bienvenido a<br />MiTienda!
          </h1>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Crea tu cuenta para descubrir<br />y vender increíbles productos.
          </p>
          <button className="text-violet-600 text-sm font-medium mt-2 hover:text-violet-700">
            Iniciar sesión
          </button>
        </div>

        {/* Login form */}
        <form action={handleAction} className="space-y-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <MailIcon />
            </span>
            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              required
              autoComplete="email"
              className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-400"
            />
          </div>

          <div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <LockIcon />
              </span>
              <input
                name="password"
                type="password"
                placeholder="Contraseña"
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-400"
              />
            </div>
            <div className="text-right mt-1">
              <Link href="/forgot-password" className="text-xs text-gray-500 hover:text-violet-600">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-3 text-sm font-semibold disabled:opacity-50 transition-colors"
          >
            {isPending ? "Entrando..." : "Iniciar sesión"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-2 my-4">
          <hr className="flex-1 border-gray-200" />
          <span className="text-xs text-gray-400">o inicia sesión con</span>
          <hr className="flex-1 border-gray-200" />
        </div>

        {/* Google sign in */}
        <button
          onClick={() => signIn("google", { callbackUrl })}
          className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <GoogleIcon />
          Iniciar sesión con Google
        </button>

        {/* Register options */}
        <p className="text-center text-xs text-gray-500 mt-5">¿No tienes cuenta?</p>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            onClick={() => signIn("google", { callbackUrl: "/signup?method=google" })}
            className="flex items-center justify-center gap-1.5 border border-gray-200 rounded-xl py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <GoogleIcon small />
            Registrarse con Google
          </button>
          <button
            onClick={() => router.push("/signup?method=email")}
            className="flex items-center justify-center gap-1.5 border border-gray-200 rounded-xl py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <MailIconSmall />
            Registrarse con correo
          </button>
        </div>
      </div>
    </main>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <SignInContent />
    </Suspense>
  )
}

/* ── Icons ── */

function StoreIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 9l1-5h16l1 5" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" stroke="#7C3AED" strokeWidth="1.5" />
      <path d="M5 9v11h14V9" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 20v-6h6v6" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function MailIconSmall() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 11V7a4 4 0 1 1 8 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function GoogleIcon({ small }: Readonly<{ small?: boolean }>) {
  const size = small ? 15 : 18
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18Z" />
      <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17Z" />
      <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07Z" />
      <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3Z" />
    </svg>
  )
}
