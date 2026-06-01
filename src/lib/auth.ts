import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  ""

function backendUrl(path: string) {
  if (!BACKEND_BASE_URL) {
    throw new Error("Falta configurar NEXT_PUBLIC_API_URL o NEXT_PUBLIC_BACKEND_URL")
  }

  return `${BACKEND_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}

export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },

  pages: {
    signIn: "/signin",
    error: "/signin",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const res = await fetch(backendUrl("/auth/login"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error((body as { message?: string }).message ?? "Credenciales inválidas")
        }
        const { token, user } = await res.json() as {
          token: string
          user: {
            id: string
            email: string
            firstName?: string
            lastName?: string
            avatarUrl?: string
            role: "CLIENT" | "VENDOR" | "ADMIN"
          }
        }
        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          image: user.avatarUrl ?? null,
          role: user.role,
          backendToken: token,
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: { prompt: "consent", access_type: "offline", response_type: "code" },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (trigger === "update" && (session as { backendToken?: string } | null)?.backendToken) {
        token.backendToken = (session as { backendToken: string }).backendToken
      }
      if (user) {
        token.id = user.id
        token.role = user.role ?? "CLIENT"
        token.backendToken = user.backendToken ?? ""
      }

      if (account?.provider === "google" && user) {
        const res = await fetch(backendUrl("/auth/google"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            googleId: account.providerAccountId,
            email: user.email,
            name: user.name,
            picture: user.image,
          }),
        })
        if (res.ok) {
          const { token: backendToken, user: backendUser } = await res.json() as {
            token: string
            user: { id: string; role: "CLIENT" | "VENDOR" | "ADMIN" }
          }
          token.id = backendUser.id
          token.role = backendUser.role
          token.backendToken = backendToken
        }
      }

      return token
    },

    async session({ session, token }) {
      session.user.id = token.id
      session.user.role = token.role
      session.user.backendToken = token.backendToken
      return session
    },
  },
}
