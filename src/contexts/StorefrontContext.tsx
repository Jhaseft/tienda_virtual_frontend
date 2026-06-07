"use client"

import { createContext, useContext } from "react"

interface StorefrontValue {
  isSubdomain: boolean
  sub: string | null
  storeId: string | null
  mainDomainStoreUrl: string | null
}

const defaultValue: StorefrontValue = {
  isSubdomain: false,
  sub: null,
  storeId: null,
  mainDomainStoreUrl: null,
}

const StorefrontContext = createContext<StorefrontValue>(defaultValue)

export function StorefrontProvider({
  value,
  children,
}: {
  value: StorefrontValue
  children: React.ReactNode
}) {
  return <StorefrontContext.Provider value={value}>{children}</StorefrontContext.Provider>
}

export function useStorefront(): StorefrontValue {
  return useContext(StorefrontContext)
}
