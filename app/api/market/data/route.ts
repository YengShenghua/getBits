import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Try to get market data from database
    let marketData = await prisma.marketData.findMany({
      orderBy: { symbol: "asc" },
    })

    // If no data exists, create initial data
    if (marketData.length === 0) {
      const initialData = [
        { symbol: "BTC/USDT", price: 43250.5, change: "+2.4%", volume: "1.2B", isUp: true },
        { symbol: "ETH/USDT", price: 2650.75, change: "+1.8%", volume: "890M", isUp: true },
        { symbol: "BNB/USDT", price: 315.2, change: "-0.5%", volume: "245M", isUp: false },
        { symbol: "ADA/USDT", price: 0.485, change: "+3.2%", volume: "180M", isUp: true },
        { symbol: "SOL/USDT", price: 98.45, change: "+5.1%", volume: "320M", isUp: true },
        { symbol: "DOT/USDT", price: 7.85, change: "-1.2%", volume: "95M", isUp: false },
      ]

      // Create market data entries
      for (const data of initialData) {
        await prisma.marketData.create({ data })
      }

      // Fetch the created data
      marketData = await prisma.marketData.findMany({
        orderBy: { symbol: "asc" },
      })
    }

    // Simulate price updates (in production, this would come from real APIs)
    const updatedData = marketData.map((item) => {
      const priceVariation = 0.98 + Math.random() * 0.04 // ±2% variation
      const newPrice = item.price * priceVariation
      const changePercent = (((newPrice - item.price) / item.price) * 100).toFixed(1)
      const isUp = newPrice > item.price

      return {
        ...item,
        price: Number.parseFloat(newPrice.toFixed(2)),
        change: `${isUp ? "+" : ""}${changePercent}%`,
        isUp,
      }
    })

    return NextResponse.json({ marketData: updatedData })
  } catch (error) {
    console.error("Market data API error:", error)
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 })
  }
}
