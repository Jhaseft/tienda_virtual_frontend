import { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

type UserRole = "CLIENT" | "VENDOR" | "ADMIN"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      backendToken: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: UserRole
    backendToken: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    role: UserRole
    backendToken: string
  }
}
