'use client'

import { useState, useTransition } from 'react'
import type { CartGroup } from '@/app/(explorarTienda)/api/carrito.api'
import { updateCartItem, removeCartItem } from '@/app/(explorarTienda)/api/carrito.api'
import { useCart } from '@/contexts/CartContext'
import CartStoreGroup from './CartStoreGroup'
import CartEmpty from './CartEmpty'
import CartSummary from './CartSummary'

interface Props {
  initialGroups: CartGroup[]
  token: string
}

export default function CartClientShell({ initialGroups, token }: Props) {
  const [groups, setGroups] = useState<CartGroup[]>(initialGroups)
  const [isPending, startTransition] = useTransition()
  const { decrement } = useCart()

  const recalcSubtotal = (items: CartGroup['items']): number =>
    items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  const handleQuantityChange = (itemId: string, newQty: number) => {
    if (newQty < 1) return
    const prev = groups
    setGroups((gs) =>
      gs.map((g) => ({
        ...g,
        items: g.items.map((i) => (i.id === itemId ? { ...i, quantity: newQty } : i)),
        subtotal: recalcSubtotal(
          g.items.map((i) => (i.id === itemId ? { ...i, quantity: newQty } : i)),
        ),
      })),
    )
    startTransition(async () => {
      try {
        await updateCartItem(token, itemId, newQty)
      } catch {
        setGroups(prev)
      }
    })
  }

  const handleRemove = (itemId: string) => {
    const prev = groups
    const removedItem = groups.flatMap((g) => g.items).find((i) => i.id === itemId)
    setGroups((gs) =>
      gs
        .map((g) => {
          const items = g.items.filter((i) => i.id !== itemId)
          return { ...g, items, subtotal: recalcSubtotal(items) }
        })
        .filter((g) => g.items.length > 0),
    )
    decrement()
    if (removedItem) {
      const saved = localStorage.getItem('cart_added_products')
      const ids: string[] = saved ? JSON.parse(saved) : []
      localStorage.setItem('cart_added_products', JSON.stringify(ids.filter((id) => id !== removedItem.product.id)))
    }
    startTransition(async () => {
      try {
        await removeCartItem(token, itemId)
      } catch {
        setGroups(prev)
      }
    })
  }

  const totalItems = groups.reduce((s, g) => s + g.items.reduce((si, i) => si + i.quantity, 0), 0)
  const totalPrice = groups.reduce((s, g) => s + g.subtotal, 0)

  if (groups.length === 0) return <CartEmpty />

  return (
    <div className="flex flex-col lg:flex-row gap-2 md:gap-5 items-start">
      <div className="flex-1 w-full">
        {groups.map((group) => (
          <CartStoreGroup
            key={group.store.id}
            group={group}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemove}
            loading={isPending}
          />
        ))}
      </div>

      <div className="w-full lg:w-80 lg:sticky lg:top-24">
        <CartSummary totalItems={totalItems} totalPrice={totalPrice} groups={groups} />
      </div>
    </div>
  )
}
