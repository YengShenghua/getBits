"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { WalletOverview } from "@/components/dashboard/wallet-overview"
import { MarketOverview } from "@/components/dashboard/market-overview"
import { TradingInterface } from "@/components/trading/trading-interface"
import { TransactionHistory } from "@/components/dashboard/transaction-history"
import { Settings } from "@/components/dashboard/settings"
import { ReferralCenter } from "@/components/dashboard/referral-center"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { useAuth } from "@/components/providers/auth-provider"
import { TransactionManagement } from "@/components/transactions/transaction-management"

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { isAdmin } = useAuth()

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <WalletOverview />
            <MarketOverview />
          </div>
        )
      case "trading":
        return <TradingInterface />
      case "history":
        return <TransactionHistory />
      case "referrals":
        return <ReferralCenter />
      case "settings":
        return <Settings />
      case "admin":
        return isAdmin ? <AdminDashboard /> : <div className="text-white">Access Denied</div>
      case "transactions":
        return <TransactionManagement />
      default:
        return <WalletOverview />
    }
  }

  // If admin tab is selected, render full admin dashboard
  if (activeTab === "admin" && isAdmin) {
    return <AdminDashboard />
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1">
          <Header />
          <main className="p-6">{renderContent()}</main>
        </div>
      </div>
    </div>
  )
}
