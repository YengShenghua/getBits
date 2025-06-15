"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/providers/auth-provider"
import { useWallets } from "@/hooks/use-api"
import { ArrowUpRight, ArrowDownLeft, Gift, Lock, Loader2 } from "lucide-react"
import { useState } from "react"

export function WalletOverview() {
  const { user } = useAuth()
  const { data: walletsData, loading: walletsLoading, error: walletsError } = useWallets()
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const wallets = walletsData?.wallets || []
  const totalBalance = wallets.reduce((sum: number, wallet: any) => {
    return sum + wallet.balance * (wallet.usdPrice || 0)
  }, 0)

  const canWithdraw = user?.hasDeposited && user?.hasTraded

  const handleDeposit = async () => {
    setActionLoading("deposit")
    // Navigate to deposit interface or open modal
    setTimeout(() => setActionLoading(null), 1000)
  }

  const handleWithdraw = async () => {
    if (!canWithdraw) return
    setActionLoading("withdraw")
    // Navigate to withdraw interface or open modal
    setTimeout(() => setActionLoading(null), 1000)
  }

  if (walletsLoading) {
    return (
      <div className="space-y-6">
        <Card className="premium-card border-[#FFD700]/20">
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#FFD700]" />
            <span className="ml-2 text-white">Loading wallet data...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (walletsError) {
    return (
      <div className="space-y-6">
        <Card className="premium-card border-red-500/20">
          <CardContent className="p-8">
            <div className="text-center text-red-400">Error loading wallet data: {walletsError}</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Total Balance */}
      <Card className="premium-card border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-[#FFD700]">Total Balance</CardTitle>
          <CardDescription className="text-white/70">Your portfolio overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">${totalBalance.toFixed(2)}</div>
          <p className="text-sm text-white/60 mt-1">≈ {(totalBalance / 43250).toFixed(8)} BTC</p>

          <div className="flex space-x-2 mt-4">
            <Button className="btn-gold" onClick={handleDeposit} disabled={actionLoading === "deposit"}>
              {actionLoading === "deposit" ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ArrowDownLeft className="h-4 w-4 mr-2" />
              )}
              Deposit
            </Button>
            <Button
              variant="outline"
              disabled={!canWithdraw || actionLoading === "withdraw"}
              className="btn-dark-gold"
              onClick={handleWithdraw}
            >
              {actionLoading === "withdraw" ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ArrowUpRight className="h-4 w-4 mr-2" />
              )}
              Withdraw
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bonus Section */}
      {user?.signupBonus && user.signupBonus > 0 && (
        <Card className="premium-card border-[#FFD700]/30 bg-gradient-to-r from-[#FFD700]/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center text-[#FFD700]">
              <Gift className="h-5 w-5 mr-2" />
              Welcome Bonus
            </CardTitle>
            <CardDescription className="text-white/70">Congratulations! You've received a signup bonus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-[#FFD700]">{user.signupBonus} BTC</div>
                <p className="text-sm text-white/60">≈ ${(user.signupBonus * 43250).toFixed(2)}</p>
              </div>
              {!canWithdraw && (
                <Badge variant="secondary" className="flex items-center bg-orange-600 text-white">
                  <Lock className="h-3 w-3 mr-1" />
                  Locked
                </Badge>
              )}
            </div>
            {!canWithdraw && (
              <p className="text-xs text-white/60 mt-2">Complete your first deposit and trade to unlock withdrawal</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Coin Balances */}
      <Card className="premium-card border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-[#FFD700]">Your Assets</CardTitle>
          <CardDescription className="text-white/70">Cryptocurrency balances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {wallets.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                No assets found. Make your first deposit to get started!
              </div>
            ) : (
              wallets.map((wallet: any) => (
                <div
                  key={wallet.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-[#FFD700]/10 bg-black/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#FFD700] to-[#FFD700]/80 rounded-full flex items-center justify-center text-black font-bold text-xs">
                      {wallet.asset.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-white">{wallet.asset}</div>
                      <div className="text-sm text-white/60">{wallet.locked > 0 && `${wallet.locked} locked`}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-white">
                      {wallet.balance.toFixed(8)} {wallet.asset}
                    </div>
                    <div className="text-sm text-white/60">${(wallet.balance * (wallet.usdPrice || 0)).toFixed(2)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
