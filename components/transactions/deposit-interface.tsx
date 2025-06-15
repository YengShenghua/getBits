"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowDownLeft, Copy, CreditCard, Landmark, QrCode, RefreshCw } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { TransactionStatus } from "@/components/transactions/transaction-status"

export function DepositInterface() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [depositAmount, setDepositAmount] = useState("")
  const [selectedCrypto, setSelectedCrypto] = useState("BTC")
  const [selectedFiat, setSelectedFiat] = useState("USD")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [depositStep, setDepositStep] = useState(1)
  const [transactionId, setTransactionId] = useState("")

  // Mock wallet addresses for crypto deposits
  const walletAddresses = {
    BTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    ETH: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    USDT: "0x8Fc6d7F69B4C5CD8f9EB18A4F4809D1c67D4A6Ac",
    BNB: "bnb1jxfh2g85q3v0tdq56fnevx6xcxtcnhtsmcu64m",
  }

  const handleDeposit = async () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Generate a random transaction ID
      const txId = "TX" + Math.random().toString(36).substring(2, 10).toUpperCase()
      setTransactionId(txId)

      // Move to next step
      setDepositStep(2)

      // For bank transfers and cards, show pending status
      if (paymentMethod === "bank" || paymentMethod === "card") {
        toast({
          title: "Deposit initiated",
          description: `Your deposit of ${depositAmount} ${selectedFiat} is being processed.`,
        })
      } else {
        // For crypto, show waiting for confirmation
        toast({
          title: "Awaiting deposit",
          description: `Please send ${depositAmount} ${selectedCrypto} to the provided address.`,
        })
      }

      setIsLoading(false)
    }, 1500)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Address has been copied to your clipboard.",
    })
  }

  const resetDeposit = () => {
    setDepositStep(1)
    setDepositAmount("")
    setTransactionId("")
  }

  const renderDepositMethod = () => {
    switch (paymentMethod) {
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
            <div className="space-y-2">
              <Label htmlFor="crypto-amount" className="text-white">
                Amount ({selectedCrypto})
              </Label>
              <Input
                id="crypto-amount"
                type="number"
                step="0.00000001"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder={`Enter ${selectedCrypto} amount`}
                className="bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
              />
            </div>
          </div>
        )
      case "card":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fiat-currency" className="text-white">
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
            <div className="space-y-2">
              <Label htmlFor="card-amount" className="text-white">
                Amount ({selectedFiat})
              </Label>
              <Input
                id="card-amount"
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder={`Enter ${selectedFiat} amount`}
                className="bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-number" className="text-white">
                Card Number
              </Label>
              <Input
                id="card-number"
                placeholder="•••• •••• •••• ••••"
                className="bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry" className="text-white">
                  Expiry Date
                </Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  className="bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc" className="text-white">
                  CVC
                </Label>
                <Input
                  id="cvc"
                  placeholder="•••"
                  className="bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                />
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
            <div className="space-y-2">
              <Label htmlFor="bank-amount" className="text-white">
                Amount ({selectedFiat})
              </Label>
              <Input
                id="bank-amount"
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder={`Enter ${selectedFiat} amount`}
                className="bg-black/50 border-[#FFD700]/30 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
              />
            </div>
            <div className="p-4 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-lg">
              <h4 className="font-medium text-[#FFD700] mb-2">Bank Transfer Details:</h4>
              <ul className="text-sm text-white/70 space-y-1">
                <li>Bank Name: GetBits Financial</li>
                <li>Account Name: GetBits Ltd</li>
                <li>Account Number: 1234567890</li>
                <li>Routing Number: 987654321</li>
                <li>Reference: {user?.id}</li>
              </ul>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const renderDepositConfirmation = () => {
    if (paymentMethod === "crypto") {
      return (
        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-block p-4 bg-[#FFD700]/10 rounded-full mb-4">
              <QrCode className="h-12 w-12 text-[#FFD700]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Send {selectedCrypto} to this address</h3>
            <p className="text-white/70 mb-4">
              Please send exactly {depositAmount} {selectedCrypto}
            </p>
          </div>

          <div className="p-4 bg-black/50 border border-[#FFD700]/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="font-mono text-sm text-white break-all">
                {walletAddresses[selectedCrypto as keyof typeof walletAddresses]}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10"
                onClick={() => copyToClipboard(walletAddresses[selectedCrypto as keyof typeof walletAddresses])}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <TransactionStatus status="waiting" />
            <p className="text-sm text-white/60 text-center">
              Your deposit will be credited after {selectedCrypto === "BTC" ? "2" : "12"} network confirmations
            </p>
          </div>

          <div className="pt-4 border-t border-[#FFD700]/10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Transaction ID:</span>
              <span className="text-white font-mono">{transactionId}</span>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-block p-4 bg-[#FFD700]/10 rounded-full mb-4">
              {paymentMethod === "card" ? (
                <CreditCard className="h-12 w-12 text-[#FFD700]" />
              ) : (
                <Landmark className="h-12 w-12 text-[#FFD700]" />
              )}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Deposit Initiated</h3>
            <p className="text-white/70 mb-4">
              Your deposit of {depositAmount} {selectedFiat} is being processed
            </p>
          </div>

          <div className="space-y-2">
            <TransactionStatus status="processing" />
            <p className="text-sm text-white/60 text-center">
              {paymentMethod === "card"
                ? "Card deposits are typically processed within 10-30 minutes"
                : "Bank transfers may take 1-3 business days to process"}
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
                {depositAmount} {selectedFiat}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-white/70">Method:</span>
              <span className="text-white capitalize">{paymentMethod}</span>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <Card className="premium-card border-[#FFD700]/20">
      <CardHeader>
        <CardTitle className="text-[#FFD700] flex items-center">
          <ArrowDownLeft className="h-5 w-5 mr-2" />
          Deposit Funds
        </CardTitle>
        <CardDescription className="text-white/70">Add funds to your GetBits account</CardDescription>
      </CardHeader>
      <CardContent>
        {depositStep === 1 ? (
          <>
            <Tabs defaultValue="crypto" className="w-full" onValueChange={(value) => setPaymentMethod(value)}>
              <TabsList className="grid w-full grid-cols-3 bg-black/50 border border-[#FFD700]/20 mb-6">
                <TabsTrigger
                  value="crypto"
                  className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
                >
                  Crypto
                </TabsTrigger>
                <TabsTrigger
                  value="card"
                  className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
                >
                  Credit Card
                </TabsTrigger>
                <TabsTrigger
                  value="bank"
                  className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
                >
                  Bank Transfer
                </TabsTrigger>
              </TabsList>

              <TabsContent value="crypto" className="space-y-4">
                {renderDepositMethod()}
              </TabsContent>

              <TabsContent value="card" className="space-y-4">
                {renderDepositMethod()}
              </TabsContent>

              <TabsContent value="bank" className="space-y-4">
                {renderDepositMethod()}
              </TabsContent>
            </Tabs>

            <Button className="w-full btn-gold mt-6" onClick={handleDeposit} disabled={isLoading || !depositAmount}>
              {isLoading ? "Processing..." : "Deposit Funds"}
            </Button>
          </>
        ) : (
          <>
            {renderDepositConfirmation()}

            <Button variant="outline" className="w-full btn-dark-gold mt-6" onClick={resetDeposit}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Make Another Deposit
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
