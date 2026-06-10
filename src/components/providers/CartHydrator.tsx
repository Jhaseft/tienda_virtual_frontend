"use client"

import { useCallback, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useCart } from "@/contexts/CartContext"

export default function CartHydrator() {
  const { data: session } = useSession()
  const { setCount } = useCart()

  const syncCart = useCallback((token: string) => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/carrito`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((groups: { items: { product: { id: string } }[] }[]) => {
        const total = groups.reduce((sum, g) => sum + g.items.length, 0)
        setCount(total)
        const realIds = groups.flatMap((g) => g.items.map((i) => i.product.id))
        localStorage.setItem('cart_added_products', JSON.stringify(realIds))
        window.dispatchEvent(new Event('storage'))
      })
      .catch(() => {})
  }, [setCount])

  useEffect(() => {
    if (!session?.user?.backendToken) return
    syncCart(session.user.backendToken)
  }, [session?.user?.backendToken, syncCart])

  useEffect(() => {
    if (!session?.user?.backendToken) return
    const token = session.user.backendToken
    const handler = () => syncCart(token)
    window.addEventListener('cart:refresh', handler)
    return () => window.removeEventListener('cart:refresh', handler)
  }, [session?.user?.backendToken, syncCart])

  return null
}
