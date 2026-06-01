"use client"

import { Suspense, useState, useEffect, Fragment } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import OtpInput from "@/components/ui/OtpInput"

type Method = "google" | "email"
type Step = 2 | 3

interface StepData {
  firstName: string
  lastName: string
  phoneCountry: string
  phoneNumber: string
  email: string
  password: string
}

const COUNTRIES = [
  { code: "+591", flag: "🇧🇴" },
  { code: "+57",  flag: "🇨🇴" },
  { code: "+54",  flag: "🇦🇷" },
  { code: "+52",  flag: "🇲🇽" },
  { code: "+51",  flag: "🇵🇪" },
  { code: "+56",  flag: "🇨🇱" },
  { code: "+55",  flag: "🇧🇷" },
]

const BACKEND =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  ""

function backendUrl(path: string) {
  if (!BACKEND) {
    throw new Error("Falta configurar NEXT_PUBLIC_API_URL o NEXT_PUBLIC_BACKEND_URL")
  }

  return `${BACKEND.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}

/* ── Countdown hook ── */
function useCountdown(seconds: number) {
  const [left, setLeft] = useState(seconds)

  useEffect(() => {
    if (left === 0) return
    const t = setInterval(() => setLeft((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [left])

  const formatted = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`
  const restart = () => setLeft(seconds)
  return { left, formatted, restart }
}

