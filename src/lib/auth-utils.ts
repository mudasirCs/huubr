import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "./auth"

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/login")
  }
  
  return user
}

export function getRedirectUrl(role?: string) {
  switch (role) {
    case "BUSINESS_OWNER":
      return "/business/dashboard"
    case "ADMIN":
      return "/admin/dashboard"
    case "CUSTOMER":
      return "/customer/dashboard"
    default:
      return "/dashboard"
  }
}