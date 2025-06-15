"use client"

import { useState, useEffect, useCallback, useRef } from "react"
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
  const abortControllerRef = useRef<AbortController | null>(null)

  // Stabilize dependencies to prevent infinite re-renders
  const stableDeps = useRef(dependencies)
  const depsChanged = JSON.stringify(dependencies) !== JSON.stringify(stableDeps.current)

  if (depsChanged) {
    stableDeps.current = dependencies
  }

  const fetchData = useCallback(async () => {
    if (!user) {
      setState({ data: null, loading: false, error: "Not authenticated" })
      return
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const response = await fetch(endpoint, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setState({ data, loading: false, error: null })
    } catch (error) {
      // Don't update state if request was aborted
      if (error instanceof Error && error.name === "AbortError") {
        return
      }

      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "An error occurred",
      })
    }
  }, [endpoint, user]) // Remove dependencies from here

  useEffect(() => {
    fetchData()

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchData, depsChanged]) // Use depsChanged flag instead of dependencies array

  return { ...state, refetch: fetchData }
}

export function useWallets() {
  return useApi<{ wallets: any[] }>("/api/wallets")
}

export function useTransactions(filters: { type?: string; status?: string; page?: number } = {}) {
  // Create stable query string
  const queryString = useCallback(() => {
    const queryParams = new URLSearchParams()
    if (filters.type && filters.type !== "all") queryParams.append("type", filters.type)
    if (filters.status) queryParams.append("status", filters.status)
    if (filters.page) queryParams.append("page", filters.page.toString())
    return queryParams.toString()
  }, [filters.type, filters.status, filters.page])

  const endpoint = `/api/transactions${queryString() ? `?${queryString()}` : ""}`

  return useApi<{ transactions: any[]; pagination: any }>(endpoint, [filters.type, filters.status, filters.page])
}

export function useMarketData() {
  return useApi<{ marketData: any[] }>("/api/market/data")
}
