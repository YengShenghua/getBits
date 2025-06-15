import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser(request)
    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { notes } = await request.json()
    const transactionId = params.id

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { user: true },
    })

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    if (transaction.status !== "PENDING" && transaction.status !== "FLAGGED") {
      return NextResponse.json({ error: "Transaction cannot be approved" }, { status: 400 })
    }

    // Update transaction status
    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: "COMPLETED",
        adminNotes: notes,
        processedAt: new Date(),
      },
    })

    // For deposits, add to wallet balance
    if (transaction.type === "DEPOSIT") {
      await prisma.wallet.updateMany({
        where: { userId: transaction.userId, asset: transaction.asset },
        data: { balance: { increment: transaction.amount } },
      })
    }

    // For withdrawals, remove from locked balance
    if (transaction.type === "WITHDRAWAL") {
      await prisma.wallet.updateMany({
        where: { userId: transaction.userId, asset: transaction.asset },
        data: { locked: { decrement: transaction.amount } },
      })
    }

    // Create notification
    await prisma.notification.create({
      data: {
        userId: transaction.userId,
        title: `${transaction.type} Approved`,
        message: `Your ${transaction.type.toLowerCase()} of ${transaction.amount} ${transaction.asset} has been approved.`,
        type: "success",
      },
    })

    return NextResponse.json({ message: "Transaction approved successfully" })
  } catch (error) {
    console.error("Transaction approval error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
