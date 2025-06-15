"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  phone?: string
  isVerified: boolean
  kycStatus: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED"
  referralCode: string
  signupBonus: number
  referralBonus: number
  hasDeposited: boolean
  hasTraded: boolean
  role: "USER" | "ADMIN" | "SUPER_ADMIN"
  firstName?: string
  lastName?: string
  wallets?: Array<{
    id: string
    asset: string
    balance: number
    locked: number
    address?: string
  }>
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    referralCode?: string,
  ) => Promise<void>
  logout: () => void
  isLoading: boolean
  isAdmin: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Failed to refresh user:", error)
      setUser(null)
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      await refreshUser()
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Login failed")
    }

    setUser(data.user)
  }

  const signup = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    referralCode?: string,
  ) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password, firstName, lastName, referralCode }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Signup failed")
    }

    setUser(data.user)
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
    }
  }

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isLoading,
        isAdmin,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
