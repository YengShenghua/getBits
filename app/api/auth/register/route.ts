import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Generate referral code
    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase()

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        referralCode,
        signupBonus: 0.002, // 0.002 BTC signup bonus
      },
    })

    // Create initial wallets
    const assets = ["BTC", "ETH", "USDT", "USD"]
    await Promise.all(
      assets.map((asset) =>
        prisma.wallet.create({
          data: {
            userId: user.id,
            asset,
            balance: asset === "BTC" ? 0.002 : 0, // Signup bonus
          },
        }),
      ),
    )

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email })

    // Create response
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    })

    // Set cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
