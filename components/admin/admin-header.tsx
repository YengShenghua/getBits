"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Shield, AlertTriangle, Activity } from "lucide-react"

export function AdminHeader() {
  return (
    <header className="bg-black border-b border-[#FFD700]/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-white/70">Manage GetBits Exchange Platform</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* System Status */}
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-green-400" />
            <span className="text-sm text-white/70">System Online</span>
            <Badge variant="default" className="bg-green-600 text-white">
              99.9%
            </Badge>
          </div>

          {/* Security Alerts */}
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span className="text-sm text-white/70">3 Alerts</span>
          </div>

          {/* Notifications */}
          <Button
            variant="outline"
            size="icon"
            className="border-[#FFD700]/30 text-white hover:bg-[#FFD700]/10 hover:border-[#FFD700] relative"
          >
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full p-0 flex items-center justify-center">
              5
            </Badge>
          </Button>

          {/* Admin Profile */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center">
              <Shield className="h-4 w-4 text-black" />
            </div>
            <div className="text-sm">
              <div className="text-white font-medium">Admin User</div>
              <div className="text-white/60">Super Admin</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
