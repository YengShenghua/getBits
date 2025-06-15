import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        referralCode: user.referralCode,
        kycStatus: user.kycStatus,
        isVerified: user.isVerified,
        signupBonus: user.signupBonus,
        referralBonus: user.referralBonus,
        hasDeposited: user.hasDeposited,
        hasTraded: user.hasTraded,
        wallets: user.wallets,
      },
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
