"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowUpRight, RefreshCw, Shield } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { TransactionStatus } from "@/components/transactions/transaction-status"

export function WithdrawalInterface() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [withdrawalAmount, setWithdrawalAmount] = useState("")
  const [selectedCrypto, setSelectedCrypto] = useState("BTC")
  const [selectedFiat, setSelectedFiat] = useState("USD")
  const [withdrawalMethod, setWithdrawalMethod] = useState("crypto")
  const [withdrawalStep, setWithdrawalStep] = useState(1)
  const [transactionId, setTransactionId] = useState("")
  const [withdrawalAddress, setWithdrawalAddress] = useState("")
  const [bankDetails, setBankDetails] = useState({
    accountName: "",
    accountNumber: "",
    routingNumber: "",
    bankName: "",
  })

  // Mock balances
  const balances = {
    BTC: 0.002,
    ETH: 0.05,
    USDT: 100,
    BNB: 0.1,
    USD: 500,
    EUR: 450,
    GBP: 400,
  }

  const handleWithdrawal = async () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Generate a random transaction ID
      const txId = "WD" + Math.random().toString(36).substring(2, 10).toUpperCase()
      setTransactionId(txId)

      // Move to next step
      setWithdrawalStep(2)

      toast({
        title: "Withdrawal request submitted",
        description: `Your withdrawal request has been submitted for review.`,
      })

      setIsLoading(false)
    }, 1500)
  }

  const resetWithdrawal = () => {
    setWithdrawalStep(1)
    setWithdrawalAmount("")
    setTransactionId("")
    setWithdrawalAddress("")
    setBankDetails({
      accountName: "",
      accountNumber: "",
      routingNumber: "",
      bankName: "",
    })
  }

  const renderWithdrawalMethod = () => {
    switch (withdrawalMethod) {
      case "crypto":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="crypto-currency" className="text-white">
                Select Cryptocurrency
              </Label>
              <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                <SelectTrigger className="bg-black/50 border-[#FFD700]/30 text-white">
                  <SelectValue placeholder="Select cryptocurrency" />
                </SelectTrigger>
                <SelectContent className="bg-black border-[#FFD700]/30">
                  <SelectItem value="BTC" className="text-white">
                    Bitcoin (BTC)
                  </SelectItem>
                  <SelectItem value="ETH" className="text-white">
                    Ethereum (ETH)
                  </SelectItem>
                  <SelectItem value="USDT" className="text-white">
                    Tether (USDT)
                  </SelectItem>
                  <SelectItem value="BNB" className="text-white">
                    BNB
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Available Balance:</span>
              <span className="text-sm text-white">
                {balances[selectedCrypto as keyof typeof balances]} {selectedCrypto}
              </span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="crypto-amount" className="text-white">
                Amount ({selectedCrypto})
              </Label>
              <Input
                id="crypto-amount"
                type="number"
                step="0.00000001"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                placeholder={`Enter ${selectedCrypto} amount`}
                className="bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="withdrawal-address" className="text-white">
                {selectedCrypto} Withdrawal Address
              </Label>
              <Input
                id="withdrawal-address"
                value={withdrawalAddress}
                onChange={(e) => setWithdrawalAddress(e.target.value)}
                placeholder={`Enter your ${selectedCrypto} address`}
                className="bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
              />
            </div>
            <div className="p-4 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-[#FFD700] mt-0.5" />
                <div>
                  <h4 className="font-medium text-[#FFD700] mb-1">Security Notice</h4>
                  <p className="text-xs text-white/70">
                    Always double-check the withdrawal address. Transactions cannot be reversed once processed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      case "bank":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bank-currency" className="text-white">
                Select Currency
              </Label>
              <Select value={selectedFiat} onValueChange={setSelectedFiat}>
                <SelectTrigger className="bg-black/50 border-[#FFD700]/30 text-white">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-black border-[#FFD700]/30">
                  <SelectItem value="USD" className="text-white">
                    US Dollar (USD)
                  </SelectItem>
                  <SelectItem value="EUR" className="text-white">
                    Euro (EUR)
                  </SelectItem>
                  <SelectItem value="GBP" className="text-white">
                    British Pound (GBP)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Available Balance:</span>
              <span className="text-sm text-white">
                {balances[selectedFiat as keyof typeof balances]} {selectedFiat}
              </span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank-amount" className="text-white">
                Amount ({selectedFiat})
              </Label>
              <Input
                id="bank-amount"
                type="number"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                placeholder={`Enter ${selectedFiat} amount`}
                className="bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank-name" className="text-white">
                Bank Name
              </Label>
              <Input
                id="bank-name"
                value={bankDetails.bankName}
                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                placeholder="Enter bank name"
                className="bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-name" className="text-white">
                Account Holder Name
              </Label>
              <Input
                id="account-name"
                value={bankDetails.accountName}
                onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                placeholder="Enter account holder name"
                className="bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="account-number" className="text-white">
                  Account Number
                </Label>
                <Input
                  id="account-number"
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                  placeholder="Enter account number"
                  className="bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="routing-number" className="text-white">
                  Routing Number
                </Label>
                <Input
                  id="routing-number"
                  value={bankDetails.routingNumber}
                  onChange={(e) => setBankDetails({ ...bankDetails, routingNumber: e.target.value })}
                  placeholder="Enter routing number"
                  className="bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                />
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const renderWithdrawalConfirmation = () => {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="inline-block p-4 bg-[#FFD700]/10 rounded-full mb-4">
            <Shield className="h-12 w-12 text-[#FFD700]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Withdrawal Request Submitted</h3>
          <p className="text-white/70 mb-4">Your withdrawal request is now pending approval</p>
        </div>

        <div className="space-y-2">
          <TransactionStatus status="pending" />
          <p className="text-sm text-white/60 text-center">
            {withdrawalMethod === "crypto"
              ? "Crypto withdrawals are typically processed within 1-2 hours after approval"
              : "Bank withdrawals may take 1-3 business days to process after approval"}
          </p>
        </div>

        <div className="pt-4 border-t border-[#FFD700]/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Transaction ID:</span>
            <span className="text-white font-mono">{transactionId}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-white/70">Amount:</span>
            <span className="text-white">
              {withdrawalAmount} {withdrawalMethod === "crypto" ? selectedCrypto : selectedFiat}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-white/70">Method:</span>
            <span className="text-white capitalize">{withdrawalMethod}</span>
          </div>
          {withdrawalMethod === "crypto" && (
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-white/70">Address:</span>
              <span className="text-white font-mono text-xs truncate max-w-[200px]">{withdrawalAddress}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card className="premium-card border-[#FFD700]/20">
      <CardHeader>
        <CardTitle className="text-[#FFD700] flex items-center">
          <ArrowUpRight className="h-5 w-5 mr-2" />
          Withdraw Funds
        </CardTitle>
        <CardDescription className="text-white/70">Withdraw funds from your GetBits account</CardDescription>
      </CardHeader>
      <CardContent>
        {withdrawalStep === 1 ? (
          <>
            <Tabs defaultValue="crypto" className="w-full" onValueChange={(value) => setWithdrawalMethod(value)}>
              <TabsList className="grid w-full grid-cols-2 bg-black/50 border border-[#FFD700]/20 mb-6">
                <TabsTrigger
                  value="crypto"
                  className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
                >
                  Crypto
                </TabsTrigger>
                <TabsTrigger
                  value="bank"
                  className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
                >
                  Bank Transfer
                </TabsTrigger>
              </TabsList>

              <TabsContent value="crypto" className="space-y-4">
                {renderWithdrawalMethod()}
              </TabsContent>

              <TabsContent value="bank" className="space-y-4">
                {renderWithdrawalMethod()}
              </TabsContent>
            </Tabs>

            <Button
              className="w-full btn-gold mt-6"
              onClick={handleWithdrawal}
              disabled={isLoading || !withdrawalAmount || (withdrawalMethod === "crypto" && !withdrawalAddress)}
            >
              {isLoading ? "Processing..." : "Request Withdrawal"}
            </Button>
          </>
        ) : (
          <>
            {renderWithdrawalConfirmation()}

            <Button variant="outline" className="w-full btn-dark-gold mt-6" onClick={resetWithdrawal}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Make Another Withdrawal
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
