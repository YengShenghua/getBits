"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

const orderBookData = {
  asks: [
    { price: 43275.5, amount: 0.125, total: 5409.44 },
    { price: 43270.25, amount: 0.25, total: 10817.56 },
    { price: 43265.0, amount: 0.18, total: 7787.7 },
    { price: 43260.75, amount: 0.32, total: 13843.44 },
    { price: 43255.5, amount: 0.095, total: 4109.27 },
  ],
  bids: [
    { price: 43245.25, amount: 0.15, total: 6486.79 },
    { price: 43240.0, amount: 0.28, total: 12107.2 },
    { price: 43235.75, amount: 0.2, total: 8647.15 },
    { price: 43230.5, amount: 0.35, total: 15130.68 },
    { price: 43225.25, amount: 0.12, total: 5187.03 },
  ],
}

const recentTrades = [
  { price: 43250.5, amount: 0.025, time: "14:32:15", type: "buy" },
  { price: 43248.75, amount: 0.15, time: "14:32:10", type: "sell" },
  { price: 43252.0, amount: 0.08, time: "14:32:05", type: "buy" },
  { price: 43249.25, amount: 0.2, time: "14:32:00", type: "sell" },
  { price: 43251.75, amount: 0.045, time: "14:31:55", type: "buy" },
]

