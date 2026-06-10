const BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL}/carrito`

export interface CartProduct {
  id: string
  name: string
  price: number
  stock: number
  photos: { url: string }[]
}

export interface CartItemData {
  id: string
  quantity: number
  variant: string | null
  colorName: string | null
  store: { id: string; name: string; logoUrl: string | null }
  product: CartProduct
}

export interface CartGroup {
  store: { id: string; name: string; logoUrl: string | null }
  items: CartItemData[]
  subtotal: number
}

export async function fetchCart(token: string): Promise<CartGroup[]> {
  const res = await fetch(BASE, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) return []
  return res.json()
}

export async function addToCart(
  token: string,
  payload: { productId: string; storeId: string; quantity: number; variant?: string; colorName?: string },
): Promise<void> {
  await fetch(BASE, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function updateCartItem(token: string, itemId: string, quantity: number): Promise<void> {
  await fetch(`${BASE}/${itemId}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  })
}

export async function removeCartItem(token: string, itemId: string): Promise<void> {
  await fetch(`${BASE}/${itemId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function clearStoreCart(token: string, storeId: string): Promise<void> {
  await fetch(`${BASE}/tienda/${storeId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}
