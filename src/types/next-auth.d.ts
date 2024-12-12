// src/types/next-auth.d.ts

import { UserRole } from "@prisma/client"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string | null
    image?: string | null
    role: UserRole
    emailVerified: boolean | null
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string | null
      image?: string | null
      role: UserRole
      emailVerified: boolean | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    name: string | null
    picture?: string | null
    role: UserRole
    emailVerified: boolean | null
  }
}