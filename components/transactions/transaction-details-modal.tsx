"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Transaction {
  id: string
  type: string
  asset: string
  amount: number
  status: string
  description: string
  toAddress?: string
  fromAddress?: string
  txHash?: string
  metadata?: string
  createdAt: string
  updatedAt: string
}

interface TransactionDetailsModalProps {
  transaction: Transaction | null
  isOpen: boolean
  onClose: () => void
}

export function TransactionDetailsModal({ transaction, isOpen, onClose }: TransactionDetailsModalProps) {
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  if (!transaction) return null

  const metadata = transaction.metadata ? JSON.parse(transaction.metadata) : {}

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Address copied successfully",
    })
  }

  const handleAddNotes = async () => {
    if (!notes.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/transactions/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: transaction.id,
          action: "add_notes",
          notes: notes.trim(),
        }),
      })

      if (!response.ok) throw new Error("Failed to add notes")

      toast({
        title: "Notes added",
        description: "Your notes have been saved successfully",
      })
      setNotes("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add notes",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "FAILED":
        return "bg-red-100 text-red-800"
      case "CANCELLED":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Type</label>
              <p className="text-lg font-semibold capitalize">{transaction.type.toLowerCase()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Asset</label>
              <p className="text-lg font-semibold">{transaction.asset}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Amount</label>
              <p className="text-lg font-semibold">
                {transaction.amount} {transaction.asset}
              </p>
            </div>
          </div>

          {/* Addresses */}
          {transaction.toAddress && (
            <div>
              <label className="text-sm font-medium text-gray-500">To Address</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">{transaction.toAddress}</code>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(transaction.toAddress!)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Transaction Hash */}
          {transaction.txHash && (
            <div>
              <label className="text-sm font-medium text-gray-500">Transaction Hash</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">{transaction.txHash}</code>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(transaction.txHash!)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Metadata */}
          {metadata.network && (
            <div>
              <label className="text-sm font-medium text-gray-500">Network</label>
              <p className="text-sm">{metadata.network}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Created</label>
              <p className="text-sm">{new Date(transaction.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Updated</label>
              <p className="text-sm">{new Date(transaction.updatedAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Add Notes */}
          <div>
            <label className="text-sm font-medium text-gray-500">Add Notes</label>
            <div className="mt-2 space-y-2">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes about this transaction..."
                rows={3}
              />
              <Button onClick={handleAddNotes} disabled={!notes.trim() || isSubmitting} size="sm">
                {isSubmitting ? "Adding..." : "Add Notes"}
              </Button>
            </div>
          </div>

          {/* User Actions History */}
          {metadata.userActions && metadata.userActions.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-500">Notes History</label>
              <div className="mt-2 space-y-2">
                {metadata.userActions.map((action: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <p className="text-sm">{action.notes}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(action.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
