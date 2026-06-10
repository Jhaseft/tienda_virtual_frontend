import type { PaymentType } from './explorar'

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PAID'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'

export interface OrderListItem {
  id: string
  orderSeq: number
  status: OrderStatus
  paymentMethod: PaymentType
  total: number
  createdAt: string
  store: {
    id: string
    name: string
    logoUrl: string | null
    storeType: string | null
  }
  items: {
    id: string
    quantity: number
    unitPrice: number
    product: {
      name: string
      photos: { url: string }[]
    }
  }[]
}

export interface OrderListResponse {
  data: OrderListItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface OrderDetail {
  id: string
  orderSeq: number
  clientId: string
  status: OrderStatus
  paymentMethod: PaymentType
  deliveryAddress: string | null
  subtotal: number
  shippingCost: number
  total: number
  voucherUrl: string | null
  whatsappThreadUrl: string | null
  pickupMethod: 'WHATSAPP' | 'STORE_PICKUP' | null
  notes: string | null
  address: {
    fullName: string
    street: string
    city: string
    state: string
    phone: string
  } | null
  shippingZone: {
    city: string
    transportType: string
    minHours: number
    maxHours: number
    shippingCost: number
  } | null
  createdAt: string
  updatedAt: string
  store: {
    id: string
    name: string
    logoUrl: string | null
    storeType: string | null
    whatsapp: string | null
  }
  items: {
    id: string
    quantity: number
    unitPrice: number
    size: string | null
    colorName: string | null
    product: {
      id: string
      name: string
      photos: { url: string }[]
    }
  }[]
}
