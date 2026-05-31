"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Suspense } from "react"
import SearchBar from "./SearchBar"

const NAV_ITEMS = [
  { href: "/",          label: "Inicio",      icon: HomeIcon },
  { href: "/categorias",label: "Categorías",  icon: GridIcon },
  { href: "/favoritos", label: "Favoritos",   icon: HeartIcon },
  { href: "/pedidos",   label: "Pedidos",     icon: BagIcon },
  { href: "/perfil",    label: "Perfil",      icon: UserIcon },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <>
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 h-16 w-full flex items-center gap-8">

          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center shadow-sm">
              <StoreIcon />
            </div>
            <span className="text-[15px] font-bold text-gray-900 tracking-tight">MiTienda</span>
          </Link>

          <div className="w-px h-5 bg-gray-200 shrink-0" />

          <nav className="flex items-center gap-0.5 shrink-0">
            {NAV_ITEMS.slice(0, 3).map(({ href, label }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href))
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "text-violet-600 bg-violet-50"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          <div className="flex-1 flex justify-center px-4">
            <div className="w-full max-w-xl">
              <Suspense>
                <SearchBar />
              </Suspense>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Link
              href="/favoritos"
              className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              title="Favoritos"
            >
              <HeartIcon active={false} />
            </Link>
            <Link
              href="/pedidos"
              className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              title="Pedidos"
            >
              <BagIcon active={false} />
            </Link>

            <div className="w-px h-5 bg-gray-200 mx-1" />

            <Link
              href="/perfil"
              className="flex items-center gap-2 pl-2 pr-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center">
                <UserIcon active={false} />
              </div>
              <span>Perfil</span>
            </Link>
          </div>

        </div>
      </header>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${
                  active ? "text-violet-600" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Icon active={active} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}


function StoreIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 9l1-5h16l1 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" stroke="white" strokeWidth="1.5" />
      <path d="M5 9v11h14V9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" stroke="currentColor" strokeWidth={active ? 2 : 1.5} fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} />
      <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function GridIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth={active ? 2 : 1.5} fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} />
      <rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth={active ? 2 : 1.5} fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} />
      <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth={active ? 2 : 1.5} fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} />
      <rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth={active ? 2 : 1.5} fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} />
    </svg>
  )
}

function HeartIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21C12 21 3 14.5 3 8.5a4.5 4.5 0 0 1 9-.5 4.5 4.5 0 0 1 9 .5C21 14.5 12 21 12 21z" stroke="currentColor" strokeWidth={active ? 2 : 1.5} fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.2 : 0} />
    </svg>
  )
}

function BagIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="7" width="18" height="14" rx="2" stroke="currentColor" strokeWidth={active ? 2 : 1.5} fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} />
      <path d="M8 7V6a4 4 0 0 1 8 0v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth={active ? 2 : 1.5} fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} />
      <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" />
    </svg>
  )
}
