import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { fetchMe } from '@/app/(explorarTienda)/api/users.api'
import DatosForm from '@/components/explorarTienda/profile/DatosForm'

export default async function DatosPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.backendToken) {
    redirect('/signin?callbackUrl=/perfil/datos')
  }

  const user = await fetchMe(session.user.backendToken)
  if (!user) redirect('/signin?callbackUrl=/perfil/datos')

  return (
    <main className="min-h-screen bg-gray-50 pt-4 md:pt-20">
      <div className="max-w-2xl mx-auto px-6 py-8 pb-28 md:pb-12">
        <DatosForm user={user} token={session.user.backendToken} />
      </div>
    </main>
  )
}
