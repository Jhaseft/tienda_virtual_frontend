"use client"

import { createContext, useContext, useState, useCallback } from "react"

interface CartContextValue {
  count: number
  increment: (by?: number) => void
  decrement: (by?: number) => void
  setCount: (n: number) => void
}

const CartContext = createContext<CartContextValue>({
  count: 0,
  increment: () => {},
  decrement: () => {},
  setCount: () => {},
})

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0)

  const increment = useCallback((by = 1) => setCount((c) => c + by), [])
  const decrement = useCallback((by = 1) => setCount((c) => Math.max(0, c - by)), [])

  return (
    <CartContext.Provider value={{ count, increment, decrement, setCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
