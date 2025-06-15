"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Shield,
  BarChart3,
  Settings,
  LogOut,
  Bitcoin,
  AlertTriangle,
} from "lucide-react"

interface AdminSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users, badge: "1,247" },
    { id: "transactions", label: "Transactions", icon: CreditCard, badge: "23" },
    { id: "kyc", label: "KYC Verification", icon: Shield, badge: "15", alert: true },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "security", label: "Security", icon: AlertTriangle, badge: "3", alert: true },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="w-64 bg-black border-r border-[#FFD700]/20 h-screen flex flex-col">
      <div className="p-6 border-b border-[#FFD700]/20">
        <div className="flex items-center space-x-2">
          <Bitcoin className="h-8 w-8 text-[#FFD700]" />
          <div>
            <span className="text-xl font-bold text-white">
              Get<span className="text-[#FFD700]">Bits</span>
            </span>
            <div className="text-xs text-[#FFD700] font-medium">ADMIN PANEL</div>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={`w-full justify-start transition-all duration-200 relative ${
                activeTab === item.id
                  ? "bg-[#FFD700] text-black hover:bg-[#FFD700]/90"
                  : "text-white/80 hover:text-white hover:bg-white/5 border-transparent"
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {item.label}
              {item.badge && (
                <Badge
                  variant="secondary"
                  className={`ml-auto text-xs ${
                    item.alert
                      ? "bg-red-600 text-white"
                      : activeTab === item.id
                        ? "bg-black/20 text-black"
                        : "bg-[#FFD700]/20 text-[#FFD700]"
                  }`}
                >
                  {item.badge}
                </Badge>
              )}
            </Button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[#FFD700]/20">
        <Button
          variant="outline"
          className="w-full justify-start text-white/80 border-[#FFD700]/30 hover:bg-[#FFD700]/10 hover:text-white hover:border-[#FFD700]"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}
