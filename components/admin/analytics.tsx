"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, Users, DollarSign, Activity, Download } from "lucide-react"

const analyticsData = {
  userGrowth: [
    { month: "Jan", users: 1200, active: 980 },
    { month: "Feb", users: 1450, active: 1180 },
    { month: "Mar", users: 1680, active: 1350 },
    { month: "Apr", users: 1920, active: 1580 },
    { month: "May", users: 2150, active: 1780 },
    { month: "Jun", users: 2400, active: 2000 },
  ],
  tradingVolume: [
    { day: "Mon", volume: 2400000 },
    { day: "Tue", volume: 1800000 },
    { day: "Wed", volume: 3200000 },
    { day: "Thu", volume: 2800000 },
    { day: "Fri", volume: 4100000 },
    { day: "Sat", volume: 1900000 },
    { day: "Sun", volume: 1500000 },
  ],
  topAssets: [
    { symbol: "BTC", volume: 45.2, percentage: 45.2 },
    { symbol: "ETH", volume: 28.7, percentage: 28.7 },
    { symbol: "USDT", volume: 15.3, percentage: 15.3 },
    { symbol: "BNB", volume: 6.8, percentage: 6.8 },
    { symbol: "Others", volume: 4.0, percentage: 4.0 },
  ],
}

export function Analytics() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="premium-card border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-[#FFD700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$2.4M</div>
            <p className="text-xs text-green-400">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Active Users</CardTitle>
            <Users className="h-4 w-4 text-[#FFD700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2,847</div>
            <p className="text-xs text-green-400">+8.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Trading Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#FFD700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$18.2M</div>
            <p className="text-xs text-green-400">+15.3% from last month</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Conversion Rate</CardTitle>
            <Activity className="h-4 w-4 text-[#FFD700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3.2%</div>
            <p className="text-xs text-red-400">-0.5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card className="premium-card border-[#FFD700]/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[#FFD700]">User Growth</CardTitle>
                <CardDescription className="text-white/70">Monthly user registration and activity</CardDescription>
              </div>
              <Select defaultValue="6months">
                <SelectTrigger className="w-[120px] bg-black/50 border-[#FFD700]/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-[#FFD700]/30">
                  <SelectItem value="1month" className="text-white">
                    1 Month
                  </SelectItem>
                  <SelectItem value="3months" className="text-white">
                    3 Months
                  </SelectItem>
                  <SelectItem value="6months" className="text-white">
                    6 Months
                  </SelectItem>
                  <SelectItem value="1year" className="text-white">
                    1 Year
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-black/50 border border-[#FFD700]/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto text-[#FFD700] mb-4" />
                <p className="text-white/70">User Growth Chart</p>
                <p className="text-sm text-white/50">Chart visualization would be here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trading Volume Chart */}
        <Card className="premium-card border-[#FFD700]/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[#FFD700]">Trading Volume</CardTitle>
                <CardDescription className="text-white/70">Daily trading volume trends</CardDescription>
              </div>
              <Button className="btn-dark-gold">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-black/50 border border-[#FFD700]/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-16 w-16 mx-auto text-[#FFD700] mb-4" />
                <p className="text-white/70">Volume Chart</p>
                <p className="text-sm text-white/50">Chart visualization would be here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Assets */}
      <Card className="premium-card border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-[#FFD700]">Top Trading Assets</CardTitle>
          <CardDescription className="text-white/70">Most traded cryptocurrencies by volume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.topAssets.map((asset, index) => (
              <div
                key={asset.symbol}
                className="flex items-center justify-between p-3 border border-[#FFD700]/20 rounded-lg bg-black/30"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#FFD700] to-[#FFD700]/80 rounded-full flex items-center justify-center text-black font-bold text-xs">
                    {asset.symbol.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-white">{asset.symbol}</div>
                    <div className="text-sm text-white/60">{asset.volume}% of total volume</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-[#FFD700] text-black">#{index + 1}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
