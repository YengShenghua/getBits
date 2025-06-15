"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Loader2, RefreshCw } from "lucide-react"
import { useMarketData } from "@/hooks/use-api"
import { Button } from "@/components/ui/button"

export function MarketOverview() {
  const { data: marketResponse, loading, error, refetch } = useMarketData()
  const marketData = marketResponse?.marketData || []

  if (loading) {
    return (
      <Card className="premium-card border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-[#FFD700]">Market Overview</CardTitle>
          <CardDescription className="text-white/70">Loading market data...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-[#FFD700]" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="premium-card border-red-500/20">
        <CardHeader>
          <CardTitle className="text-[#FFD700]">Market Overview</CardTitle>
          <CardDescription className="text-red-400">Failed to load market data</CardDescription>
        </CardHeader>
        <CardContent className="text-center p-8">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={refetch} variant="outline" className="btn-dark-gold">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="premium-card border-[#FFD700]/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-[#FFD700]">Market Overview</CardTitle>
          <CardDescription className="text-white/70">Top cryptocurrency prices and 24h changes</CardDescription>
        </div>
        <Button onClick={refetch} variant="ghost" size="sm" className="text-[#FFD700] hover:bg-[#FFD700]/10">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {marketData.map((coin: any) => (
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
