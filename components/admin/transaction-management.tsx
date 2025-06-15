"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Download,
  Clock,
  XCircle,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  CheckCircle,
  Flag,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock transaction data
const mockTransactions = [
  {
    id: "TXN001",
    user: "john.doe@example.com",
    type: "deposit",
    asset: "BTC",
    amount: 0.5,
    usdValue: 21625.0,
    status: "completed",
    timestamp: "2024-01-20 14:30:00",
    fee: 0.001,
    address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    riskScore: "low",
  },
  {
    id: "TXN002",
    user: "jane.smith@example.com",
    type: "withdrawal",
    asset: "ETH",
    amount: 10.0,
    usdValue: 26500.0,
    status: "pending",
    timestamp: "2024-01-20 15:45:00",
    fee: 0.01,
    address: "0x742d35Cc6634C0532925a3b8D4C0C8b3C2F6d",
    riskScore: "high",
  },
  {
    id: "TXN003",
    user: "mike.wilson@example.com",
    type: "trade",
    asset: "BTC/USDT",
    amount: 0.25,
    usdValue: 10812.5,
    status: "completed",
    timestamp: "2024-01-20 16:20:00",
    fee: 0.0005,
    address: "-",
    riskScore: "medium",
  },
  {
    id: "TXN004",
    user: "alice.johnson@example.com",
    type: "deposit",
    asset: "USDT",
    amount: 5000,
    usdValue: 5000,
    status: "processing",
    timestamp: "2024-01-20 17:10:00",
    fee: 0,
    address: "0x8Fc6d7F69B4C5CD8f9EB18A4F4809D1c67D4A6Ac",
    riskScore: "low",
  },
  {
    id: "TXN005",
    user: "bob.brown@example.com",
    type: "withdrawal",
    asset: "BTC",
    amount: 1.2,
    usdValue: 51900,
    status: "pending",
    timestamp: "2024-01-20 18:05:00",
    fee: 0.0005,
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    riskScore: "medium",
  },
  {
    id: "TXN006",
    user: "carol.white@example.com",
    type: "withdrawal",
    asset: "USD",
    amount: 10000,
    usdValue: 10000,
    status: "pending",
    timestamp: "2024-01-20 19:20:00",
    fee: 25,
    address: "Bank Transfer",
    riskScore: "high",
  },
]

