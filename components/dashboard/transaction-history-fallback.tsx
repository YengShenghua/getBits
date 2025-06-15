"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Gift } from "lucide-react"

const mockTransactions = [
  {
    id: "1",
    type: "bonus",
    asset: "BTC",
    amount: 0.002,
    status: "completed",
    createdAt: "2024-01-15T10:30:00Z",
    description: "Welcome bonus",
  },
  {
    id: "2",
    type: "deposit",
    asset: "USDT",
    amount: 1000,
    status: "pending",
    createdAt: "2024-01-14T15:45:00Z",
    description: "Bank transfer deposit",
  },
  {
    id: "3",
    type: "trade",
    asset: "BTC/USDT",
    amount: 0.001,
    status: "completed",
    createdAt: "2024-01-13T09:15:00Z",
    description: "Market buy order",
  },
]

export function TransactionHistoryFallback() {
  const getIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-green-400" />
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-red-400" />
      case "trade":
        return <RefreshCw className="h-4 w-4 text-blue-400" />
      case "bonus":
        return <Gift className="h-4 w-4 text-[#FFD700]" />
      default:
        return <RefreshCw className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-600 text-white">
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-orange-600 text-white">
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive" className="bg-red-600 text-white">
            Failed
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="bg-gray-600 text-white">
            {status}
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      <Card className="premium-card border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-[#FFD700]">Transaction History</CardTitle>
          <CardDescription className="text-white/70">
            View all your deposits, withdrawals, trades, and bonuses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-black/50 border border-[#FFD700]/20">
              <TabsTrigger
                value="all"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="deposits"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Deposits
              </TabsTrigger>
              <TabsTrigger
                value="withdrawals"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Withdrawals
              </TabsTrigger>
              <TabsTrigger
                value="trades"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Trades
              </TabsTrigger>
              <TabsTrigger
                value="bonuses"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Bonuses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {mockTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border border-[#FFD700]/20 rounded-lg bg-black/30"
                >
                  <div className="flex items-center space-x-4">
                    {getIcon(transaction.type)}
                    <div>
                      <div className="font-medium capitalize text-white">
                        {transaction.type} - {transaction.asset}
                      </div>
                      <div className="text-sm text-white/60">{transaction.description}</div>
                      <div className="text-xs text-white/50">{new Date(transaction.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-white">
                      {transaction.amount} {transaction.asset.split("/")[0]}
                    </div>
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="bonuses" className="space-y-4">
              {mockTransactions
                .filter((t) => t.type === "bonus")
                .map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-[#FFD700]/30 rounded-lg bg-gradient-to-r from-[#FFD700]/10 to-transparent"
                  >
                    <div className="flex items-center space-x-4">
                      <Gift className="h-4 w-4 text-[#FFD700]" />
                      <div>
                        <div className="font-medium text-[#FFD700]">{transaction.description}</div>
                        <div className="text-sm text-white/70">Welcome to GetBits!</div>
                        <div className="text-xs text-white/50">{new Date(transaction.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-[#FFD700]">
                        +{transaction.amount} {transaction.asset}
                      </div>
                      <Badge className="bg-[#FFD700] text-black">Bonus</Badge>
                    </div>
                  </div>
                ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
