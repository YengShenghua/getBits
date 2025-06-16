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
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const where: any = {
      userId: user.id,
    }

    if (type) {
      where.type = type
    }

    if (status) {
      where.status = status
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
        include: {
          user: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      }),
      prisma.transaction.count({ where }),
    ])

    // Calculate summary statistics
    const summary = await prisma.transaction.groupBy({
      by: ["type", "status"],
      where: { userId: user.id },
      _count: true,
      _sum: {
        amount: true,
      },
    })

    return NextResponse.json({
      transactions,
      total,
      summary,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error("Transaction tracking error:", error)
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

    // Validate the transaction belongs to the user
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId: user.id,
      },
    })

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    // Log the action
    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        metadata: JSON.stringify({
          ...JSON.parse(transaction.metadata || "{}"),
          userActions: [
            ...(JSON.parse(transaction.metadata || "{}").userActions || []),
            {
              action,
              notes,
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      },
    })

    return NextResponse.json({ message: "Action logged successfully" })
  } catch (error) {
    console.error("Transaction action error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
