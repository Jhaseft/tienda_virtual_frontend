import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { fetchFavorites } from '@/app/(explorarTienda)/api/users.api'
import FavoritosClientShell from '@/components/explorarTienda/favorites/FavoritosClientShell'

export default async function FavoritosPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.backendToken) {
    redirect('/signin?callbackUrl=/favoritos')
  }

  const data = await fetchFavorites(session.user.backendToken)
  const total = data.products.length + data.stores.length

  return (
    <main className="min-h-screen bg-gray-50 pt-4 md:pt-20">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-8 pb-28 md:pb-12">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Favoritos</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {total} elemento{total !== 1 ? 's' : ''} guardado{total !== 1 ? 's' : ''}
          </p>
        </div>

        <FavoritosClientShell
          initialData={data}
          token={session.user.backendToken}
        />
      </div>
    </main>
  )
}
