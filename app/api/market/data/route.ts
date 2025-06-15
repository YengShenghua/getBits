import { NextResponse } from "next/server"

// Mock market data - in production, this would fetch from a real crypto API
const mockMarketData = [
  { symbol: "BTC/USDT", price: 43250.5, change: "+2.4%", volume: "1.2B", isUp: true },
  { symbol: "ETH/USDT", price: 2650.75, change: "+1.8%", volume: "890M", isUp: true },
  { symbol: "BNB/USDT", price: 315.2, change: "-0.5%", volume: "245M", isUp: false },
  { symbol: "ADA/USDT", price: 0.485, change: "+3.2%", volume: "180M", isUp: true },
  { symbol: "SOL/USDT", price: 98.45, change: "+5.1%", volume: "320M", isUp: true },
  { symbol: "DOT/USDT", price: 7.85, change: "-1.2%", volume: "95M", isUp: false },
]

export async function GET() {
  try {
    // In production, you would fetch from CoinGecko, Binance API, etc.
    // const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1')
    // const marketData = await response.json()

    return NextResponse.json({ marketData: mockMarketData })
  } catch (error) {
    console.error("Market data fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 })
  }
}
