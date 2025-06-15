"use client"

import { useState, useEffect } from "react"
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
import { ErrorBoundary } from "@/components/error-boundary"
import { usePerformanceMonitoring } from "@/hooks/use-performance"

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { isAdmin, user } = useAuth()
  const { startTimer } = usePerformanceMonitoring("Dashboard")

  useEffect(() => {
    if (user) {
      const timer = startTimer("dashboard-load")
      // Simulate dashboard load completion
      setTimeout(() => timer.end(), 100)
    }
  }, [user, startTimer])

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <ErrorBoundary>
            <div className="space-y-6">
              <WalletOverview />
              <MarketOverview />
            </div>
          </ErrorBoundary>
        )
      case "trading":
        return (
          <ErrorBoundary>
            <TradingInterface />
          </ErrorBoundary>
        )
      case "history":
        return (
          <ErrorBoundary>
            <TransactionHistory />
          </ErrorBoundary>
        )
      case "referrals":
        return (
          <ErrorBoundary>
            <ReferralCenter />
          </ErrorBoundary>
        )
      case "settings":
        return (
          <ErrorBoundary>
            <Settings />
          </ErrorBoundary>
        )
      case "admin":
        return isAdmin ? (
          <ErrorBoundary>
            <AdminDashboard />
          </ErrorBoundary>
        ) : (
          <div className="text-white">Access Denied</div>
        )
      case "transactions":
        return (
          <ErrorBoundary>
            <TransactionManagement />
          </ErrorBoundary>
        )
      default:
        return (
          <ErrorBoundary>
            <WalletOverview />
          </ErrorBoundary>
        )
    }
  }

  // If admin tab is selected, render full admin dashboard
  if (activeTab === "admin" && isAdmin) {
    return (
      <ErrorBoundary>
        <AdminDashboard />
      </ErrorBoundary>
    )
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
