"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/providers/auth-provider"
import { Copy, Users, DollarSign, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const mockReferrals = [
  { email: "user1@example.com", date: "2024-01-10", bonus: 5, status: "earned" },
  { email: "user2@example.com", date: "2024-01-08", bonus: 5, status: "pending" },
  { email: "user3@example.com", date: "2024-01-05", bonus: 5, status: "earned" },
]

export function ReferralCenter() {
  const { user } = useAuth()
  const { toast } = useToast()

  const referralLink = `https://getbits.com/signup?ref=${user?.referralCode}`
  const totalEarned = mockReferrals.filter((r) => r.status === "earned").reduce((sum, r) => sum + r.bonus, 0)
  const pendingEarnings = mockReferrals.filter((r) => r.status === "pending").reduce((sum, r) => sum + r.bonus, 0)

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    })
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
            <div className="text-2xl font-bold text-[#FFD700]">{mockReferrals.length}</div>
            <p className="text-xs text-white/60">Active referrals</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Earned</CardTitle>
            <DollarSign className="h-4 w-4 text-[#FFD700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#FFD700]">${totalEarned}</div>
            <p className="text-xs text-white/60">In referral bonuses</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Pending</CardTitle>
            <DollarSign className="h-4 w-4 text-[#FFD700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">${pendingEarnings}</div>
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
            <Button className="flex-1 btn-gold">
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
          <CardTitle className="text-[#FFD700]">Referral History</CardTitle>
          <CardDescription className="text-white/70">Track your referral earnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockReferrals.map((referral, index) => (
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
