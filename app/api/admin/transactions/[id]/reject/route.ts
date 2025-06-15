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
    const { reason } = body

    const transaction = await prisma.transaction.findUnique({
      where: { id },
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
          status: "REJECTED",
          reviewedBy: user.id,
          reviewedAt: new Date(),
          notes: reason,
        },
      })

      // If it was a withdrawal, unlock the funds
      if (transaction.type === "WITHDRAWAL") {
        await tx.wallet.updateMany({
          where: {
            userId: transaction.userId,
            asset: transaction.asset,
          },
          data: {
            balance: { increment: transaction.amount },
            locked: { decrement: transaction.amount },
          },
        })
      }
    })

    return NextResponse.json({ message: "Transaction rejected successfully" })
  } catch (error) {
    console.error("Reject transaction error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
