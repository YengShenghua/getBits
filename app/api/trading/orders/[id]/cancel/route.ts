import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orderId = params.id

    // Find the order
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id,
        status: { in: ["PENDING", "PARTIALLY_FILLED"] },
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found or cannot be cancelled" }, { status: 404 })
    }

    // Calculate remaining quantity and value
    const remainingQuantity = order.quantity - order.filledQuantity
    const [baseAsset, quoteAsset] = order.symbol.split("/")

    let assetToUnlock = ""
    let amountToUnlock = 0

    if (order.side === "BUY") {
      assetToUnlock = quoteAsset
      amountToUnlock = remainingQuantity * (order.price || 0)
    } else {
      assetToUnlock = baseAsset
      amountToUnlock = remainingQuantity
    }

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
    })

    // Unlock the funds
    if (amountToUnlock > 0) {
      await prisma.wallet.update({
        where: {
          userId_asset: {
            userId: user.id,
            asset: assetToUnlock,
          },
        },
        data: {
          balance: { increment: amountToUnlock },
          locked: { decrement: amountToUnlock },
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully",
    })
  } catch (error) {
    console.error("Cancel order error:", error)
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 })
  }
}
