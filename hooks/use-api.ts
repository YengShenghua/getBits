"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/components/providers/auth-provider"

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T>(endpoint: string, dependencies: any[] = []) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const { user } = useAuth()

  const fetchData = useCallback(async () => {
    if (!user) {
      setState({ data: null, loading: false, error: "Not authenticated" })
      return
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const response = await fetch(endpoint, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "An error occurred",
      })
    }
  }, [endpoint, user, ...dependencies])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { ...state, refetch: fetchData }
}

export function useWallets() {
  return useApi<{ wallets: any[] }>("/api/wallets")
}

export function useTransactions(filters: { type?: string; status?: string; page?: number } = {}) {
  const queryParams = new URLSearchParams()
  if (filters.type) queryParams.append("type", filters.type)
  if (filters.status) queryParams.append("status", filters.status)
  if (filters.page) queryParams.append("page", filters.page.toString())

  const endpoint = `/api/transactions?${queryParams.toString()}`
  return useApi<{ transactions: any[]; pagination: any }>(endpoint, [filters])
}

export function useMarketData() {
  return useApi<{ marketData: any[] }>("/api/market/data")
}
