export interface UserProfile {
  id: string
  email: string
  phoneNumber: string | null
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
  role: 'CLIENT' | 'VENDOR' | 'ADMIN'
  isProfileComplete: boolean
  notificationsEnabled: boolean
  createdAt: string
}

export interface FavoriteProduct {
  id: string
  name: string
  price: number
  photos: { url: string }[]
  store: {
    name: string
    logoUrl: string | null
  }
}

export interface FollowedStore {
  id: string
  name: string
  storeType: string | null
  logoUrl: string | null
  city: string | null
  rating: number
}

export interface FavoritesResponse {
  products: FavoriteProduct[]
  stores: FollowedStore[]
}
