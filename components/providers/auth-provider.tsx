"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  phone?: string
  isVerified: boolean
  kycStatus: "pending" | "approved" | "rejected"
  referralCode: string
  signupBonus: number
  referralBonus: number
  hasDeposited: boolean
  hasTraded: boolean
  role: "user" | "admin" | "super_admin" // Added role field
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, phone?: string, referralCode?: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  isAdmin: boolean // Added admin check
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("getbits-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Mock login - check for admin credentials
    const isAdminLogin = email === "admin@getbits.com" && password === "admin123"

    const mockUser: User = {
      id: isAdminLogin ? "admin-1" : "1",
      email,
      isVerified: true,
      kycStatus: "approved",
      referralCode: "GB" + Math.random().toString(36).substr(2, 8).toUpperCase(),
      signupBonus: isAdminLogin ? 0 : 0.002,
      referralBonus: 0,
      hasDeposited: isAdminLogin ? true : false,
      hasTraded: isAdminLogin ? true : false,
      role: isAdminLogin ? "super_admin" : "user",
    }
    setUser(mockUser)
    localStorage.setItem("getbits-user", JSON.stringify(mockUser))
  }

  const signup = async (email: string, password: string, phone?: string, referralCode?: string) => {
    // Mock signup with bonus
    const mockUser: User = {
      id: Math.random().toString(),
      email,
      phone,
      isVerified: false,
      kycStatus: "pending",
      referralCode: "GB" + Math.random().toString(36).substr(2, 8).toUpperCase(),
      signupBonus: 0.002, // 0.002 BTC signup bonus
      referralBonus: 0,
      hasDeposited: false,
      hasTraded: false,
      role: "user",
    }
    setUser(mockUser)
    localStorage.setItem("getbits-user", JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("getbits-user")
  }

  const isAdmin = user?.role === "admin" || user?.role === "super_admin"

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, isAdmin }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
