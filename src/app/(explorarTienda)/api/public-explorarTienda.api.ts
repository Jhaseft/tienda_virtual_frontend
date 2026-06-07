import { StoreDetail, StoreProductsResponse, PaymentMethod, ProductDetail } from "@/types/explorar"

const BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL}/explorar`

// RESOLVER SUBDOMINIO A ID DE TIENDA
export async function fetchStoreIdBySubdomain(subdomain: string): Promise<string | null> {
    const res = await fetch(`${BASE}/tiendas/by-subdomain/${subdomain}`, { cache: "no-store" })
    if (!res.ok) return null
    const data = (await res.json()) as { id: string }
    return data.id
}

// OBTENER DETALLE COMPLETO DE UNA TIENDA
// Retorna la tienda, null si no existe, o "unavailable" si expiró el trial/suscripción
export async function fetchStoreById(id: string): Promise<StoreDetail | null | "unavailable"> {
    const res = await fetch(`${BASE}/tiendas/${id}`, { cache: "no-store" })
    if (res.status === 403) return "unavailable"
    if (!res.ok) return null
    return res.json()
}

// OBTENER PRODUCTOS DE UNA TIENDA CON PAGINACIÓN
export async function fetchStoreProducts(
    id: string,
    page = 1,
    limit = 20,
    q?: string
): Promise<StoreProductsResponse> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (q?.trim()) params.set("q", q.trim())
    const res = await fetch(`${BASE}/tiendas/${id}/productos?${params}`, { cache: "no-store" })
    if (!res.ok) return { data: [], total: 0, page, limit, totalPages: 0 }
    return res.json()
}

// OBTENER MÉTODOS DE PAGO DE UNA TIENDA
export async function fetchStorePaymentMethods(id: string): Promise<PaymentMethod[]> {
    const res = await fetch(`${BASE}/tiendas/${id}/metodos-pago`, { cache: "no-store" })
    if (!res.ok) return []
    return res.json()
}

// VERIFICAR SI EL USUARIO SIGUE UNA TIENDA
export async function checkIsFollowing(id: string, token: string): Promise<boolean> {
    const res = await fetch(`${BASE}/tiendas/${id}/seguir`, {
        headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return false
    const data = await res.json()
    return data.following
}

// SEGUIR UNA TIENDA (requiere token JWT)
export async function followStore(id: string, token: string): Promise<{ message: string }> {
    const res = await fetch(`${BASE}/tiendas/${id}/seguir`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error("Error al seguir la tienda")
    return res.json()
}

// OBTENER DETALLE DE UN PRODUCTO
export async function fetchProductById(id: string): Promise<ProductDetail | null> {
    const res = await fetch(`${BASE}/productos/${id}`, { cache: "no-store" })
    if (!res.ok) return null
    return res.json()
}

// VERIFICAR SI UN PRODUCTO ESTÁ EN FAVORITOS
export async function checkIsFavorite(id: string, token: string): Promise<boolean> {
    const res = await fetch(`${BASE}/productos/${id}/favorito`, {
        headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return false
    const data = await res.json()
    return data.favorite
}

// AGREGAR PRODUCTO A FAVORITOS
export async function addFavorite(id: string, token: string): Promise<{ message: string }> {
    const res = await fetch(`${BASE}/productos/${id}/favorito`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error("Error al agregar a favoritos")
    return res.json()
}

// QUITAR PRODUCTO DE FAVORITOS
export async function removeFavorite(id: string, token: string): Promise<{ message: string }> {
    const res = await fetch(`${BASE}/productos/${id}/favorito`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error("Error al quitar de favoritos")
    return res.json()
}

// DEJAR DE SEGUIR UNA TIENDA (requiere token JWT)
export async function unfollowStore(id: string, token: string): Promise<{ message: string }> {
    const res = await fetch(`${BASE}/tiendas/${id}/seguir`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error("Error al dejar de seguir")
    return res.json()
}
