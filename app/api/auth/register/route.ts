import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword, generateReferralCode } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, phone, referralCode } = await request.json()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Generate unique referral code
    let newReferralCode = generateReferralCode()
    while (await prisma.user.findUnique({ where: { referralCode: newReferralCode } })) {
      newReferralCode = generateReferralCode()
    }

    // Find referrer if referral code provided
    let referredBy = null
    if (referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode },
      })
      if (referrer) {
        referredBy = referrer.id
      }
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        phone,
        referralCode: newReferralCode,
        referredBy,
        signupBonus: 0.002, // 0.002 BTC signup bonus
      },
    })

    // Create default wallets
    const defaultAssets = ["BTC", "ETH", "USDT", "BNB", "USD", "EUR", "GBP"]
    await Promise.all(
      defaultAssets.map((asset) =>
        prisma.wallet.create({
          data: {
            userId: user.id,
            asset,
            balance: asset === "BTC" ? 0.002 : 0, // Signup bonus
          },
        }),
      ),
    )

    // Add referral bonus if referred
    if (referredBy) {
      await prisma.referralEarning.create({
        data: {
          userId: referredBy,
          referredId: user.id,
          amount: 0.001, // 0.001 BTC referral bonus
          type: "signup",
        },
      })

      // Update referrer's wallet
      await prisma.wallet.updateMany({
        where: { userId: referredBy, asset: "BTC" },
        data: { balance: { increment: 0.001 } },
      })
    }

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: "User created successfully",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
