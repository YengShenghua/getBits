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
    const limit = Number.parseInt(searchParams.get("limit") || "10")

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
          asset: true,
          amount: true,
          status: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.transaction.count({ where }),
    ])

    const pagination = {
      page,
      pages: Math.ceil(total / limit),
      total,
      limit,
    }

    return NextResponse.json({
      transactions,
      pagination,
      success: true,
    })
  } catch (error) {
    console.error("Transaction tracking API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        transactions: [],
        pagination: { page: 1, pages: 0, total: 0, limit: 10 },
      },
      { status: 500 },
    )
  }
}
