import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get referrals made by this user
    const referrals = await prisma.user.findMany({
      where: {
        referredBy: user.referralCode,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        hasDeposited: true,
        referralBonus: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Calculate stats
    const totalReferrals = referrals.length
    const totalEarned = referrals.filter((r) => r.hasDeposited).reduce((sum, r) => sum + r.referralBonus, 0)
    const pendingEarnings = referrals.filter((r) => !r.hasDeposited).reduce((sum, r) => sum + 5, 0) // $5 per referral when they deposit

    // Format referrals for response
    const formattedReferrals = referrals.map((referral) => ({
      email: referral.email.replace(/(.{2}).*(@.*)/, "$1***$2"), // Mask email for privacy
      date: referral.createdAt.toISOString().split("T")[0],
      bonus: referral.hasDeposited ? referral.referralBonus : 5,
      status: referral.hasDeposited ? "earned" : "pending",
    }))

    return NextResponse.json({
      referrals: formattedReferrals,
      stats: {
        totalReferrals,
        totalEarned,
        pendingEarnings,
      },
    })
  } catch (error) {
    console.error("Get referrals error:", error)
    return NextResponse.json({ error: "Failed to fetch referrals" }, { status: 500 })
  }
}
