"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminOverview } from "@/components/admin/admin-overview"
import { UserManagement } from "@/components/admin/user-management"
import { TransactionManagement } from "@/components/admin/transaction-management"
import { KYCManagement } from "@/components/admin/kyc-management"
import { SystemSettings } from "@/components/admin/system-settings"
import { Analytics } from "@/components/admin/analytics"
import { SecurityCenter } from "@/components/admin/security-center"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverview />
      case "users":
        return <UserManagement />
      case "transactions":
        return <TransactionManagement />
      case "kyc":
        return <KYCManagement />
      case "analytics":
        return <Analytics />
      case "security":
        return <SecurityCenter />
      case "settings":
        return <SystemSettings />
      default:
        return <AdminOverview />
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="flex">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1">
          <AdminHeader />
          <main className="p-6">{renderContent()}</main>
        </div>
      </div>
    </div>
  )
}
