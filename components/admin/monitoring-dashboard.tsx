"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, Clock, RefreshCw, Activity, Database, Globe } from "lucide-react"
import { usePerformanceMonitoring } from "@/hooks/use-performance"

interface HealthCheck {
  service: string
  status: "healthy" | "unhealthy" | "degraded"
  responseTime?: number
  error?: string
  timestamp: string
}

interface SystemHealth {
  status: "healthy" | "degraded" | "unhealthy"
  checks: HealthCheck[]
  timestamp: string
}

export function MonitoringDashboard() {
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const { startTimer } = usePerformanceMonitoring("MonitoringDashboard")

  const fetchHealth = async () => {
    const timer = startTimer("fetchHealth")
    setLoading(true)

    try {
      const response = await fetch("/api/health")
      const data = await response.json()
      setHealth(data)
      setLastUpdate(new Date())
    } catch (error) {
      console.error("Failed to fetch health data:", error)
    } finally {
      setLoading(false)
      timer.end()
    }
  }

  useEffect(() => {
    fetchHealth()

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "degraded":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "unhealthy":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      healthy: "default",
      degraded: "secondary",
      unhealthy: "destructive",
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status.toUpperCase()}</Badge>
  }

  const getServiceIcon = (service: string) => {
    switch (service) {
      case "database":
        return <Database className="h-4 w-4" />
      case "memory":
        return <Activity className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  if (loading && !health) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">System Monitoring</h2>
          <Button disabled>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Monitoring</h2>
          <p className="text-muted-foreground">Real-time application health and performance monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdate && (
            <span className="text-sm text-muted-foreground">Last updated: {lastUpdate.toLocaleTimeString()}</span>
          )}
          <Button onClick={fetchHealth} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {health && (
        <>
          {/* Overall Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(health.status)}
                Overall System Status
              </CardTitle>
              <CardDescription>Current system health: {getStatusBadge(health.status)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {health.status === "healthy"
                  ? "All Systems Operational"
                  : health.status === "degraded"
                    ? "Some Services Degraded"
                    : "System Issues Detected"}
              </div>
            </CardContent>
          </Card>

          {/* Service Details */}
          <Tabs defaultValue="services" className="space-y-4">
            <TabsList>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="errors">Error Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {health.checks.map((check) => (
                  <Card key={check.service}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-base">
                        <div className="flex items-center gap-2">
                          {getServiceIcon(check.service)}
                          {check.service.charAt(0).toUpperCase() + check.service.slice(1)}
                        </div>
                        {getStatusIcon(check.status)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Status</span>
                        {getStatusBadge(check.status)}
                      </div>

                      {check.responseTime && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Response Time</span>
                          <span className="text-sm font-mono">{check.responseTime.toFixed(0)}ms</span>
                        </div>
                      )}

                      {check.error && (
                        <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-600">{check.error}</div>
                      )}

                      <div className="text-xs text-muted-foreground">
                        Last checked: {new Date(check.timestamp).toLocaleTimeString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>System performance and resource utilization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {health.checks
                      .filter((check) => check.responseTime)
                      .map((check) => (
                        <div key={check.service} className="flex items-center justify-between">
                          <span className="font-medium">{check.service}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  check.responseTime! < 500
                                    ? "bg-green-500"
                                    : check.responseTime! < 1000
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                                style={{
                                  width: `${Math.min((check.responseTime! / 2000) * 100, 100)}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-mono w-16 text-right">
                              {check.responseTime!.toFixed(0)}ms
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="errors" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Errors</CardTitle>
                  <CardDescription>System errors and issues requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {health.checks
                      .filter((check) => check.status === "unhealthy" || check.error)
                      .map((check) => (
                        <div key={check.service} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-red-600">{check.service} Error</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(check.timestamp).toLocaleString()}
                            </span>
                          </div>
                          {check.error && <p className="text-sm text-gray-600">{check.error}</p>}
                        </div>
                      ))}

                    {health.checks.every((check) => check.status !== "unhealthy" && !check.error) && (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle className="mx-auto h-8 w-8 mb-2" />
                        No recent errors detected
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
