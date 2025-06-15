"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

const mockMarketData = [
  { symbol: "BTC/USDT", price: 43250.5, change: "+2.4%", volume: "1.2B", isUp: true },
  { symbol: "ETH/USDT", price: 2650.75, change: "+1.8%", volume: "890M", isUp: true },
  { symbol: "BNB/USDT", price: 315.2, change: "-0.5%", volume: "245M", isUp: false },
  { symbol: "ADA/USDT", price: 0.485, change: "+3.2%", volume: "180M", isUp: true },
  { symbol: "SOL/USDT", price: 98.45, change: "+5.1%", volume: "320M", isUp: true },
  { symbol: "DOT/USDT", price: 7.85, change: "-1.2%", volume: "95M", isUp: false },
]

export function MarketOverview() {
  return (
    <Card className="premium-card border-[#FFD700]/20">
      <CardHeader>
        <CardTitle className="text-[#FFD700]">Market Overview</CardTitle>
        <CardDescription className="text-white/70">Top cryptocurrency prices and 24h changes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockMarketData.map((coin) => (
            <div
              key={coin.symbol}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-[#FFD700]/5 transition-colors border border-[#FFD700]/10"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-[#FFD700] to-[#FFD700]/80 rounded-full flex items-center justify-center text-black font-bold text-xs">
                  {coin.symbol.split("/")[0].charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-white">{coin.symbol}</div>
                  <div className="text-sm text-white/60">Vol: {coin.volume}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-white">${coin.price.toLocaleString()}</div>
                <Badge
                  variant={coin.isUp ? "default" : "destructive"}
                  className={`text-xs ${coin.isUp ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
                >
                  {coin.isUp ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {coin.change}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
