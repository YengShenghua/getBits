"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Transaction {
  id: string
  type: string
  asset: string
  amount: number
  status: string
  description?: string
  createdAt: string
  updatedAt: string
  toAddress?: string
  fromAddress?: string
  txHash?: string
  fee?: number
}

interface TransactionDetailsModalProps {
  transaction: Transaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TransactionDetailsModal({ transaction, open, onOpenChange }: TransactionDetailsModalProps) {
  const { toast } = useToast()

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  if (!transaction) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Status</span>
            <Badge variant={getStatusColor(transaction.status)}>{transaction.status}</Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Type</span>
            <span className="text-sm">{transaction.type}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Asset</span>
            <span className="text-sm font-mono">{transaction.asset}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Amount</span>
            <span className="text-sm font-mono">
              {transaction.amount.toFixed(8)} {transaction.asset}
            </span>
          </div>

          {transaction.fee && transaction.fee > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Fee</span>
              <span className="text-sm font-mono">
                {transaction.fee.toFixed(8)} {transaction.asset}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Created</span>
            <span className="text-sm">{formatDate(transaction.createdAt)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Updated</span>
            <span className="text-sm">{formatDate(transaction.updatedAt)}</span>
          </div>

          {transaction.description && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Description</span>
              <p className="text-sm text-muted-foreground">{transaction.description}</p>
            </div>
          )}

          {transaction.toAddress && (
            <div className="space-y-2">
              <span className="text-sm font-medium">To Address</span>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">{transaction.toAddress}</code>
                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(transaction.toAddress!, "Address")}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {transaction.txHash && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Transaction Hash</span>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">{transaction.txHash}</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(transaction.txHash!, "Transaction hash")}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <span className="text-sm font-medium">Transaction ID</span>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">{transaction.id}</code>
              <Button size="sm" variant="ghost" onClick={() => copyToClipboard(transaction.id, "Transaction ID")}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
