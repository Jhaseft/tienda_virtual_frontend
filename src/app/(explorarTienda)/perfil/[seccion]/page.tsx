import Link from 'next/link'

const LABELS: Record<string, string> = {
  direcciones: 'Direcciones',
  'metodos-pago': 'Métodos de pago',
  notificaciones: 'Notificaciones',
  ayuda: 'Ayuda y soporte',
  sobre: 'Sobre la app',
}

interface Props {
  params: Promise<{ seccion: string }>
}

export default async function PerfilSeccionPage({ params }: Props) {
  const { seccion } = await params
  const title = LABELS[seccion] ?? 'Sección'

  return (
    <main className="min-h-screen bg-gray-50 pt-4 md:pt-20">
      <div className="max-w-2xl mx-auto px-6 py-8 pb-28 md:pb-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/perfil"
            className="w-9 h-9 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <BackIcon />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </div>

        {/* Estado vacío / próximamente */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center py-20 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center">
            <BuildingIcon />
          </div>
          <p className="text-gray-700 font-semibold text-base">Próximamente</p>
          <p className="text-gray-400 text-sm text-center max-w-xs">
            Esta sección estará disponible muy pronto.
          </p>
        </div>
      </div>
    </main>
  )
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BuildingIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="#7C3AED" strokeWidth="1.8" />
      <path d="M9 12h6M9 8h6M9 16h4" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
