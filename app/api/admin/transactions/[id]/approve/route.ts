import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { notes } = body

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    if (transaction.status !== "PENDING") {
      return NextResponse.json({ error: "Transaction already processed" }, { status: 400 })
    }

    await prisma.$transaction(async (tx) => {
      // Update transaction
      await tx.transaction.update({
        where: { id },
        data: {
          status: "COMPLETED",
          reviewedBy: user.id,
          reviewedAt: new Date(),
          notes,
        },
      })

      // Process based on transaction type
      if (transaction.type === "WITHDRAWAL") {
        // For withdrawals, remove from locked and complete
        await tx.wallet.updateMany({
          where: {
            userId: transaction.userId,
            asset: transaction.asset,
          },
          data: {
            locked: { decrement: transaction.amount },
          },
        })
      } else if (transaction.type === "DEPOSIT") {
        // For deposits, add to balance
        await tx.wallet.upsert({
          where: {
            userId_asset: {
              userId: transaction.userId,
              asset: transaction.asset,
            },
          },
          update: {
            balance: { increment: transaction.amount },
          },
          create: {
            userId: transaction.userId,
            asset: transaction.asset,
            balance: transaction.amount,
            usdPrice: getAssetPrice(transaction.asset),
          },
        })

        // Mark user as having deposited
        await tx.user.update({
          where: { id: transaction.userId },
          data: { hasDeposited: true },
        })
      }
    })

    return NextResponse.json({ message: "Transaction approved successfully" })
  } catch (error) {
    console.error("Approve transaction error:", error)
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
