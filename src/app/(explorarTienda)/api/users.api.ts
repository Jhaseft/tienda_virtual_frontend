import type { FavoritesResponse, UserProfile } from '@/types/user'

const BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`

export async function fetchMe(token: string): Promise<UserProfile | null> {
  const res = await fetch(`${BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) return null
  return res.json()
}

export async function fetchFavorites(token: string): Promise<FavoritesResponse> {
  const res = await fetch(`${BASE}/favorites`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) return { products: [], stores: [] }
  return res.json()
}

export async function updateMe(
  token: string,
  data: Partial<{ firstName: string; lastName: string; phoneNumber: string }>,
): Promise<UserProfile | null> {
  const res = await fetch(`${BASE}/me`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) return null
  return res.json()
}
