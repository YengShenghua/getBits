"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/providers/auth-provider"
import { ArrowUpRight, ArrowDownLeft, Gift, Lock } from "lucide-react"

const mockBalances = [
  { symbol: "BTC", name: "Bitcoin", balance: 0.002, usdValue: 86.5, change: "+2.4%" },
  { symbol: "ETH", name: "Ethereum", balance: 0, usdValue: 0, change: "+1.8%" },
  { symbol: "USDT", name: "Tether", balance: 0, usdValue: 0, change: "0.0%" },
  { symbol: "BNB", name: "BNB", balance: 0, usdValue: 0, change: "+3.2%" },
]

export function WalletOverview() {
  const { user } = useAuth()

  const totalBalance = mockBalances.reduce((sum, coin) => sum + coin.usdValue, 0)
  const canWithdraw = user?.hasDeposited && user?.hasTraded

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
            <Button className="btn-gold">
              <ArrowDownLeft className="h-4 w-4 mr-2" />
              Deposit
            </Button>
            <Button variant="outline" disabled={!canWithdraw} className="btn-dark-gold">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bonus Section */}
      {user?.signupBonus && (
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
            {mockBalances.map((coin) => (
              <div
                key={coin.symbol}
                className="flex items-center justify-between p-3 rounded-lg border border-[#FFD700]/10 bg-black/50"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#FFD700] to-[#FFD700]/80 rounded-full flex items-center justify-center text-black font-bold text-xs">
                    {coin.symbol.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-white">{coin.name}</div>
                    <div className="text-sm text-white/60">{coin.symbol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-white">
                    {coin.balance} {coin.symbol}
                  </div>
                  <div className="text-sm text-white/60">${coin.usdValue.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
