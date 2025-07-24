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
    const { amount, asset, address, network } = body

    // Validate required fields
    if (!amount || !asset || !address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate amount
    const numAmount = Number.parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Check user balance (simplified - in real app you'd have a proper wallet system)
    const userTransactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        asset: asset.toUpperCase(),
        status: "COMPLETED",
      },
    })

    const balance = userTransactions.reduce((acc, tx) => {
      return tx.type === "DEPOSIT" ? acc + tx.amount : acc - tx.amount
    }, 0)

    if (balance < numAmount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Validate withdrawal address (basic validation)
    if (address.length < 26 || address.length > 62) {
      return NextResponse.json({ error: "Invalid withdrawal address" }, { status: 400 })
    }

    // Calculate withdrawal fee (simplified)
    const feePercentage = 0.001 // 0.1%
    const fee = numAmount * feePercentage
    const netAmount = numAmount - fee

    // Create withdrawal transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        type: "WITHDRAWAL",
        asset: asset.toUpperCase(),
        amount: numAmount,
        status: "PENDING",
        description: `Withdrawal to ${address.substring(0, 8)}...${address.substring(address.length - 8)}`,
      },
    })

    // In a real application, you would:
    // 1. Perform additional security checks (2FA, withdrawal limits, etc.)
    // 2. Queue the withdrawal for manual review if needed
    // 3. Process the blockchain transaction
    // 4. Monitor transaction confirmation
    // 5. Update status accordingly

    // For demo purposes, simulate processing
    const shouldSucceed = Math.random() > 0.05 // 95% success rate

    if (shouldSucceed) {
      // Simulate processing time
      setTimeout(async () => {
        try {
          await prisma.transaction.update({
            where: { id: transaction.id },
            data: {
              status: "COMPLETED",
              description: `Withdrawal to ${address.substring(0, 8)}...${address.substring(address.length - 8)} - Completed`,
            },
          })
        } catch (error) {
          console.error("Error updating transaction:", error)
        }
      }, 10000) // Complete after 10 seconds
    } else {
      // Simulate failure
      setTimeout(async () => {
        try {
          await prisma.transaction.update({
            where: { id: transaction.id },
            data: {
              status: "FAILED",
              description: `Withdrawal to ${address.substring(0, 8)}...${address.substring(address.length - 8)} - Failed`,
            },
          })
        } catch (error) {
          console.error("Error updating transaction:", error)
        }
      }, 5000) // Fail after 5 seconds
    }

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        currency: transaction.asset,
        status: transaction.status,
        createdAt: transaction.createdAt.toISOString(),
        description: transaction.description,
        toAddress: address,
        fee: fee,
        netAmount: netAmount,
        network: network || "mainnet",
      },
      message: "Withdrawal initiated successfully",
    })
  } catch (error) {
    console.error("Withdrawal API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
