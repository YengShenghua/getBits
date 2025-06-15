"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/providers/auth-provider"
import { Copy, Users, DollarSign, Share2, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Referral {
  email: string
  date: string
  bonus: number
  status: "earned" | "pending"
}

interface ReferralStats {
  totalReferrals: number
  totalEarned: number
  pendingEarnings: number
}

export function ReferralCenter() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    totalEarned: 0,
    pendingEarnings: 0,
  })
  const [loading, setLoading] = useState(true)

  const referralLink = `${window.location.origin}/signup?ref=${user?.referralCode}`

  const fetchReferrals = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/referrals")
      const data = await response.json()

      if (response.ok) {
        setReferrals(data.referrals || [])
        setStats(data.stats || { totalReferrals: 0, totalEarned: 0, pendingEarnings: 0 })
      } else {
        console.error("Failed to fetch referrals:", data.error)
      }
    } catch (error) {
      console.error("Error fetching referrals:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchReferrals()
    }
  }, [user])

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    })
  }

  const shareReferralLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join GetBits Crypto Exchange",
          text: "Get 0.002 BTC bonus when you sign up!",
          url: referralLink,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      copyReferralLink()
    }
  }

  return (
    <div className="space-y-6">
      {/* Referral Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="premium-card border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-[#FFD700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#FFD700]">{stats.totalReferrals}</div>
            <p className="text-xs text-white/60">Active referrals</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Earned</CardTitle>
            <DollarSign className="h-4 w-4 text-[#FFD700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#FFD700]">${stats.totalEarned}</div>
            <p className="text-xs text-white/60">In referral bonuses</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Pending</CardTitle>
            <DollarSign className="h-4 w-4 text-[#FFD700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">${stats.pendingEarnings}</div>
            <p className="text-xs text-white/60">Awaiting deposit</p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link */}
      <Card className="premium-card border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-[#FFD700]">Your Referral Link</CardTitle>
          <CardDescription className="text-white/70">
            Share this link and earn $5 for each successful referral
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={referralLink}
              readOnly
              className="font-mono text-sm bg-black/50 border-[#FFD700]/30 text-white"
            />
            <Button onClick={copyReferralLink} className="btn-dark-gold">
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button onClick={shareReferralLink} className="flex-1 btn-gold">
              <Share2 className="h-4 w-4 mr-2" />
              Share Link
            </Button>
            <Button className="flex-1 btn-dark-gold">Generate QR Code</Button>
          </div>

          <div className="p-4 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-lg">
            <h4 className="font-medium text-[#FFD700] mb-2">How it works:</h4>
            <ul className="text-sm text-white/70 space-y-1">
              <li>• Share your unique referral link</li>
              <li>• Friend signs up and gets 0.002 BTC bonus</li>
              <li>• You earn $5 when they make their first deposit</li>
              <li>• Bonuses unlock after your first deposit</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Referral History */}
      <Card className="premium-card border-[#FFD700]/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#FFD700]">Referral History</CardTitle>
              <CardDescription className="text-white/70">Track your referral earnings</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchReferrals}
              disabled={loading}
              className="text-[#FFD700] hover:bg-[#FFD700]/10"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-white/60">Loading referrals...</div>
            ) : referrals.length === 0 ? (
              <div className="text-center py-8 text-white/60">No referrals yet. Share your link to start earning!</div>
            ) : (
              referrals.map((referral, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-[#FFD700]/20 rounded-lg bg-black/30"
                >
                  <div>
                    <div className="font-medium text-white">{referral.email}</div>
                    <div className="text-sm text-white/60">Joined on {referral.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-white">${referral.bonus}</div>
                    <Badge
                      variant={referral.status === "earned" ? "default" : "secondary"}
                      className={referral.status === "earned" ? "bg-green-600 text-white" : "bg-orange-600 text-white"}
                    >
                      {referral.status === "earned" ? "Earned" : "Pending"}
                    </Badge>
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
