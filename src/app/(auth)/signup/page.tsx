"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useActionState } from "react"
import Link from "next/link"

type FormState =
  | {
      errors?: {
        firstName?: string[]
        email?: string[]
        phoneNumber?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

async function registerAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const firstName = (formData.get("firstName") as string)?.trim()
  const email = (formData.get("email") as string)?.trim()
  const phoneNumber = (formData.get("phoneNumber") as string)?.trim()
  const password = formData.get("password") as string

  const errors: FormState["errors"] = {}
  if (!firstName) errors.firstName = ["El nombre es obligatorio."]
  if (!email) errors.email = ["El email es obligatorio."]
  if (!phoneNumber) errors.phoneNumber = ["El teléfono es obligatorio."]
  if (!password || password.length < 8)
    errors.password = ["Mínimo 8 caracteres."]

  if (Object.keys(errors).length) return { errors }

  // TODO: llamar al backend cuando implemente POST /auth/register
  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
  //   {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ firstName, email, phoneNumber, password }),
  //   }
  // )
  // if (!res.ok) {
  //   const data = await res.json()
  //   return { message: data.message ?? "Error al registrar." }
  // }
  // return undefined  // éxito → el caller redirige

  return { message: "Backend aún no implementado." }
}

export default function SignUpPage() {
  const router = useRouter()

  const [state, action, pending] = useActionState(
    async (prev: FormState, formData: FormData) => {
      const result = await registerAction(prev, formData)
      if (!result) router.push("/signin")
      return result
    },
    undefined
  )

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Crear cuenta
        </h1>

        <form action={action} className="space-y-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            {state?.errors?.firstName && (
              <p className="text-xs text-red-600 mt-1">
                {state.errors.firstName[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            {state?.errors?.email && (
              <p className="text-xs text-red-600 mt-1">
                {state.errors.email[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Teléfono
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              autoComplete="tel"
              placeholder="+57 300 000 0000"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            {state?.errors?.phoneNumber && (
              <p className="text-xs text-red-600 mt-1">
                {state.errors.phoneNumber[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            {state?.errors?.password && (
              <p className="text-xs text-red-600 mt-1">
                {state.errors.password[0]}
              </p>
            )}
          </div>

          {state?.message && (
            <p className="text-sm text-red-600">{state.message}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-black text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {pending ? "Registrando..." : "Crear cuenta"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <hr className="flex-1 border-gray-200" />
          <span className="text-xs text-gray-400">o</span>
          <hr className="flex-1 border-gray-200" />
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <GoogleIcon />
          Continuar con Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/signin"
            className="font-medium text-black hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18Z"
      />
      <path
        fill="#34A853"
        d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17Z"
      />
      <path
        fill="#FBBC05"
        d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07Z"
      />
      <path
        fill="#EA4335"
        d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3Z"
      />
    </svg>
  )
}
