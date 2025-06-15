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

    // If user has no wallets, create default ones
    if (wallets.length === 0) {
      const defaultAssets = ["BTC", "ETH", "USDT", "BNB"]
      const defaultWallets = await Promise.all(
        defaultAssets.map((asset) =>
          prisma.wallet.create({
            data: {
              userId: user.id,
              asset,
              balance: asset === "BTC" && user.signupBonus > 0 ? user.signupBonus : 0,
              usdPrice: getAssetPrice(asset),
            },
          }),
        ),
      )
      return NextResponse.json({ wallets: defaultWallets })
    }

    return NextResponse.json({ wallets })
  } catch (error) {
    console.error("Wallets API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function getAssetPrice(asset: string): number {
  const prices: Record<string, number> = {
    BTC: 43250,
    ETH: 2650,
    USDT: 1,
    BNB: 315,
  }
  return prices[asset] || 0
}
