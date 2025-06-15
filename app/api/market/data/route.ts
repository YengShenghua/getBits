import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// CoinGecko API (free tier - no API key required)
const COINGECKO_API = "https://api.coingecko.com/api/v3"

interface CoinGeckoPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  total_volume: number
  market_cap: number
}

const CRYPTO_MAPPING = {
  "BTC/USDT": { id: "bitcoin", symbol: "btc" },
  "ETH/USDT": { id: "ethereum", symbol: "eth" },
  "BNB/USDT": { id: "binancecoin", symbol: "bnb" },
  "ADA/USDT": { id: "cardano", symbol: "ada" },
  "SOL/USDT": { id: "solana", symbol: "sol" },
  "DOT/USDT": { id: "polkadot", symbol: "dot" },
  "MATIC/USDT": { id: "matic-network", symbol: "matic" },
  "AVAX/USDT": { id: "avalanche-2", symbol: "avax" },
}

function formatVolume(volume: number): string {
  if (volume >= 1e9) {
    return `${(volume / 1e9).toFixed(1)}B`
  } else if (volume >= 1e6) {
    return `${(volume / 1e6).toFixed(1)}M`
  } else if (volume >= 1e3) {
    return `${(volume / 1e3).toFixed(1)}K`
  }
  return volume.toString()
}

async function fetchRealPrices(): Promise<any[]> {
  try {
    const coinIds = Object.values(CRYPTO_MAPPING)
      .map((coin) => coin.id)
      .join(",")
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`,
      {
        next: { revalidate: 60 }, // Cache for 1 minute
        headers: {
          Accept: "application/json",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data: CoinGeckoPrice[] = await response.json()

    return Object.entries(CRYPTO_MAPPING)
      .map(([symbol, coin]) => {
        const coinData = data.find((d) => d.id === coin.id)
        if (!coinData) {
          return null
        }

        const change24h = coinData.price_change_percentage_24h || 0
        const isUp = change24h > 0

        return {
          symbol,
          price: coinData.current_price,
          change: `${isUp ? "+" : ""}${change24h.toFixed(2)}%`,
          volume: formatVolume(coinData.total_volume),
          isUp,
        }
      })
      .filter(Boolean)
  } catch (error) {
    console.error("Failed to fetch real prices:", error)
    return []
  }
}

export async function GET() {
  try {
    // Try to fetch real-time prices first
    const realPrices = await fetchRealPrices()

    if (realPrices.length > 0) {
      // Update database with real prices
      for (const priceData of realPrices) {
        await prisma.marketData.upsert({
          where: { symbol: priceData.symbol },
          update: {
            price: priceData.price,
            change: priceData.change,
            volume: priceData.volume,
            isUp: priceData.isUp,
            updatedAt: new Date(),
          },
          create: {
            symbol: priceData.symbol,
            price: priceData.price,
            change: priceData.change,
            volume: priceData.volume,
            isUp: priceData.isUp,
          },
        })
      }

      return NextResponse.json({
        marketData: realPrices,
        source: "live",
        timestamp: new Date().toISOString(),
      })
    }

    // Fallback to database if API fails
    const marketData = await prisma.marketData.findMany({
      orderBy: { symbol: "asc" },
    })

    if (marketData.length === 0) {
      // Create initial fallback data
      const fallbackData = [
        { symbol: "BTC/USDT", price: 43250.5, change: "+2.4%", volume: "1.2B", isUp: true },
        { symbol: "ETH/USDT", price: 2650.75, change: "+1.8%", volume: "890M", isUp: true },
        { symbol: "BNB/USDT", price: 315.2, change: "-0.5%", volume: "245M", isUp: false },
        { symbol: "ADA/USDT", price: 0.485, change: "+3.2%", volume: "180M", isUp: true },
        { symbol: "SOL/USDT", price: 98.45, change: "+5.1%", volume: "320M", isUp: true },
        { symbol: "DOT/USDT", price: 7.85, change: "-1.2%", volume: "95M", isUp: false },
      ]

      for (const data of fallbackData) {
        await prisma.marketData.create({ data })
      }

      return NextResponse.json({
        marketData: fallbackData,
        source: "fallback",
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      marketData,
      source: "database",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Market data API error:", error)
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 })
  }
}
