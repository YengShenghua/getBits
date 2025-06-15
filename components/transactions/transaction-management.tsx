"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DepositInterface } from "@/components/transactions/deposit-interface"
import { WithdrawalInterface } from "@/components/transactions/withdrawal-interface"
import { TransactionHistory } from "@/components/dashboard/transaction-history"

export function TransactionManagement() {
  const [activeTab, setActiveTab] = useState("deposit")

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value)
  }, [])

  return (
    <div className="space-y-6">
      <Card className="premium-card border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-[#FFD700]">Funds Management</CardTitle>
          <CardDescription className="text-white/70">Deposit, withdraw, and track your transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-black/50 border border-[#FFD700]/20 mb-6">
              <TabsTrigger
                value="deposit"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Deposit
              </TabsTrigger>
              <TabsTrigger
                value="withdraw"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                Withdraw
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black"
              >
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="deposit">
              <DepositInterface />
            </TabsContent>

            <TabsContent value="withdraw">
              <WithdrawalInterface />
            </TabsContent>

            <TabsContent value="history">
              <TransactionHistory />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
