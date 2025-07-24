"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Copy, ExternalLink, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Transaction {
  id: string
  type: "DEPOSIT" | "WITHDRAWAL" | "TRADE"
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED"
  amount: number
  currency: string
  createdAt: string
  updatedAt: string
  hash?: string
  fromAddress?: string
  toAddress?: string
  fee?: number
  metadata?: any
  description?: string
}

interface TransactionDetailsModalProps {
  transaction: Transaction
  open: boolean
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
}

export function TransactionDetailsModal({ transaction, open, onOpenChange, onClose }: TransactionDetailsModalProps) {
  const { toast } = useToast()
  const [copying, setCopying] = useState<string | null>(null)

  const handleCopy = async (text: string, label: string) => {
    try {
      setCopying(label)
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    } finally {
      setTimeout(() => setCopying(null), 1000)
    }
  }

  const getStatusIcon = (status: string) => {
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

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatAmount = (amount: number, currency: string) => {
    return `${amount.toFixed(8)} ${currency}`
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else if (onOpenChange) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Transaction Details
            {getStatusIcon(transaction.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Transaction ID</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm bg-muted px-2 py-1 rounded">{transaction.id}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(transaction.id, "Transaction ID")}
                      disabled={copying === "Transaction ID"}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <div className="mt-1">
                    <Badge variant="outline">{transaction.type}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge variant={getStatusBadgeVariant(transaction.status)}>{transaction.status}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Amount</label>
                  <div className="mt-1 font-mono text-lg">{formatAmount(transaction.amount, transaction.currency)}</div>
                </div>
              </div>

              {transaction.fee && transaction.fee > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fee</label>
                  <div className="mt-1 font-mono">{formatAmount(transaction.fee, transaction.currency)}</div>
                </div>
              )}

              {transaction.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <div className="mt-1 text-sm">{transaction.description}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Addresses */}
          {(transaction.fromAddress || transaction.toAddress) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Addresses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {transaction.fromAddress && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">From Address</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-sm bg-muted px-2 py-1 rounded flex-1 break-all">
                        {transaction.fromAddress}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(transaction.fromAddress!, "From Address")}
                        disabled={copying === "From Address"}
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
                      <code className="text-sm bg-muted px-2 py-1 rounded flex-1 break-all">
                        {transaction.toAddress}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(transaction.toAddress!, "To Address")}
                        disabled={copying === "To Address"}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Transaction Hash */}
          {transaction.hash && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Blockchain Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Transaction Hash</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm bg-muted px-2 py-1 rounded flex-1 break-all">{transaction.hash}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(transaction.hash!, "Transaction Hash")}
                      disabled={copying === "Transaction Hash"}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={`https://blockchair.com/bitcoin/transaction/${transaction.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <div className="mt-1 text-sm">{formatDate(transaction.createdAt)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <div className="mt-1 text-sm">{formatDate(transaction.updatedAt)}</div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          {transaction.metadata && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                  {JSON.stringify(transaction.metadata, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>

        <Separator />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
