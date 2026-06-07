import Link from "next/link"

export default function StoreUnavailable() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-sm w-full text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
          <LockIcon />
        </div>
        <h1 className="text-lg font-bold text-gray-900 mb-2">
          Tienda no disponible
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-7">
          Esta tienda no está disponible en este momento.
        </p>
        <Link
          href="/tiendas"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          <ArrowLeftIcon />
          Explorar otras tiendas
        </Link>
      </div>
    </main>
  )
}

function LockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  )
}
