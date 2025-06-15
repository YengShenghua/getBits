import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const wallets = await prisma.wallet.findMany({
      where: { userId: user.id },
      orderBy: { asset: "asc" },
    })

    return NextResponse.json({ wallets })
  } catch (error) {
    console.error("Wallets fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
