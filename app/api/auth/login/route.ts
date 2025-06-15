import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyPassword, generateToken } from "@/lib/auth"
import { withErrorHandling, createAPIError } from "@/lib/api-error-handler"
import { log } from "@/lib/logger"

async function loginHandler(request: NextRequest) {
  const { email, password } = await request.json()

  if (!email || !password) {
    throw createAPIError("Email and password are required", 400, "MISSING_CREDENTIALS")
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  })

  if (!user) {
    // Log failed login attempt
    log.security("Failed login attempt - user not found", {
      email,
      ip: request.headers.get("x-forwarded-for"),
      userAgent: request.headers.get("user-agent"),
    })

    throw createAPIError("Invalid credentials", 401, "INVALID_CREDENTIALS")
  }

  // Verify password
  const isValidPassword = await verifyPassword(password, user.password)
  if (!isValidPassword) {
    // Log failed login attempt
    log.security("Failed login attempt - invalid password", {
      userId: user.id,
      email,
      ip: request.headers.get("x-forwarded-for"),
      userAgent: request.headers.get("user-agent"),
    })

    throw createAPIError("Invalid credentials", 401, "INVALID_CREDENTIALS")
  }

  // Generate token
  const token = generateToken({ userId: user.id, email: user.email })

  // Log successful login
  log.security("Successful login", {
    userId: user.id,
    email,
    ip: request.headers.get("x-forwarded-for"),
    userAgent: request.headers.get("user-agent"),
  })

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
}

export const POST = withErrorHandling(loginHandler, "auth/login")
