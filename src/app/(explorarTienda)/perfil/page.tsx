import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { fetchMe } from '@/app/(explorarTienda)/api/users.api'
import PerfilView from '@/components/explorarTienda/profile/PerfilView'

export default async function PerfilPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.backendToken) {
    redirect('/signin?callbackUrl=/perfil')
  }

  const user = await fetchMe(session.user.backendToken)
  if (!user) redirect('/signin?callbackUrl=/perfil')

  return (
    <main className="min-h-screen bg-gray-50 pt-4 md:pt-20">
      <div className="max-w-2xl mx-auto px-6 py-8 pb-28 md:pb-12">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mi perfil</h1>
          <p className="text-sm text-gray-400 mt-0.5">Tus datos y configuraciones</p>
        </div>

        <PerfilView user={user} />
      </div>
    </main>
  )
}
