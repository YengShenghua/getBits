"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/providers/auth-provider"
import { Bell, Shield, CheckCircle, AlertCircle } from "lucide-react"

export function Header() {
  const { user } = useAuth()

  return (
    <header className="bg-black border-b border-[#FFD700]/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back!</h1>
          <p className="text-white/70">{user?.email}</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* KYC Status */}
          <div className="flex items-center space-x-2">
            {user?.kycStatus === "approved" ? (
              <Badge variant="default" className="bg-green-600 text-white border-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                KYC Verified
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-orange-600 text-white border-orange-500">
                <AlertCircle className="h-3 w-3 mr-1" />
                KYC Pending
              </Badge>
            )}
          </div>

          {/* Security Level */}
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-[#FFD700]" />
            <span className="text-sm text-white/70">Security: High</span>
          </div>

          {/* Notifications */}
          <Button
            variant="outline"
            size="icon"
            className="border-[#FFD700]/30 text-white hover:bg-[#FFD700]/10 hover:border-[#FFD700]"
          >
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
