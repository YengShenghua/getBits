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
          toAddress: true,
          fromAddress: true,
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
      toAddress: transaction.toAddress,
      fromAddress: transaction.fromAddress,
    }))

    const pagination = {
      page,
      pages: Math.ceil(total / limit),
      total,
      limit,
    }

    return NextResponse.json({
      success: true,
      transactions: formattedTransactions,
      pagination,
    })
  } catch (error) {
    console.error("Transactions API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        transactions: [],
        pagination: { page: 1, pages: 0, total: 0, limit: 20 },
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, amount, asset, description, toAddress } = body

    if (!type || !amount || !asset) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        type: type.toUpperCase(),
        amount: Number.parseFloat(amount),
        asset: asset.toUpperCase(),
        status: "PENDING",
        description: description || `${type} transaction`,
        toAddress: toAddress || null,
      },
    })

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
      },
    })
  } catch (error) {
    console.error("Transaction creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
