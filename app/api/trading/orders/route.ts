import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { symbol, side, type, quantity, price, stopPrice } = body

    // Validate required fields
    if (!symbol || !side || !type || !quantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get current market price for validation
    const marketData = await prisma.marketData.findUnique({
      where: { symbol },
    })

    if (!marketData) {
      return NextResponse.json({ error: "Invalid trading pair" }, { status: 400 })
    }

    const currentPrice = marketData.price
    const [baseAsset, quoteAsset] = symbol.split("/")

    // Calculate order value and validate balances
    let orderValue = 0
    let requiredAsset = ""
    let requiredAmount = 0

    if (side === "BUY") {
      // For buy orders, we need quote asset (USDT)
      requiredAsset = quoteAsset
      orderValue = type === "MARKET" ? quantity * currentPrice : quantity * (price || currentPrice)
      requiredAmount = orderValue
    } else {
      // For sell orders, we need base asset (BTC, ETH, etc.)
      requiredAsset = baseAsset
      requiredAmount = quantity
    }

    // Check user balance
    const wallet = await prisma.wallet.findUnique({
      where: {
        userId_asset: {
          userId: user.id,
          asset: requiredAsset,
        },
      },
    })

    if (!wallet || wallet.balance < requiredAmount) {
      return NextResponse.json(
        {
          error: `Insufficient ${requiredAsset} balance. Required: ${requiredAmount}, Available: ${wallet?.balance || 0}`,
        },
        { status: 400 },
      )
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        symbol,
        side: side as any,
        type: type as any,
        quantity,
        price: type === "MARKET" ? null : price,
        stopPrice,
        status: "PENDING",
      },
    })

    // Lock the required funds
    await prisma.wallet.update({
      where: {
        userId_asset: {
          userId: user.id,
          asset: requiredAsset,
        },
      },
      data: {
        balance: { decrement: requiredAmount },
        locked: { increment: requiredAmount },
      },
    })

    // For market orders, execute immediately
    if (type === "MARKET") {
      await executeMarketOrder(order.id, currentPrice)
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        symbol: order.symbol,
        side: order.side,
        type: order.type,
        quantity: order.quantity,
        price: order.price,
        status: order.status,
        createdAt: order.createdAt,
      },
    })
  } catch (error) {
    console.error("Trading order error:", error)
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const symbol = searchParams.get("symbol")

    const where: any = { userId: user.id }
    if (status) where.status = status
    if (symbol) where.symbol = symbol

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Get orders error:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

async function executeMarketOrder(orderId: string, marketPrice: number) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    })

    if (!order) return

    const [baseAsset, quoteAsset] = order.symbol.split("/")
    const executionPrice = marketPrice
    const totalValue = order.quantity * executionPrice
    const fee = totalValue * 0.001 // 0.1% trading fee

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "FILLED",
        filledQuantity: order.quantity,
        averagePrice: executionPrice,
        totalValue,
        fee,
        filledAt: new Date(),
      },
    })

    if (order.side === "BUY") {
      // Release locked USDT and add base asset
      await prisma.wallet.update({
        where: {
          userId_asset: {
            userId: order.userId,
            asset: quoteAsset,
          },
        },
        data: {
          locked: { decrement: totalValue },
        },
      })

      // Add base asset to wallet
      await prisma.wallet.upsert({
        where: {
          userId_asset: {
            userId: order.userId,
            asset: baseAsset,
          },
        },
        update: {
          balance: { increment: order.quantity - order.quantity * 0.001 }, // Subtract fee
        },
        create: {
          userId: order.userId,
          asset: baseAsset,
          balance: order.quantity - order.quantity * 0.001,
          locked: 0,
          usdPrice: executionPrice,
        },
      })
    } else {
      // Release locked base asset and add USDT
      await prisma.wallet.update({
        where: {
          userId_asset: {
            userId: order.userId,
            asset: baseAsset,
          },
        },
        data: {
          locked: { decrement: order.quantity },
        },
      })

      // Add USDT to wallet
      await prisma.wallet.upsert({
        where: {
          userId_asset: {
            userId: order.userId,
            asset: quoteAsset,
          },
        },
        update: {
          balance: { increment: totalValue - fee },
        },
        create: {
          userId: order.userId,
          asset: quoteAsset,
          balance: totalValue - fee,
          locked: 0,
          usdPrice: 1,
        },
      })
    }

    // Create transaction record
    await prisma.transaction.create({
      data: {
        userId: order.userId,
        type: "TRADE",
        asset: order.side === "BUY" ? baseAsset : quoteAsset,
        amount: order.side === "BUY" ? order.quantity : totalValue,
        fee,
        status: "COMPLETED",
        description: `${order.side} ${order.quantity} ${baseAsset} at $${executionPrice}`,
        orderId: order.id,
      },
    })

    // Mark user as having traded
    await prisma.user.update({
      where: { id: order.userId },
      data: { hasTraded: true },
    })
  } catch (error) {
    console.error("Order execution error:", error)
    // Update order status to failed
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "REJECTED" },
    })
  }
}
