import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { validateAddress } from "@/lib/utils/crypto"
import { assessTransactionRisk } from "@/lib/utils/risk"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { asset, amount, address, bankDetails } = await request.json()

    if (!asset || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    // Check if user has sufficient balance
    const wallet = await prisma.wallet.findUnique({
      where: { userId_asset: { userId: user.id, asset } },
    })

    if (!wallet || wallet.balance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Validate address for crypto withdrawals
    if (address && !validateAddress(asset, address)) {
      return NextResponse.json({ error: "Invalid withdrawal address" }, { status: 400 })
    }

    // Get recent transactions for risk assessment
    const recentTransactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    })

    // Assess risk
    const riskAssessment = assessTransactionRisk(
      amount,
      asset,
      {
        ...user,
        recentTransactions,
      },
      address ? "crypto" : "bank",
    )

    // Lock funds in wallet
    await prisma.wallet.update({
      where: { userId_asset: { userId: user.id, asset } },
      data: {
        balance: { decrement: amount },
        locked: { increment: amount },
      },
    })

    // Create withdrawal transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        type: "WITHDRAWAL",
        asset,
        amount,
        address,
        bankDetails: bankDetails ? JSON.parse(JSON.stringify(bankDetails)) : null,
        riskScore: riskAssessment.score,
        riskFlags: riskAssessment.flags,
        status: "PENDING", // All withdrawals require admin approval
      },
    })

    return NextResponse.json({
      message: "Withdrawal request submitted for review",
      transaction,
    })
  } catch (error) {
    console.error("Withdrawal error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
