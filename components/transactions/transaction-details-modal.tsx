"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, ExternalLink, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Transaction {
  id: string
  type: "DEPOSIT" | "WITHDRAWAL" | "TRADE"
  amount: number
  currency: string
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED"
  createdAt: string
  updatedAt: string
  description?: string
  txHash?: string
  fromAddress?: string
  toAddress?: string
  fee?: number
}

interface TransactionDetailsModalProps {
  transaction: Transaction
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

function formatCurrency(amount: number, currency: string): string {
  return (
    new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(amount) +
    " " +
    currency
  )
}

function getStatusIcon(status: string) {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case "PENDING":
      return <Clock className="h-5 w-5 text-yellow-500" />
    case "FAILED":
      return <XCircle className="h-5 w-5 text-red-500" />
    case "CANCELLED":
      return <AlertCircle className="h-5 w-5 text-gray-500" />
    default:
      return <Clock className="h-5 w-5 text-gray-500" />
  }
}

function getStatusBadgeVariant(status: string) {
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
      return <ArrowDownLeft className="h-5 w-5 text-green-500" />
    case "WITHDRAWAL":
      return <ArrowUpRight className="h-5 w-5 text-red-500" />
    case "TRADE":
      return <ArrowUpRight className="h-5 w-5 text-blue-500" />
    default:
      return <ArrowUpRight className="h-5 w-5 text-gray-500" />
  }
}

export function TransactionDetailsModal({ transaction, open, onOpenChange }: TransactionDetailsModalProps) {
  const { toast } = useToast()

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: `${label} has been copied to your clipboard.`,
    })
  }

  const openBlockExplorer = (txHash: string) => {
    // This would open the transaction in a blockchain explorer
    // For demo purposes, we'll just show a toast
    toast({
      title: "Opening Block Explorer",
      description: "This would open the transaction in a blockchain explorer.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTypeIcon(transaction.type)}
            Transaction Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Type */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(transaction.status)}
              <Badge variant={getStatusBadgeVariant(transaction.status)}>{transaction.status}</Badge>
            </div>
            <Badge variant="outline" className="capitalize">
              {transaction.type.toLowerCase()}
            </Badge>
          </div>

          {/* Amount */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{formatCurrency(transaction.amount, transaction.currency)}</div>
                {transaction.fee && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Fee: {formatCurrency(transaction.fee, transaction.currency)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Transaction Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Transaction ID</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-sm bg-muted px-2 py-1 rounded flex-1 truncate">{transaction.id}</code>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(transaction.id, "Transaction ID")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Currency</label>
              <div className="mt-1 font-medium">{transaction.currency}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <div className="mt-1 text-sm">{formatDate(transaction.createdAt)}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
              <div className="mt-1 text-sm">{formatDate(transaction.updatedAt)}</div>
            </div>
          </div>

          {/* Blockchain Details */}
          {(transaction.txHash || transaction.fromAddress || transaction.toAddress) && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-4">Blockchain Details</h3>
                <div className="space-y-3">
                  {transaction.txHash && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Transaction Hash</label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-sm bg-muted px-2 py-1 rounded flex-1 truncate">{transaction.txHash}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(transaction.txHash!, "Transaction Hash")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openBlockExplorer(transaction.txHash!)}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {transaction.fromAddress && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">From Address</label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-sm bg-muted px-2 py-1 rounded flex-1 truncate">
                          {transaction.fromAddress}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(transaction.fromAddress!, "From Address")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {transaction.toAddress && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">To Address</label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-sm bg-muted px-2 py-1 rounded flex-1 truncate">
                          {transaction.toAddress}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(transaction.toAddress!, "To Address")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {transaction.description && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <div className="mt-1 text-sm">{transaction.description}</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
