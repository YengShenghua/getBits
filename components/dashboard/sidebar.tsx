"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/providers/auth-provider"
import {
  LayoutDashboard,
  TrendingUp,
  History,
  Users,
  Settings,
  LogOut,
  Bitcoin,
  Shield,
  CreditCard,
} from "lucide-react"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { logout, isAdmin } = useAuth()

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "trading", label: "Trading", icon: TrendingUp },
    { id: "history", label: "History", icon: History },
    { id: "referrals", label: "Referrals", icon: Users },
    { id: "transactions", label: "Transactions", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  // Add admin option if user is admin
  if (isAdmin) {
    menuItems.push({
      id: "admin",
      label: "Admin Panel",
      icon: Shield,
    })
  }

  return (
    <div className="w-64 bg-black border-r border-[#FFD700]/20 h-screen flex flex-col">
      <div className="p-6 border-b border-[#FFD700]/20">
        <div className="flex items-center space-x-2">
          <Bitcoin className="h-8 w-8 text-[#FFD700]" />
          <span className="text-xl font-bold text-white">
            Get<span className="text-[#FFD700]">Bits</span>
          </span>
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
              {item.id === "admin" && <Badge className="ml-auto bg-red-600 text-white text-xs">ADMIN</Badge>}
            </Button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[#FFD700]/20">
        <Button
          variant="outline"
          className="w-full justify-start text-white/80 border-[#FFD700]/30 hover:bg-[#FFD700]/10 hover:text-white hover:border-[#FFD700]"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}
