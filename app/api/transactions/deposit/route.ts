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
    const { asset, amount, method, address } = body

    // Validate input
    if (!asset || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid deposit data" }, { status: 400 })
    }

    // Create deposit transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        type: "DEPOSIT",
        asset,
        amount: Number.parseFloat(amount),
        description: `${method} deposit - ${asset}`,
        toAddress: address,
        status: "PENDING",
      },
    })

    // For demo purposes, auto-approve small deposits
    if (amount < 100) {
      await processDeposit(transaction.id, user.id, asset, Number.parseFloat(amount))
    }

    return NextResponse.json({
      transaction,
      message: "Deposit request created successfully",
    })
  } catch (error) {
    console.error("Deposit API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function processDeposit(transactionId: string, userId: string, asset: string, amount: number) {
  try {
    await prisma.$transaction(async (tx) => {
      // Update transaction status
      await tx.transaction.update({
        where: { id: transactionId },
        data: { status: "COMPLETED" },
      })

      // Update wallet balance
      await tx.wallet.upsert({
        where: {
          userId_asset: {
            userId,
            asset,
          },
        },
        update: {
          balance: { increment: amount },
        },
        create: {
          userId,
          asset,
          balance: amount,
          usdPrice: getAssetPrice(asset),
        },
      })

      // Mark user as having deposited
      await tx.user.update({
        where: { id: userId },
        data: { hasDeposited: true },
      })
    })
  } catch (error) {
    console.error("Process deposit error:", error)
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
