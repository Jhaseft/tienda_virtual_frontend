export interface Category {
  id: string
  name: string
  iconUrl: string | null
}

export interface Store {
  id: string
  name: string
  storeType: string
  logoUrl: string | null
  city: string
  rating: number
  totalSales?: number
  totalReviews?: number
}

export interface Product {
  id: string
  name: string
  price: number
  stock: number
  photos: { url: string }[]
  store: { id: string; name: string; logoUrl: string | null }
}

export interface SearchResults {
  stores: Store[]
  products: Product[]
  productTotal: number
  productTotalPages: number
  page: number
  limit: number
}

export type PaymentType = "QR" | "YAPE" | "TIGO_MONEY" | "EFECTIVO" | "TRANSFERENCIA" | "WHATSAPP"

export interface PaymentMethod {
  id: string
  type: PaymentType
  bankName: string | null
  accountHolder: string | null
  accountNumber: string | null
  qrImageUrl: string | null
}

export interface StoreDetail {
  id: string
  name: string
  storeType: string | null
  description: string | null
  logoUrl: string | null
  address: string | null
  city: string | null
  whatsapp: string | null
  isOpen: boolean
  rating: number
  totalReviews: number
  totalSales: number
  _count: {
    followers: number
    products: number
  }
  socialLinks: { id: string; network: import("@/types/admin").SocialNetwork; url: string }[]
  hasChat: boolean
}

export interface StoreProduct {
  id: string
  name: string
  description: string | null
  price: number
  stock: number
  photos: { url: string }[]
  category: { id: string; name: string } | null
}

export interface StoreProductsResponse {
  data: StoreProduct[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ProductSize {
  id: string
  size: string
  stock: number
}

export interface ProductColor {
  id: string
  name: string
  hexCode: string | null
  stock: number
}

export interface ProductDetail {
  id: string
  name: string
  description: string | null
  price: number
  stock: number
  isAvailable: boolean
  photos: { url: string; order: number }[]
  sizes: ProductSize[]
  colors: ProductColor[]
  category: { id: string; name: string } | null
  store: {
    id: string
    name: string
    logoUrl: string | null
    whatsapp: string | null
    city: string | null
    rating: number
  }
}
