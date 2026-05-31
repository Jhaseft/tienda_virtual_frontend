"use client"

import { useState } from "react"
import Link from "next/link"
import { StoreDetail, StoreProduct } from "@/types/explorar"
import StoreProductsGrid from "./StoreProductsGrid"
import StoreInfoTab from "./StoreInfoTab"

type Tab = "productos" | "informacion"

interface Props {
  store: StoreDetail
  products: StoreProduct[]
  totalProducts: number
}

const PREVIEW_LIMIT = 8

export default function StoreTabs({ store, products, totalProducts }: Props) {
  const [active, setActive] = useState<Tab>("productos")
  const preview = products.slice(0, PREVIEW_LIMIT)

  return (
    <div>
      <div className="flex border-b border-gray-100 mb-6">
        {(["productos", "informacion"] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors relative ${
              active === tab ? "text-violet-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab === "productos" ? `Productos (${totalProducts})` : "Información"}
            {active === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {active === "productos" ? (
        <div className="flex flex-col gap-6">
          <StoreProductsGrid products={preview} />
          {totalProducts > PREVIEW_LIMIT && (
            <div className="flex justify-center">
              <Link
                href={`/tiendas/${store.id}/productos`}
                className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-2xl transition-colors shadow-sm shadow-violet-200"
              >
                Ver todos los productos
                <ArrowIcon />
              </Link>
            </div>
          )}
        </div>
      ) : (
        <StoreInfoTab store={store} />
      )}
    </div>
  )
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
