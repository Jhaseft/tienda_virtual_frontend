const BASE = process.env.NEXT_PUBLIC_BACKEND_URL

export interface PedidoItem {
  productId: string
  quantity: number
  variant?: string
  colorName?: string
}

export type PaymentType = 'QR' | 'YAPE' | 'TIGO_MONEY' | 'EFECTIVO' | 'TRANSFERENCIA' | 'WHATSAPP'

export type PickupMethod = 'WHATSAPP' | 'STORE_PICKUP'

export interface CreatePedidoPayload {
  storeId: string
  addressId: string
  paymentMethod: PaymentType
  items: PedidoItem[]
  note?: string
  shippingZoneId?: string
  pickupMethod?: PickupMethod
}

export interface CreatedPedido {
  id: string
  total: number
  status: string
}

export async function createPedido(
  token: string,
  payload: CreatePedidoPayload,
): Promise<CreatedPedido> {
  const res = await fetch(`${BASE}/pedidos`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? 'Error al crear el pedido')
  }
  return res.json()
}

export async function uploadVoucher(
  token: string,
  orderId: string,
  file: File,
): Promise<void> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE}/pedidos/${orderId}/voucher`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  })
  if (!res.ok) throw new Error('Error al subir el comprobante')
}