/* ── ProgressBar ── */
function ProgressBar({ current }: Readonly<{ current: Step }>) {
  return (
    <div className="flex flex-col items-center mb-6">
      <p className="text-xs text-gray-500 mb-3">Paso {current} de 3</p>
      <div className="flex items-center">
        {[1, 2, 3].map((n, i) => (
          <Fragment key={n}>
            {i > 0 && (
              <div
                className={`h-0.5 w-10 ${n <= current ? "bg-violet-600" : "bg-gray-200"}`}
              />
            )}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${n < current
                  ? "bg-violet-600 text-white"
                  : n === current
                  ? "bg-violet-600 text-white ring-4 ring-violet-100"
                  : "bg-white border-2 border-gray-200 text-gray-400"
                }`}
            >
              {n < current ? "✓" : n}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}

/* ── Shared input field ── */
function Field({
  label,
  name,
  type = "text",
  placeholder,
  error,
}: Readonly<{
  label: string
  name: string
  type?: string
  placeholder?: string
  error?: string
}>) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required
        className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-400"
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

/* ── Step 2 form — Google path ── */
function StepInfoGoogle({
  backendToken,
  onContinue,
}: Readonly<{ backendToken: string; onContinue: (d: StepData) => void }>) {
  const [country, setCountry] = useState("+591")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleAction(fd: FormData) {
    const firstName   = (fd.get("firstName")   as string).trim()
    const lastName    = (fd.get("lastName")    as string).trim()
    const phoneNumber = (fd.get("phoneNumber") as string).trim()

    if (!firstName || !lastName || !phoneNumber) {
      setErr("Completa todos los campos.")
      return
    }
    setErr("")
    setLoading(true)
    try {
      const res = await fetch(backendUrl("/auth/complete-profile"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${backendToken}`,
        },
        body: JSON.stringify({ firstName, lastName, phoneNumber: `${country}${phoneNumber}` }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setErr((body as { message?: string }).message ?? "Error al guardar perfil")
        return
      }
      onContinue({ firstName, lastName, phoneCountry: country, phoneNumber, email: "", password: "" })
    } catch {
      setErr("Error de conexión. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Completa tu información</h2>
      <p className="text-sm text-gray-500 mb-5">
        Solo necesitamos algunos datos para crear tu cuenta.
      </p>
      <form action={handleAction} className="space-y-3">
        <Field label="Nombre"   name="firstName" placeholder="Ingresa tu nombre" />
        <Field label="Apellido" name="lastName"  placeholder="Ingresa tu apellido" />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de celular
          </label>
          <div className="flex gap-2">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="border border-gray-200 rounded-xl px-2 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
            <input
              name="phoneNumber"
              type="tel"
              placeholder="7 1234567"
              required
              className="flex-1 border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-400"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Te usaremos para contactarte sobre tus pedidos
          </p>
        </div>

        {err && <p className="text-sm text-red-500">{err}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-3 text-sm font-semibold transition-colors mt-1 disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Continuar"}
        </button>
      </form>
    </>
  )
}

/* ── Step 2 form — Email path ── */
function StepInfoEmail({
  onContinue,
}: Readonly<{ onContinue: (d: StepData) => void }>) {
  const [country, setCountry] = useState("+591")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleAction(fd: FormData) {
    const email           = (fd.get("email")           as string).trim()
    const firstName       = (fd.get("firstName")       as string).trim()
    const lastName        = (fd.get("lastName")        as string).trim()
    const phoneNumber     = (fd.get("phoneNumber")     as string).trim()
    const password        = fd.get("password")        as string
    const confirmPassword = fd.get("confirmPassword") as string

    if (!email || !firstName || !lastName || !phoneNumber || !password) {
      setErr("Completa todos los campos.")
      return
    }
    if (password.length < 8) {
      setErr("La contraseña debe tener al menos 8 caracteres.")
      return
    }
    if (password !== confirmPassword) {
      setErr("Las contraseñas no coinciden.")
      return
    }

    setErr("")
    setLoading(true)
    try {
      const res = await fetch(backendUrl("/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          phoneNumber: `${country}${phoneNumber}`,
          password,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setErr((body as { message?: string }).message ?? "Error al registrar")
        return
      }
      onContinue({ email, firstName, lastName, phoneCountry: country, phoneNumber, password })
    } catch {
      setErr("Error de conexión. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Completa tu información</h2>
      <p className="text-sm text-gray-500 mb-5">
        Necesitamos algunos datos para crear tu cuenta.
      </p>
      <form action={handleAction} className="space-y-3">
        <Field label="Correo electrónico" name="email" type="email" placeholder="ejemplo@correo.com" />
        <Field label="Nombre"   name="firstName" placeholder="Ingresa tu nombre" />
        <Field label="Apellido" name="lastName"  placeholder="Ingresa tu apellido" />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de celular
          </label>
          <div className="flex gap-2">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="border border-gray-200 rounded-xl px-2 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
            <input
              name="phoneNumber"
              type="tel"
              placeholder="7 1234567"
              required
              className="flex-1 border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-400"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Te usaremos para contactarte sobre tus pedidos
          </p>
        </div>

        <Field
          label="Contraseña"
          name="password"
          type="password"
          placeholder="Mínimo 8 caracteres"
        />
        <Field
          label="Repetir contraseña"
          name="confirmPassword"
          type="password"
          placeholder="Repite tu contraseña"
        />

        {err && <p className="text-sm text-red-500">{err}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-3 text-sm font-semibold transition-colors mt-1 disabled:opacity-50"
        >
          {loading ? "Registrando..." : "Continuar"}
        </button>
      </form>
    </>
  )
}

/* ── Step 3 OTP verification ── */
function StepVerify({
  method,
  data,
  onSuccess,
}: Readonly<{ method: Method; data: StepData; onSuccess: (backendToken: string) => void }>) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)
  const { left, formatted, restart } = useCountdown(45)
  const isWhatsApp = method === "google"

  const target = isWhatsApp
    ? `${data.phoneCountry}${data.phoneNumber}`
    : data.email

  const displayTarget = isWhatsApp
    ? `${data.phoneCountry} ${data.phoneNumber}`
    : data.email

  async function handleVerify() {
    const code = otp.join("")
    if (code.length < 6) {
      setErr("Ingresa los 6 dígitos del código.")
      return
    }
    setErr("")
    setLoading(true)
    try {
      const res = await fetch(backendUrl("/auth/verify-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target,
          code,
          type: isWhatsApp ? "WHATSAPP" : "EMAIL",
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setErr((body as { message?: string }).message ?? "Código inválido o expirado")
        return
      }
      const { token } = await res.json() as { token: string }
      onSuccess(token)
    } catch {
      setErr("Error de conexión. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    try {
      await fetch(backendUrl("/auth/resend-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, type: isWhatsApp ? "WHATSAPP" : "EMAIL" }),
      })
    } catch {
      // silently ignore resend errors
    }
    restart()
  }

  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 mb-1">
        {isWhatsApp ? "Verifica tu número" : "Verifica tu correo"}
      </h2>
      <p className="text-sm text-gray-500 mb-1">
        {isWhatsApp
          ? "Te enviamos un código por WhatsApp al"
          : "Te enviamos un código por correo a"}
      </p>
      <p className="text-sm font-semibold text-violet-600 mb-5 flex items-center gap-1">
        {displayTarget}
        <span>{isWhatsApp ? "📱" : "✉️"}</span>
      </p>

      {/* Banner */}
      {isWhatsApp ? (
        <div className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-xl p-3 mb-5">
          <WhatsAppIcon />
          <div className="text-xs text-green-700">
            <p className="font-semibold">Código enviado por WhatsApp</p>
            <p>Revisa tus mensajes.</p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2 bg-violet-50 border border-violet-100 rounded-xl p-3 mb-5">
          <MailIconSmall />
          <div className="text-xs text-violet-700">
            <p className="font-semibold">Código enviado por correo electrónico</p>
            <p>Revisa tu bandeja de entrada o carpeta de spam.</p>
          </div>
        </div>
      )}

      <div className="space-y-5">
        <OtpInput value={otp} onChange={setOtp} />

        {err && <p className="text-sm text-red-500 text-center">{err}</p>}

        <p className="text-center text-xs text-gray-500">
          ¿No recibiste el código?{" "}
          {left > 0 ? (
            <span className="text-violet-600 font-medium">
              Reenviar código ({formatted})
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-violet-600 font-medium hover:underline"
            >
              Reenviar código
            </button>
          )}
        </p>

        <button
          type="button"
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-3 text-sm font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? "Verificando..." : "Verificar"}
        </button>
      </div>
    </>
  )
}

/* ── Main signup page ── */
function SignupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const method = (searchParams.get("method") ?? "email") as Method
  const { data: session, update } = useSession()

  const [step, setStep] = useState<Step>(2)
  const [stepData, setStepData] = useState<StepData | null>(null)

  function handleInfoContinue(data: StepData) {
    setStepData(data)
    setStep(3)
  }

  async function handleVerifySuccess(newToken: string) {
    if (method === "google") {
      await update({ backendToken: newToken })
      router.push("/")
    } else {
      const result = await signIn("credentials", {
        email: stepData!.email,
        password: stepData!.password,
        redirect: false,
      })
      router.push(result?.ok ? "/" : "/signin")
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-md px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => (step === 2 ? router.push("/signin") : setStep(2))}
          className="text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1 text-sm"
        >
          <BackIcon />
        </button>

        <ProgressBar current={step} />

        {step === 2 ? (
          method === "google" ? (
            <StepInfoGoogle
              backendToken={session?.user.backendToken ?? ""}
              onContinue={handleInfoContinue}
            />
          ) : (
            <StepInfoEmail onContinue={handleInfoContinue} />
          )
        ) : (
          <StepVerify
            method={method}
            data={stepData ?? { firstName: "", lastName: "", phoneCountry: "+591", phoneNumber: "", email: "", password: "" }}
            onSuccess={handleVerifySuccess}
          />
        )}
      </div>
    </main>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <SignupContent />
    </Suspense>
  )
}

/* ── Icons ── */

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 mt-0.5">
      <path
        d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 5.98L0 24l6.18-1.62A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.22-3.48-8.52Z"
        fill="#25D366"
      />
      <path
        d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.71.23 1.36.19 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z"
        fill="white"
      />
    </svg>
  )
}

function MailIconSmall() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 mt-0.5 text-violet-600">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
