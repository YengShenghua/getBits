import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateDepositAddress } from "@/lib/utils/crypto"
import { assessTransactionRisk } from "@/lib/utils/risk"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { asset, amount, method } = await request.json()

    if (!asset || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
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
      method,
    )

    // Generate deposit address for crypto
    let depositAddress = null
    if (method === "crypto") {
      depositAddress = generateDepositAddress(asset, user.id)
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        type: "DEPOSIT",
        asset,
        amount,
        method,
        depositAddress,
        riskScore: riskAssessment.score,
        riskFlags: riskAssessment.flags,
        status:
          riskAssessment.recommendation === "approve"
            ? "PROCESSING"
            : riskAssessment.recommendation === "review"
              ? "PENDING"
              : "FLAGGED",
      },
    })

    // For approved transactions, simulate processing
    if (riskAssessment.recommendation === "approve" && method !== "crypto") {
      // Simulate instant processing for cards/bank (in production, this would be async)
      setTimeout(async () => {
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: "COMPLETED", processedAt: new Date() },
        })

        // Update wallet balance
        await prisma.wallet.updateMany({
          where: { userId: user.id, asset },
          data: { balance: { increment: amount } },
        })
      }, 2000)
    }

    return NextResponse.json({
      message:
        method === "crypto"
          ? `Please send ${amount} ${asset} to the provided address`
          : `Deposit of ${amount} ${asset} is being processed`,
      transaction,
      depositAddress,
    })
  } catch (error) {
    console.error("Deposit error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
