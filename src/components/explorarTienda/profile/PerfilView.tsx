'use client'

import Image from 'next/image'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import type { UserProfile } from '@/types/user'

interface Props {
  user: UserProfile
}

const MENU_GROUPS = [
  [
    { label: 'Mis datos', href: '/perfil/datos', icon: <UserEditIcon /> },
    { label: 'Direcciones', href: '/perfil/direcciones', icon: <LocationIcon /> },
    { label: 'Métodos de pago', href: '/perfil/metodos-pago', icon: <CardIcon /> },
    { label: 'Notificaciones', href: '/perfil/notificaciones', icon: <BellIcon /> },
  ],
  [
    { label: 'Ayuda y soporte', href: '/perfil/ayuda', icon: <HelpIcon /> },
    { label: 'Sobre la app', href: '/perfil/sobre', icon: <InfoIcon /> },
  ],
]

export default function PerfilView({ user }: Props) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Usuario'
  const initials = [user.firstName?.[0], user.lastName?.[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase() || 'U'

  return (
    <div className="flex flex-col gap-6">
      {/* Header de perfil */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-violet-600 flex items-center justify-center">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={fullName}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-white text-2xl font-bold">{initials}</span>
            )}
          </div>
        </div>

        {/* Nombre y teléfono */}
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-gray-900 truncate">{fullName}</h2>
          {user.phoneNumber ? (
            <p className="text-sm text-gray-400 mt-0.5">{user.phoneNumber}</p>
          ) : (
            <p className="text-sm text-gray-300 mt-0.5 italic">Sin teléfono registrado</p>
          )}
          <p className="text-xs text-gray-400 mt-1 truncate">{user.email}</p>
        </div>
      </div>

      {/* Grupos del menú */}
      {MENU_GROUPS.map((group, gi) => (
        <div key={gi} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {group.map(({ label, href, icon }, i) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${
                i < group.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <span className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center shrink-0 text-violet-600">
                {icon}
              </span>
              <span className="flex-1 text-sm font-medium text-gray-800">{label}</span>
              <ChevronRightIcon />
            </Link>
          ))}
        </div>
      ))}

      {/* Cerrar sesión */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          onClick={() => signOut({ callbackUrl: '/signin' })}
          className="w-full flex items-center justify-center gap-2 px-5 py-4 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors"
        >
          <LogOutIcon />
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 18l6-6-6-6" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function UserEditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 20c0-3.314 3.582-6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 14l2 2-4 4h-2v-2l4-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 14 6 14s6-8.75 6-14c0-3.314-2.686-6-6-6z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function CardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function HelpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="currentColor" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function LogOutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
