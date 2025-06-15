import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const type = searchParams.get("type")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    const where: any = {}
    if (status && status !== "all") {
      where.status = status.toUpperCase()
    }
    if (type && type !== "all") {
      where.type = type.toUpperCase()
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
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
    console.error("Admin transactions API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
