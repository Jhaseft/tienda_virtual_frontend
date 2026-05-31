'use client'

import { useState } from 'react'
import Link from 'next/link'
import { updateMe } from '@/app/(explorarTienda)/api/users.api'
import type { UserProfile } from '@/types/user'

interface Props {
  user: UserProfile
  token: string
}

export default function DatosForm({ user, token }: Props) {
  const [firstName, setFirstName] = useState(user.firstName ?? '')
  const [lastName, setLastName] = useState(user.lastName ?? '')
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ?? '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError(null)

    const result = await updateMe(token, {
      firstName: firstName.trim() || undefined,
      lastName: lastName.trim() || undefined,
      phoneNumber: phoneNumber.trim() || undefined,
    })

    setLoading(false)
    if (result) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError('No se pudo guardar los cambios. Intenta de nuevo.')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header con volver */}
      <div className="flex items-center gap-3">
        <Link
          href="/perfil"
          className="w-9 h-9 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <BackIcon />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Mis datos</h1>
          <p className="text-xs text-gray-400 mt-0.5">Edita tu información personal</p>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">
        {/* Email (solo lectura) */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
            Correo electrónico
          </label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-400 cursor-not-allowed"
          />
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Nombre
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Tu nombre"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-shadow"
          />
        </div>

        {/* Apellido */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Apellido
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Tu apellido"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-shadow"
          />
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Teléfono
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+591 700 12345"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-shadow"
          />
        </div>

        {/* Feedback */}
        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
        )}
        {success && (
          <p className="text-sm text-green-600 bg-green-50 px-4 py-3 rounded-xl">
            Cambios guardados correctamente.
          </p>
        )}

        {/* Botón guardar */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl text-sm font-semibold text-white transition-colors ${
            loading
              ? 'bg-violet-300 cursor-not-allowed'
              : 'bg-violet-600 hover:bg-violet-700'
          }`}
        >
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
