"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Gift, Loader2 } from "lucide-react"
import { useTransactions } from "@/hooks/use-api"
import { useState } from "react"

export function TransactionHistory() {
  const [activeTab, setActiveTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const {
    data: transactionResponse,
    loading,
    error,
    refetch,
  } = useTransactions({
    type: activeTab === "all" ? undefined : activeTab,
    page: currentPage,
  })

  const transactions = transactionResponse?.transactions || []
  const pagination = transactionResponse?.pagination

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
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
    switch (status.toLowerCase()) {
      case "completed":
      case "success":
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
      case "rejected":
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

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setCurrentPage(1)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const formatAmount = (amount: number, asset: string) => {
    if (asset.includes("/")) {
      return `${amount} ${asset.split("/")[0]}`
    }
    return `${amount} ${asset}`
  }

  return (
    <div className="space-y-6">
      <Card className="premium-card border-[#FFD700]/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-[#FFD700]">Transaction History</CardTitle>
            <CardDescription className="text-white/70">
              View all your deposits, withdrawals, trades, and bonuses
            </CardDescription>
          </div>
          <Button onClick={refetch} variant="ghost" size="sm" className="text-[#FFD700] hover:bg-[#FFD700]/10">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="bg-black/50 border border-[#FFD700]/20">
              <TabsTrigger
                value="all"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="deposit"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Deposits
              </TabsTrigger>
              <TabsTrigger
                value="withdrawal"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Withdrawals
              </TabsTrigger>
              <TabsTrigger
                value="trade"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Trades
              </TabsTrigger>
              <TabsTrigger
                value="bonus"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Bonuses
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-[#FFD700]" />
                  <span className="ml-2 text-white">Loading transactions...</span>
                </div>
              ) : error ? (
                <div className="text-center p-8">
                  <p className="text-red-400 mb-4">Error loading transactions: {error}</p>
                  <Button onClick={refetch} variant="outline" className="btn-dark-gold">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8 text-white/60">No transactions found for this category.</div>
              ) : (
                <>
                  {transactions.map((transaction: any) => (
                    <div
                      key={transaction.id}
                      className={`flex items-center justify-between p-4 rounded-lg bg-black/30 border ${
                        transaction.type === "bonus"
                          ? "border-[#FFD700]/30 bg-gradient-to-r from-[#FFD700]/10 to-transparent"
                          : "border-[#FFD700]/20"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        {getIcon(transaction.type)}
                        <div>
                          <div
                            className={`font-medium capitalize ${transaction.type === "bonus" ? "text-[#FFD700]" : "text-white"}`}
                          >
                            {transaction.type} - {transaction.asset}
                          </div>
                          <div className="text-sm text-white/60">
                            {transaction.description || `${transaction.type} transaction`}
                          </div>
                          <div className="text-xs text-white/50">{formatDate(transaction.createdAt)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-medium ${transaction.type === "bonus" ? "text-[#FFD700]" : "text-white"}`}
                        >
                          {transaction.type === "bonus" ? "+" : ""}
                          {formatAmount(transaction.amount, transaction.asset)}
                        </div>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  ))}

                  {/* Pagination */}
                  {pagination && pagination.pages > 1 && (
                    <div className="flex items-center justify-between pt-4">
                      <div className="text-sm text-white/60">
                        Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          variant="outline"
                          size="sm"
                          className="btn-dark-gold"
                        >
                          Previous
                        </Button>
                        <Button
                          onClick={() => setCurrentPage((prev) => Math.min(pagination.pages, prev + 1))}
                          disabled={currentPage === pagination.pages}
                          variant="outline"
                          size="sm"
                          className="btn-dark-gold"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