export function TradingInterface() {
  const [buyOrder, setBuyOrder] = useState({
    price: "43250.50",
    amount: "",
    orderType: "market",
  })

  const [sellOrder, setSellOrder] = useState({
    price: "43250.50",
    amount: "",
    orderType: "market",
  })

  const handleBuyOrderChange = (field: string, value: string) => {
    setBuyOrder((prev) => ({ ...prev, [field]: value }))
  }

  const handleSellOrderChange = (field: string, value: string) => {
    setSellOrder((prev) => ({ ...prev, [field]: value }))
  }

  const calculateTotal = (price: string, amount: string) => {
    const priceNum = Number.parseFloat(price.replace(/,/g, "")) || 0
    const amountNum = Number.parseFloat(amount) || 0
    return (priceNum * amountNum).toFixed(2)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
      {/* Order Book */}
      <Card className="lg:col-span-1 premium-card border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-sm text-[#FFD700]">Order Book</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-[#FFD700]/30 text-[#FFD700]">
              BTC/USDT
            </Badge>
            <span className="text-lg font-bold text-white">$43,250.50</span>
            <Badge variant="default" className="bg-green-600 text-white">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.4%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {/* Asks */}
            <div className="px-4 py-2 bg-red-900/20">
              <div className="grid grid-cols-3 text-xs font-medium text-white/60">
                <span>Price</span>
                <span>Amount</span>
                <span>Total</span>
              </div>
            </div>
            {orderBookData.asks.reverse().map((ask, index) => (
              <div key={index} className="px-4 py-1 hover:bg-red-900/10">
                <div className="grid grid-cols-3 text-xs">
                  <span className="text-red-400">{ask.price.toFixed(2)}</span>
                  <span className="text-white">{ask.amount.toFixed(3)}</span>
                  <span className="text-white">{ask.total.toFixed(2)}</span>
                </div>
              </div>
            ))}

            {/* Spread */}
            <div className="px-4 py-2 bg-[#FFD700]/10 text-center">
              <span className="text-xs font-medium text-[#FFD700]">Spread: $25.25</span>
            </div>

            {/* Bids */}
            {orderBookData.bids.map((bid, index) => (
              <div key={index} className="px-4 py-1 hover:bg-green-900/10">
                <div className="grid grid-cols-3 text-xs">
                  <span className="text-green-400">{bid.price.toFixed(2)}</span>
                  <span className="text-white">{bid.amount.toFixed(3)}</span>
                  <span className="text-white">{bid.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
            <div className="px-4 py-2 bg-green-900/20">
              <div className="grid grid-cols-3 text-xs font-medium text-white/60">
                <span>Price</span>
                <span>Amount</span>
                <span>Total</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart Area */}
      <Card className="lg:col-span-2 premium-card border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-[#FFD700]">BTC/USDT Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-black/50 border border-[#FFD700]/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-16 w-16 mx-auto text-[#FFD700] mb-4" />
              <p className="text-white/70">TradingView Chart Integration</p>
              <p className="text-sm text-white/50">Advanced charting tools coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trading Panel & Recent Trades */}
      <div className="lg:col-span-1 space-y-6">
        {/* Trading Panel */}
        <Card className="premium-card border-[#FFD700]/20">
          <CardHeader>
            <CardTitle className="text-sm text-[#FFD700]">Place Order</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="buy" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-black/50 border border-[#FFD700]/20">
                <TabsTrigger
                  value="buy"
                  className="text-green-400 data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  Buy
                </TabsTrigger>
                <TabsTrigger
                  value="sell"
                  className="text-red-400 data-[state=active]:bg-red-600 data-[state=active]:text-white"
                >
                  Sell
                </TabsTrigger>
              </TabsList>

              <TabsContent value="buy" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="buy-order-type" className="text-white">
                    Order Type
                  </Label>
                  <Select
                    value={buyOrder.orderType}
                    onValueChange={(value) => handleBuyOrderChange("orderType", value)}
                  >
                    <SelectTrigger className="bg-black/50 border-[#FFD700]/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-[#FFD700]/30">
                      <SelectItem value="market" className="text-white">
                        Market
                      </SelectItem>
                      <SelectItem value="limit" className="text-white">
                        Limit
                      </SelectItem>
                      <SelectItem value="stop" className="text-white">
                        Stop
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buy-price" className="text-white">
                    Price (USDT)
                  </Label>
                  <Input
                    id="buy-price"
                    value={buyOrder.price}
                    onChange={(e) => handleBuyOrderChange("price", e.target.value)}
                    className="text-right bg-black/50 border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buy-amount" className="text-white">
                    Amount (BTC)
                  </Label>
                  <Input
                    id="buy-amount"
                    value={buyOrder.amount}
                    onChange={(e) => handleBuyOrderChange("amount", e.target.value)}
                    placeholder="0.001"
                    className="text-right bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Total (USDT)</Label>
                  <div className="p-2 bg-black/50 border border-[#FFD700]/30 rounded text-right text-white">
                    {calculateTotal(buyOrder.price, buyOrder.amount)}
                  </div>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Buy BTC</Button>
              </TabsContent>

              <TabsContent value="sell" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sell-order-type" className="text-white">
                    Order Type
                  </Label>
                  <Select
                    value={sellOrder.orderType}
                    onValueChange={(value) => handleSellOrderChange("orderType", value)}
                  >
                    <SelectTrigger className="bg-black/50 border-[#FFD700]/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-[#FFD700]/30">
                      <SelectItem value="market" className="text-white">
                        Market
                      </SelectItem>
                      <SelectItem value="limit" className="text-white">
                        Limit
                      </SelectItem>
                      <SelectItem value="stop" className="text-white">
                        Stop
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sell-price" className="text-white">
                    Price (USDT)
                  </Label>
                  <Input
                    id="sell-price"
                    value={sellOrder.price}
                    onChange={(e) => handleSellOrderChange("price", e.target.value)}
                    className="text-right bg-black/50 border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sell-amount" className="text-white">
                    Amount (BTC)
                  </Label>
                  <Input
                    id="sell-amount"
                    value={sellOrder.amount}
                    onChange={(e) => handleSellOrderChange("amount", e.target.value)}
                    placeholder="0.001"
                    className="text-right bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Total (USDT)</Label>
                  <div className="p-2 bg-black/50 border border-[#FFD700]/30 rounded text-right text-white">
                    {calculateTotal(sellOrder.price, sellOrder.amount)}
                  </div>
                </div>

                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Sell BTC</Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Recent Trades */}
        <Card className="premium-card border-[#FFD700]/20">
          <CardHeader>
            <CardTitle className="text-sm text-[#FFD700]">Recent Trades</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              <div className="px-4 py-2 bg-[#FFD700]/10">
                <div className="grid grid-cols-3 text-xs font-medium text-white/60">
                  <span>Price</span>
                  <span>Amount</span>
                  <span>Time</span>
                </div>
              </div>
              {recentTrades.map((trade, index) => (
                <div key={index} className="px-4 py-1">
                  <div className="grid grid-cols-3 text-xs">
                    <span className={trade.type === "buy" ? "text-green-400" : "text-red-400"}>
                      {trade.price.toFixed(2)}
                    </span>
                    <span className="text-white">{trade.amount.toFixed(3)}</span>
                    <span className="text-white/60">{trade.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
