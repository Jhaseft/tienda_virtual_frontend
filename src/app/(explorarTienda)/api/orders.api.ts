import type { OrderDetail, OrderListResponse } from '@/types/orders'

const BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`

export async function fetchOrders(
  token: string,
  status?: string,
  page = 1,
  limit = 20,
): Promise<OrderListResponse> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (status && status !== 'TODOS') params.set('status', status)

  const res = await fetch(`${BASE}?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })

  if (!res.ok) return { data: [], total: 0, page, limit, totalPages: 0 }
  return res.json()
}

export async function fetchOrderById(
  id: string,
  token: string,
): Promise<OrderDetail | null> {
  const res = await fetch(`${BASE}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })

  if (!res.ok) return null
  return res.json()
}
