"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Globe, Check, AlertCircle, Loader2, ExternalLink } from "lucide-react"
import { getStoreSettings, updateStoreSubdomain } from "@/lib/api/admin"
import { ApiError } from "@/lib/api/client"

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? ""

export default function SubdomainCard() {
  const { data: session } = useSession()
  const token = session?.user.backendToken

  const [current, setCurrent] = useState<string | null>(null)
  const [subdomain, setSubdomain] = useState("")
  const [isFetching, setIsFetching] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedUrl, setSavedUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    getStoreSettings({ token })
      .then((s) => {
        setCurrent(s.subdomain ?? null)
        if (s.subdomain) setSavedUrl(`https://${s.subdomain}.${ROOT_DOMAIN}`)
      })
      .catch(() => {})
      .finally(() => setIsFetching(false))
  }, [token])

  async function handleSave() {
    if (!token) return
    setError(null)
    setSavedUrl(null)
    const clean = subdomain.trim().toLowerCase()
    if (!clean) {
      setError("Escribe un nombre para tu subdominio.")
      return
    }

    setIsSaving(true)
    try {
      const res = await updateStoreSubdomain(clean, { token })
      setCurrent(res.subdomain)
      setSavedUrl(`https://${res.subdomain}.${ROOT_DOMAIN}`)
      setSubdomain("")
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message)
      } else {
        setError("No se pudo guardar el subdominio.")
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 mt-2">
      <p className="text-sm font-bold text-gray-800 mb-1">Subdominio de mi tienda</p>

      <div className="flex flex-col gap-3 px-4 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <Globe size={18} className="text-indigo-600" strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">
              {current ? "Cambiar mi subdominio" : "Elige tu subdominio"}
            </span>
            <span className="text-xs text-gray-500">
              Tu tienda será accesible en <code>{`<nombre>.${ROOT_DOMAIN}`}</code>
            </span>
          </div>
        </div>

        {!isFetching && current && (
          <a
            href={`https://${current}.${ROOT_DOMAIN}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 hover:bg-emerald-100 transition-colors"
          >
            <Check size={14} className="shrink-0" />
            <span className="flex-1 truncate">
              Subdominio actual: {current}.{ROOT_DOMAIN}
            </span>
            <ExternalLink size={12} className="shrink-0" />
          </a>
        )}

        <div className="flex items-stretch gap-2">
          <div className="flex items-center flex-1 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden focus-within:border-indigo-300 focus-within:bg-white transition-colors">
            <input
              type="text"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              placeholder={current ?? "mitienda"}
              disabled={isSaving || isFetching}
              className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none disabled:cursor-not-allowed"
              autoComplete="off"
              spellCheck={false}
            />
            <span className="text-xs text-gray-500 pr-3 select-none">.{ROOT_DOMAIN}</span>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving || isFetching || !subdomain.trim()}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          >
            {isSaving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Guardando
              </>
            ) : current ? (
              "Cambiar"
            ) : (
              "Guardar"
            )}
          </button>
        </div>

        {savedUrl && !error && subdomain === "" && current && (
          <div className="text-xs text-gray-500">
            Cambios guardados. Puede tardar unos segundos en propagarse.
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  )
}
