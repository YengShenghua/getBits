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
    if (status) {
      where.status = status.toUpperCase()
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ])

    const pagination = {
      page,
      pages: Math.ceil(total / limit),
      total,
      limit,
    }

    return NextResponse.json({ transactions, pagination })
  } catch (error) {
    console.error("Transactions API error:", error)
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
    const { type, asset, amount, description } = body

    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        type: type.toUpperCase(),
        asset,
        amount: Number.parseFloat(amount),
        description,
        status: "PENDING",
      },
    })

    return NextResponse.json({ transaction })
  } catch (error) {
    console.error("Create transaction error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
