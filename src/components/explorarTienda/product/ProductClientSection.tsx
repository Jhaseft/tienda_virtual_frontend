"use client"

import { useState } from "react"
import { ProductSize, ProductColor } from "@/types/explorar"
import ProductSizeSelector from "./ProductSizeSelector"
import ProductColorSelector from "./ProductColorSelector"
import ProductActions from "./ProductActions"

interface Props {
  productId: string
  productName: string
  price: number
  stock: number
  whatsapp: string | null
  storeName: string
  storeId: string
  sizes: ProductSize[]
  colors: ProductColor[]
}

export default function ProductClientSection({
  productId, productName, price, stock, whatsapp, storeName, storeId, sizes, colors,
}: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-5">
      <ProductSizeSelector
        sizes={sizes}
        onSelect={s => setSelectedSize(s?.size ?? null)}
      />
      <ProductColorSelector
        colors={colors}
        onSelect={c => setSelectedColor(c?.name ?? null)}
      />
      <ProductActions
        productId={productId}
        productName={productName}
        price={price}
        stock={stock}
        whatsapp={whatsapp}
        storeName={storeName}
        storeId={storeId}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
      />
    </div>
  )
}