export function TransactionManagement() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-green-400" />
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-red-400" />
      case "trade":
        return <RefreshCw className="h-4 w-4 text-blue-400" />
      default:
        return <RefreshCw className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600 text-white">Completed</Badge>
      case "pending":
        return <Badge className="bg-orange-600 text-white">Pending</Badge>
      case "processing":
        return <Badge className="bg-blue-600 text-white">Processing</Badge>
      case "failed":
        return <Badge className="bg-red-600 text-white">Failed</Badge>
      case "rejected":
        return <Badge className="bg-red-600 text-white">Rejected</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "low":
        return <Badge className="bg-green-600 text-white">Low</Badge>
      case "medium":
        return <Badge className="bg-orange-600 text-white">Medium</Badge>
      case "high":
        return <Badge className="bg-red-600 text-white">High</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const handleReviewTransaction = (transaction: any) => {
    setSelectedTransaction(transaction)
    setIsDialogOpen(true)
  }

  const handleApproveTransaction = () => {
    setIsApproving(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Transaction approved",
        description: `Transaction ${selectedTransaction.id} has been approved.`,
      })
      setIsApproving(false)
      setIsDialogOpen(false)
      // In a real app, you would update the transaction status in your database
    }, 1000)
  }

  const handleRejectClick = () => {
    setIsRejectionDialogOpen(true)
  }

  const handleRejectTransaction = () => {
    setIsRejecting(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Transaction rejected",
        description: `Transaction ${selectedTransaction.id} has been rejected.`,
        variant: "destructive",
      })
      setIsRejecting(false)
      setIsRejectionDialogOpen(false)
      setIsDialogOpen(false)
      setRejectionReason("")
      // In a real app, you would update the transaction status in your database
    }, 1000)
  }

  const handleFlagTransaction = () => {
    toast({
      title: "Transaction flagged",
      description: `Transaction ${selectedTransaction.id} has been flagged for further review.`,
    })
    setIsDialogOpen(false)
  }

  const filteredTransactions = mockTransactions.filter((transaction) => {
    // Apply search filter
    const matchesSearch =
      searchTerm === "" ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.address.toLowerCase().includes(searchTerm.toLowerCase())

    // Apply type filter
    const matchesType = typeFilter === "all" || transaction.type === typeFilter

    // Apply status filter
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const pendingWithdrawals = mockTransactions.filter((tx) => tx.type === "withdrawal" && tx.status === "pending")
  const pendingDeposits = mockTransactions.filter((tx) => tx.type === "deposit" && tx.status === "processing")
  const highRiskTransactions = mockTransactions.filter((tx) => tx.riskScore === "high")

  return (
    <div className="space-y-6">
      <Card className="premium-card border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-[#FFD700]">Transaction Management</CardTitle>
          <CardDescription className="text-white/70">Monitor and manage all platform transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all-transactions" className="w-full">
            <TabsList className="bg-black/50 border border-[#FFD700]/20">
              <TabsTrigger
                value="all-transactions"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                All Transactions
              </TabsTrigger>
              <TabsTrigger
                value="pending-withdrawals"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Pending Withdrawals
                <Badge className="ml-2 bg-orange-600 text-white">{pendingWithdrawals.length}</Badge>
              </TabsTrigger>
              <TabsTrigger
                value="pending-deposits"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Pending Deposits
                <Badge className="ml-2 bg-blue-600 text-white">{pendingDeposits.length}</Badge>
              </TabsTrigger>
              <TabsTrigger
                value="high-risk"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                High Risk
                <Badge className="ml-2 bg-red-600 text-white">{highRiskTransactions.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all-transactions" className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                    <Input
                      placeholder="Search by transaction ID, user, or address..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                    />
                  </div>
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px] bg-black/50 border-[#FFD700]/30 text-white">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-[#FFD700]/30">
                    <SelectItem value="all" className="text-white">
                      All Types
                    </SelectItem>
                    <SelectItem value="deposit" className="text-white">
                      Deposits
                    </SelectItem>
                    <SelectItem value="withdrawal" className="text-white">
                      Withdrawals
                    </SelectItem>
                    <SelectItem value="trade" className="text-white">
                      Trades
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px] bg-black/50 border-[#FFD700]/30 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-[#FFD700]/30">
                    <SelectItem value="all" className="text-white">
                      All Status
                    </SelectItem>
                    <SelectItem value="completed" className="text-white">
                      Completed
                    </SelectItem>
                    <SelectItem value="pending" className="text-white">
                      Pending
                    </SelectItem>
                    <SelectItem value="processing" className="text-white">
                      Processing
                    </SelectItem>
                    <SelectItem value="failed" className="text-white">
                      Failed
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button className="btn-dark-gold">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              {/* Transaction Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="premium-card border-[#FFD700]/20">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-white">$2.4M</div>
                    <div className="text-sm text-white/60">Daily Volume</div>
                  </CardContent>
                </Card>
                <Card className="premium-card border-[#FFD700]/20">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-orange-400">23</div>
                    <div className="text-sm text-white/60">Pending Review</div>
                  </CardContent>
                </Card>
                <Card className="premium-card border-[#FFD700]/20">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-red-400">5</div>
                    <div className="text-sm text-white/60">High Risk</div>
                  </CardContent>
                </Card>
                <Card className="premium-card border-[#FFD700]/20">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-400">98.5%</div>
                    <div className="text-sm text-white/60">Success Rate</div>
                  </CardContent>
                </Card>
              </div>

              {/* Transactions Table */}
              <div className="border border-[#FFD700]/20 rounded-lg overflow-hidden">
                <div className="bg-[#FFD700]/10 px-6 py-3 border-b border-[#FFD700]/20">
                  <div className="grid grid-cols-9 gap-4 text-sm font-medium text-white">
                    <span>ID</span>
                    <span>User</span>
                    <span>Type</span>
                    <span>Asset</span>
                    <span>Amount</span>
                    <span>USD Value</span>
                    <span>Status</span>
                    <span>Risk</span>
                    <span>Actions</span>
                  </div>
                </div>
                <div className="divide-y divide-[#FFD700]/10">
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="px-6 py-4 hover:bg-[#FFD700]/5">
                      <div className="grid grid-cols-9 gap-4 items-center">
                        <div className="font-mono text-sm text-[#FFD700]">{transaction.id}</div>
                        <div className="text-white text-sm">{transaction.user}</div>
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(transaction.type)}
                          <span className="text-white capitalize">{transaction.type}</span>
                        </div>
                        <div className="text-white">{transaction.asset}</div>
                        <div className="text-white">{transaction.amount}</div>
                        <div className="text-white">${transaction.usdValue.toLocaleString()}</div>
                        <div>{getStatusBadge(transaction.status)}</div>
                        <div>{getRiskBadge(transaction.riskScore)}</div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="btn-dark-gold"
                            onClick={() => handleReviewTransaction(transaction)}
                          >
                            Review
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pending-withdrawals" className="space-y-4">
              <div className="border border-[#FFD700]/20 rounded-lg overflow-hidden">
                <div className="bg-[#FFD700]/10 px-6 py-3 border-b border-[#FFD700]/20">
                  <div className="grid grid-cols-8 gap-4 text-sm font-medium text-white">
                    <span>ID</span>
                    <span>User</span>
                    <span>Asset</span>
                    <span>Amount</span>
                    <span>USD Value</span>
                    <span>Destination</span>
                    <span>Risk</span>
                    <span>Actions</span>
                  </div>
                </div>
                <div className="divide-y divide-[#FFD700]/10">
                  {pendingWithdrawals.map((transaction) => (
                    <div key={transaction.id} className="px-6 py-4 hover:bg-[#FFD700]/5">
                      <div className="grid grid-cols-8 gap-4 items-center">
                        <div className="font-mono text-sm text-[#FFD700]">{transaction.id}</div>
                        <div className="text-white text-sm">{transaction.user}</div>
                        <div className="text-white">{transaction.asset}</div>
                        <div className="text-white">{transaction.amount}</div>
                        <div className="text-white">${transaction.usdValue.toLocaleString()}</div>
                        <div className="text-white font-mono text-xs truncate">{transaction.address}</div>
                        <div>{getRiskBadge(transaction.riskScore)}</div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleReviewTransaction(transaction)}
                          >
                            Review
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pending-deposits" className="space-y-4">
              <div className="border border-[#FFD700]/20 rounded-lg overflow-hidden">
                <div className="bg-[#FFD700]/10 px-6 py-3 border-b border-[#FFD700]/20">
                  <div className="grid grid-cols-7 gap-4 text-sm font-medium text-white">
                    <span>ID</span>
                    <span>User</span>
                    <span>Asset</span>
                    <span>Amount</span>
                    <span>USD Value</span>
                    <span>Source</span>
                    <span>Actions</span>
                  </div>
                </div>
                <div className="divide-y divide-[#FFD700]/10">
                  {pendingDeposits.map((transaction) => (
                    <div key={transaction.id} className="px-6 py-4 hover:bg-[#FFD700]/5">
                      <div className="grid grid-cols-7 gap-4 items-center">
                        <div className="font-mono text-sm text-[#FFD700]">{transaction.id}</div>
                        <div className="text-white text-sm">{transaction.user}</div>
                        <div className="text-white">{transaction.asset}</div>
                        <div className="text-white">{transaction.amount}</div>
                        <div className="text-white">${transaction.usdValue.toLocaleString()}</div>
                        <div className="text-white font-mono text-xs truncate">{transaction.address}</div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleReviewTransaction(transaction)}
                          >
                            Verify
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="high-risk" className="space-y-4">
              <div className="border border-[#FFD700]/20 rounded-lg overflow-hidden">
                <div className="bg-[#FFD700]/10 px-6 py-3 border-b border-[#FFD700]/20">
                  <div className="grid grid-cols-8 gap-4 text-sm font-medium text-white">
                    <span>ID</span>
                    <span>User</span>
                    <span>Type</span>
                    <span>Asset</span>
                    <span>Amount</span>
                    <span>USD Value</span>
                    <span>Status</span>
                    <span>Actions</span>
                  </div>
                </div>
                <div className="divide-y divide-[#FFD700]/10">
                  {highRiskTransactions.map((transaction) => (
                    <div key={transaction.id} className="px-6 py-4 hover:bg-[#FFD700]/5 bg-red-900/10">
                      <div className="grid grid-cols-8 gap-4 items-center">
                        <div className="font-mono text-sm text-[#FFD700]">{transaction.id}</div>
                        <div className="text-white text-sm">{transaction.user}</div>
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(transaction.type)}
                          <span className="text-white capitalize">{transaction.type}</span>
                        </div>
                        <div className="text-white">{transaction.asset}</div>
                        <div className="text-white">{transaction.amount}</div>
                        <div className="text-white">${transaction.usdValue.toLocaleString()}</div>
                        <div>{getStatusBadge(transaction.status)}</div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleReviewTransaction(transaction)}
                          >
                            Investigate
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Transaction Review Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black border-[#FFD700]/30 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#FFD700]">Review Transaction</DialogTitle>
            <DialogDescription className="text-white/70">Review and take action on this transaction</DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-white/70">Transaction ID</div>
                  <div className="font-mono text-white">{selectedTransaction.id}</div>
                </div>
                <div>
                  <div className="text-sm text-white/70">User</div>
                  <div className="text-white">{selectedTransaction.user}</div>
                </div>
                <div>
                  <div className="text-sm text-white/70">Type</div>
                  <div className="text-white capitalize">{selectedTransaction.type}</div>
                </div>
                <div>
                  <div className="text-sm text-white/70">Asset</div>
                  <div className="text-white">{selectedTransaction.asset}</div>
                </div>
                <div>
                  <div className="text-sm text-white/70">Amount</div>
                  <div className="text-white">
                    {selectedTransaction.amount} {selectedTransaction.asset}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-white/70">USD Value</div>
                  <div className="text-white">${selectedTransaction.usdValue.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-white/70">Status</div>
                  <div>{getStatusBadge(selectedTransaction.status)}</div>
                </div>
                <div>
                  <div className="text-sm text-white/70">Risk Score</div>
                  <div>{getRiskBadge(selectedTransaction.riskScore)}</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-white/70">Address/Destination</div>
                <div className="font-mono text-white break-all">{selectedTransaction.address}</div>
              </div>

              <div>
                <div className="text-sm text-white/70">Timestamp</div>
                <div className="text-white">{selectedTransaction.timestamp}</div>
              </div>

              <div>
                <div className="text-sm text-white/70">Fee</div>
                <div className="text-white">
                  {selectedTransaction.fee} {selectedTransaction.asset}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex space-x-2">
            <Button variant="outline" className="btn-dark-gold" onClick={handleFlagTransaction}>
              <Flag className="h-4 w-4 mr-2" />
              Flag
            </Button>
            <Button variant="destructive" onClick={handleRejectClick} disabled={isRejecting}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleApproveTransaction}
              disabled={isApproving}
            >
              {isApproving ? <Clock className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Reason Dialog */}
      <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
        <DialogContent className="bg-black border-[#FFD700]/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400">Reject Transaction</DialogTitle>
            <DialogDescription className="text-white/70">
              Please provide a reason for rejecting this transaction
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-reason" className="text-white">
                Rejection Reason
              </Label>
              <Input
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" className="btn-dark-gold" onClick={() => setIsRejectionDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectTransaction} disabled={isRejecting || !rejectionReason}>
              {isRejecting ? <Clock className="h-4 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
              Reject Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
