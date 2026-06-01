import { Category, Store, SearchResults } from "@/types/explorar"

const BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL}/explorar`

// ENPOINTS PARA LISTAR CATEGORIAS
export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE}/categorias`, { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

// ENPOINTS PARA LISTAR TIENDAS RECOMENDADAS
export async function fetchRecommendedStores(): Promise<Store[]> {
  const res = await fetch(`${BASE}/tiendas-recomendadas`, { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

// ENDPOINT PARA LISTAR TIENDAS POR CATEGORÍA
export async function fetchStoresByCategory(categoryId: string): Promise<Store[]> {
  const res = await fetch(`${BASE}/categorias/${categoryId}/tiendas`, { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

// ENPOINTS PARA BUSCAR TIENDAS Y PRODUCTOS
const EMPTY_SEARCH: SearchResults = {
  stores: [], products: [],
  productTotal: 0, productTotalPages: 0, page: 1, limit: 20,
}

export async function fetchSearch(
  q: string,
  page = 1,
  limit = 12
): Promise<SearchResults> {
  if (!q.trim()) return { ...EMPTY_SEARCH, page, limit }
  const params = new URLSearchParams({ q, page: String(page), limit: String(limit) })
  const res = await fetch(`${BASE}/buscar?${params}`, { cache: "no-store" })
  if (!res.ok) return { ...EMPTY_SEARCH, page, limit }
  return res.json()
}
