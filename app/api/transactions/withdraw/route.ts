import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { asset, amount, address } = body

    // Validate input
    if (!asset || !amount || amount <= 0 || !address) {
      return NextResponse.json({ error: "Invalid withdrawal data" }, { status: 400 })
    }

    // Check if user can withdraw
    if (!user.hasDeposited || !user.hasTraded) {
      return NextResponse.json(
        {
          error: "Complete your first deposit and trade to unlock withdrawals",
        },
        { status: 400 },
      )
    }

    // Check wallet balance
    const wallet = await prisma.wallet.findUnique({
      where: {
        userId_asset: {
          userId: user.id,
          asset,
        },
      },
    })

    if (!wallet || wallet.balance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Create withdrawal transaction with enhanced details
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        type: "WITHDRAWAL",
        asset,
        amount: Number.parseFloat(amount),
        description: `Withdrawal to ${address.slice(0, 6)}...${address.slice(-4)}`,
        toAddress: address,
        status: "PENDING",
        metadata: JSON.stringify({
          network: getNetworkForAsset(asset),
          timestamp: new Date().toISOString(),
          userAgent: request.headers.get("user-agent"),
          walletBalanceBefore: wallet.balance,
        }),
      },
    })

    // Lock the funds
    await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { decrement: amount },
        locked: { increment: amount },
      },
    })

    return NextResponse.json({
      transaction,
      message: "Withdrawal request created successfully",
    })
  } catch (error) {
    console.error("Withdrawal API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function getNetworkForAsset(asset: string): string {
  const networks: Record<string, string> = {
    BTC: "Bitcoin",
    ETH: "Ethereum",
    USDT: "Ethereum (ERC-20)",
    BNB: "BNB Smart Chain",
  }
  return networks[asset] || "Unknown"
}
