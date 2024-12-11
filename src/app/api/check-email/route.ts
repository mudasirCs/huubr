import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true } // Only select id for efficiency
    })

    return NextResponse.json({
      exists: !!existingUser
    })

  } catch (error) {
    console.error("Email check error:", error)
    return NextResponse.json(
      { error: "Failed to check email" },
      { status: 500 }
    )
  }
}