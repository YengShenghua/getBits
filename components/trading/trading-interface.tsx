"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MarketData {
  symbol: string
  price: number
  change: string
  volume: string
  isUp: boolean
}

interface Order {
  id: string
  symbol: string
  side: string
  type: string
  quantity: number
  price?: number
  status: string
  createdAt: string
}

interface Wallet {
  asset: string
  balance: number
  locked: number
}

export function TradingInterface() {
  const [selectedPair, setSelectedPair] = useState("BTC/USDT")
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [currentPrice, setCurrentPrice] = useState(0)
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [buyOrder, setBuyOrder] = useState({
    price: "",
    amount: "",
    orderType: "market",
  })

  const [sellOrder, setSellOrder] = useState({
    price: "",
    amount: "",
    orderType: "market",
  })

  // Fetch market data
  const fetchMarketData = useCallback(async () => {
    try {
      const response = await fetch("/api/market/data")
      const data = await response.json()
      if (data.marketData) {
        setMarketData(data.marketData)
        const current = data.marketData.find((m: MarketData) => m.symbol === selectedPair)
        if (current) {
          setCurrentPrice(current.price)
          setBuyOrder((prev) => ({ ...prev, price: current.price.toString() }))
          setSellOrder((prev) => ({ ...prev, price: current.price.toString() }))
        }
      }
    } catch (error) {
      console.error("Failed to fetch market data:", error)
    }
  }, [selectedPair])

  // Fetch user wallets
  const fetchWallets = useCallback(async () => {
    try {
      const response = await fetch("/api/wallets")
      const data = await response.json()
      if (data.wallets) {
        setWallets(data.wallets)
      }
    } catch (error) {
      console.error("Failed to fetch wallets:", error)
    }
  }, [])

  // Fetch user orders
  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch("/api/trading/orders")
      const data = await response.json()
      if (data.orders) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    }
  }, [])

  useEffect(() => {
    fetchMarketData()
    fetchWallets()
    fetchOrders()

    // Auto-refresh market data every 30 seconds
    const interval = setInterval(fetchMarketData, 30000)
    return () => clearInterval(interval)
  }, [fetchMarketData, fetchWallets, fetchOrders])

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

  const getBalance = (asset: string) => {
    const wallet = wallets.find((w) => w.asset === asset)
    return wallet ? wallet.balance : 0
  }

  const placeBuyOrder = async () => {
    if (!buyOrder.amount) {
      toast({ title: "Error", description: "Please enter amount", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/trading/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: selectedPair,
          side: "BUY",
          type: buyOrder.orderType.toUpperCase(),
          quantity: Number.parseFloat(buyOrder.amount),
          price: buyOrder.orderType === "market" ? null : Number.parseFloat(buyOrder.price),
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast({ title: "Success", description: "Buy order placed successfully" })
        setBuyOrder({ ...buyOrder, amount: "" })
        fetchWallets()
        fetchOrders()
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to place order", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const placeSellOrder = async () => {
    if (!sellOrder.amount) {
      toast({ title: "Error", description: "Please enter amount", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/trading/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: selectedPair,
          side: "SELL",
          type: sellOrder.orderType.toUpperCase(),
          quantity: Number.parseFloat(sellOrder.amount),
          price: sellOrder.orderType === "market" ? null : Number.parseFloat(sellOrder.price),
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast({ title: "Success", description: "Sell order placed successfully" })
        setSellOrder({ ...sellOrder, amount: "" })
        fetchWallets()
        fetchOrders()
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to place order", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const cancelOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/trading/orders/${orderId}/cancel`, {
        method: "POST",
      })

      const data = await response.json()
      if (data.success) {
        toast({ title: "Success", description: "Order cancelled successfully" })
        fetchOrders()
        fetchWallets()
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to cancel order", variant: "destructive" })
    }
  }

  const currentMarket = marketData.find((m) => m.symbol === selectedPair)
  const [baseAsset, quoteAsset] = selectedPair.split("/")

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
      {/* Market Data & Pair Selection */}
      <Card className="lg:col-span-1 premium-card border-[#FFD700]/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-[#FFD700]">Markets</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchMarketData}
              className="text-[#FFD700] hover:bg-[#FFD700]/10"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          {currentMarket && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="border-[#FFD700]/30 text-[#FFD700]">
                  {selectedPair}
                </Badge>
                <Badge variant="default" className={currentMarket.isUp ? "bg-green-600" : "bg-red-600"}>
                  {currentMarket.isUp ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {currentMarket.change}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-white">${currentMarket.price.toLocaleString()}</div>
              <div className="text-sm text-white/60">Volume: {currentMarket.volume}</div>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {marketData.map((market) => (
              <div
                key={market.symbol}
                className={`px-4 py-2 cursor-pointer hover:bg-[#FFD700]/10 ${
                  selectedPair === market.symbol ? "bg-[#FFD700]/20" : ""
                }`}
                onClick={() => setSelectedPair(market.symbol)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">{market.symbol}</span>
                  <div className="text-right">
                    <div className="text-white">${market.price.toLocaleString()}</div>
                    <div className={`text-xs ${market.isUp ? "text-green-400" : "text-red-400"}`}>{market.change}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chart Area */}
      <Card className="lg:col-span-2 premium-card border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-[#FFD700]">{selectedPair} Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-black/50 border border-[#FFD700]/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-16 w-16 mx-auto text-[#FFD700] mb-4" />
              <p className="text-white/70">Real-time Chart Integration</p>
              <p className="text-sm text-white/50">TradingView widget coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trading Panel & Orders */}
      <div className="lg:col-span-1 space-y-6">
        {/* Trading Panel */}
        <Card className="premium-card border-[#FFD700]/20">
          <CardHeader>
            <CardTitle className="text-sm text-[#FFD700]">Place Order</CardTitle>
            <div className="text-xs text-white/60">
              {baseAsset}: {getBalance(baseAsset).toFixed(6)} | {quoteAsset}: {getBalance(quoteAsset).toFixed(2)}
            </div>
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
                    </SelectContent>
                  </Select>
                </div>

                {buyOrder.orderType === "limit" && (
                  <div className="space-y-2">
                    <Label htmlFor="buy-price" className="text-white">
                      Price ({quoteAsset})
                    </Label>
                    <Input
                      id="buy-price"
                      value={buyOrder.price}
                      onChange={(e) => handleBuyOrderChange("price", e.target.value)}
                      className="text-right bg-black/50 border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="buy-amount" className="text-white">
                    Amount ({baseAsset})
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
                  <Label className="text-white">Total ({quoteAsset})</Label>
                  <div className="p-2 bg-black/50 border border-[#FFD700]/30 rounded text-right text-white">
                    {calculateTotal(
                      buyOrder.orderType === "market" ? currentPrice.toString() : buyOrder.price,
                      buyOrder.amount,
                    )}
                  </div>
                </div>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={placeBuyOrder}
                  disabled={loading}
                >
                  {loading ? "Placing..." : `Buy ${baseAsset}`}
                </Button>
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
                    </SelectContent>
                  </Select>
                </div>

                {sellOrder.orderType === "limit" && (
                  <div className="space-y-2">
                    <Label htmlFor="sell-price" className="text-white">
                      Price ({quoteAsset})
                    </Label>
                    <Input
                      id="sell-price"
                      value={sellOrder.price}
                      onChange={(e) => handleSellOrderChange("price", e.target.value)}
                      className="text-right bg-black/50 border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="sell-amount" className="text-white">
                    Amount ({baseAsset})
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
                  <Label className="text-white">Total ({quoteAsset})</Label>
                  <div className="p-2 bg-black/50 border border-[#FFD700]/30 rounded text-right text-white">
                    {calculateTotal(
                      sellOrder.orderType === "market" ? currentPrice.toString() : sellOrder.price,
                      sellOrder.amount,
                    )}
                  </div>
                </div>

                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={placeSellOrder}
                  disabled={loading}
                >
                  {loading ? "Placing..." : `Sell ${baseAsset}`}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Open Orders */}
        <Card className="premium-card border-[#FFD700]/20">
          <CardHeader>
            <CardTitle className="text-sm text-[#FFD700]">Open Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {orders.filter((order) => order.status === "PENDING").length === 0 ? (
                <div className="px-4 py-8 text-center text-white/60">No open orders</div>
              ) : (
                orders
                  .filter((order) => order.status === "PENDING")
                  .map((order) => (
                    <div key={order.id} className="px-4 py-2 border-b border-white/10">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xs text-white/60">{order.symbol}</div>
                          <div
                            className={`text-sm font-medium ${order.side === "BUY" ? "text-green-400" : "text-red-400"}`}
                          >
                            {order.side} {order.quantity}
                          </div>
                          {order.price && <div className="text-xs text-white/60">@ ${order.price}</div>}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => cancelOrder(order.id)}
                          className="text-red-400 hover:bg-red-400/10"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
