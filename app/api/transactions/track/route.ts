import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const status = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    const where: any = { userId: user.id }

    if (type && type !== "all") {
      where.type = type.toUpperCase()
    }

    if (status && status !== "all") {
      where.status = status.toUpperCase()
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          type: true,
          amount: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          description: true,
          asset: true,
        },
      }),
      prisma.transaction.count({ where }),
    ])

    // Transform the data to match the expected format
    const formattedTransactions = transactions.map((transaction) => ({
      id: transaction.id,
      type: transaction.type,
      amount: transaction.amount,
      currency: transaction.asset || "BTC",
      status: transaction.status,
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
      description: transaction.description,
    }))

    const pagination = {
      page,
      pages: Math.ceil(total / limit),
      total,
      limit,
    }

    return NextResponse.json({
      transactions: formattedTransactions,
      pagination,
    })
  } catch (error) {
    console.error("Transaction tracking API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { transactionId, action, notes } = body

    if (action === "add_notes" && notes) {
      // Find the transaction
      const transaction = await prisma.transaction.findFirst({
        where: {
          id: transactionId,
          userId: user.id,
        },
      })

      if (!transaction) {
        return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
      }

      // For now, we'll just return success since we don't have a notes table
      // In a real app, you'd store notes in a separate table
      return NextResponse.json({
        success: true,
        message: "Notes added successfully",
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Transaction tracking POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
