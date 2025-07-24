"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { TransactionDetailsModal } from "@/components/transactions/transaction-details-modal"
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"

interface Transaction {
  id: string
  type: "DEPOSIT" | "WITHDRAWAL" | "TRADE"
  amount: number
  currency: string
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED"
  createdAt: string
  updatedAt: string
  description?: string
  toAddress?: string
  fromAddress?: string
  fee?: number
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return "Invalid Date"
  }
}

function formatCurrency(amount: number, currency: string): string {
  try {
    return (
      new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 8,
      }).format(amount) +
      " " +
      currency
    )
  } catch {
    return `${amount} ${currency}`
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "PENDING":
      return <Clock className="h-4 w-4 text-yellow-500" />
    case "FAILED":
      return <XCircle className="h-4 w-4 text-red-500" />
    case "CANCELLED":
      return <AlertCircle className="h-4 w-4 text-gray-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
  }
}

function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "COMPLETED":
      return "default"
    case "PENDING":
      return "secondary"
    case "FAILED":
      return "destructive"
    case "CANCELLED":
      return "outline"
    default:
      return "secondary"
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case "DEPOSIT":
      return <ArrowDownLeft className="h-4 w-4 text-green-500" />
    case "WITHDRAWAL":
      return <ArrowUpRight className="h-4 w-4 text-red-500" />
    case "TRADE":
      return <ArrowUpRight className="h-4 w-4 text-blue-500" />
    default:
      return <ArrowUpRight className="h-4 w-4 text-gray-500" />
  }
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filter !== "all") params.append("type", filter)
      if (statusFilter !== "all") params.append("status", statusFilter)

      const response = await fetch(`/api/transactions?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setTransactions(data.transactions || [])
      } else {
        throw new Error(data.error || "Failed to fetch transactions")
      }
    } catch (err) {
      console.error("Error fetching transactions:", err)
      setError(err instanceof Error ? err.message : "Failed to load transactions")
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchTransactions()
    setRefreshing(false)
  }

  useEffect(() => {
    fetchTransactions()
  }, [filter, statusFilter])

  if (loading && transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[80px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction History</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              </Button>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposits</SelectItem>
                  <SelectItem value="withdrawal">Withdrawals</SelectItem>
                  <SelectItem value="trade">Trades</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchTransactions} variant="outline">
                Try Again
              </Button>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No transactions found</p>
              <p className="text-sm text-muted-foreground mt-2">
                {filter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Your transactions will appear here once you make a deposit or withdrawal"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(transaction.type)}
                          <span className="capitalize">{transaction.type.toLowerCase()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{formatCurrency(transaction.amount, transaction.currency)}</div>
                        {transaction.fee && transaction.fee > 0 && (
                          <div className="text-sm text-muted-foreground">
                            Fee: {formatCurrency(transaction.fee, transaction.currency)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(transaction.status)}
                          <Badge variant={getStatusBadgeVariant(transaction.status)}>{transaction.status}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(transaction.createdAt)}</div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedTransaction(transaction)}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          open={!!selectedTransaction}
          onOpenChange={(open) => !open && setSelectedTransaction(null)}
        />
      )}
    </>
  )
}

// Named export for compatibility
export { TransactionHistory }
