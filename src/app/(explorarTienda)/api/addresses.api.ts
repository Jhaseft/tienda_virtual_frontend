const BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL}/addresses`

export interface Address {
  id: string
  fullName: string
  phone: string
  street: string
  city: string
  state: string
  zipCode: string | null
  country: string
  isDefault: boolean
}

export async function fetchAddresses(token: string): Promise<Address[]> {
  const res = await fetch(BASE, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) return []
  return res.json()
}

export async function createAddress(
  token: string,
  payload: Omit<Address, 'id'>,
): Promise<Address> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Error al crear dirección')
  return res.json()
}

export async function updateAddress(
  token: string,
  id: string,
  payload: Partial<Omit<Address, 'id'>>,
): Promise<Address> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Error al actualizar dirección')
  return res.json()
}

export async function setDefaultAddress(token: string, id: string): Promise<void> {
  await fetch(`${BASE}/${id}/default`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function deleteAddress(token: string, id: string): Promise<void> {
  await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}
