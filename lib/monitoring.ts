import * as Sentry from "@sentry/nextjs"
import { log } from "./logger"

export interface HealthCheck {
  service: string
  status: "healthy" | "unhealthy" | "degraded"
  responseTime?: number
  error?: string
  timestamp: Date
}

export class ApplicationMonitor {
  private healthChecks: Map<string, HealthCheck> = new Map()

  // Database health check
  async checkDatabase(): Promise<HealthCheck> {
    const start = Date.now()

    try {
      const { prisma } = await import("./prisma")
      await prisma.$queryRaw`SELECT 1`

      const responseTime = Date.now() - start
      const healthCheck: HealthCheck = {
        service: "database",
        status: responseTime < 1000 ? "healthy" : "degraded",
        responseTime,
        timestamp: new Date(),
      }

      this.healthChecks.set("database", healthCheck)

      if (healthCheck.status !== "healthy") {
        log.warn(`Database performance degraded: ${responseTime}ms`, { responseTime })
      }

      return healthCheck
    } catch (error) {
      const healthCheck: HealthCheck = {
        service: "database",
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date(),
      }

      this.healthChecks.set("database", healthCheck)
      log.error("Database health check failed", error as Error)

      return healthCheck
    }
  }

  // External API health check (for crypto prices, etc.)
  async checkExternalAPIs(): Promise<HealthCheck[]> {
    const apis = [
      { name: "coinapi", url: "https://rest.coinapi.io/v1/exchangerate/BTC/USD" },
      { name: "coingecko", url: "https://api.coingecko.com/api/v3/ping" },
    ]

    const results: HealthCheck[] = []

    for (const api of apis) {
      const start = Date.now()

      try {
        const response = await fetch(api.url, {
          method: "GET",
          timeout: 5000,
        })

        const responseTime = Date.now() - start
        const healthCheck: HealthCheck = {
          service: api.name,
          status: response.ok ? "healthy" : "unhealthy",
          responseTime,
          timestamp: new Date(),
        }

        if (!response.ok) {
          healthCheck.error = `HTTP ${response.status}`
        }

        this.healthChecks.set(api.name, healthCheck)
        results.push(healthCheck)
      } catch (error) {
        const healthCheck: HealthCheck = {
          service: api.name,
          status: "unhealthy",
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date(),
        }

        this.healthChecks.set(api.name, healthCheck)
        results.push(healthCheck)

        log.error(`External API ${api.name} health check failed`, error as Error)
      }
    }

    return results
  }

  // Memory usage monitoring
  getMemoryUsage(): HealthCheck {
    const usage = process.memoryUsage()
    const totalMB = Math.round(usage.heapTotal / 1024 / 1024)
    const usedMB = Math.round(usage.heapUsed / 1024 / 1024)
    const usagePercent = (usedMB / totalMB) * 100

    const healthCheck: HealthCheck = {
      service: "memory",
      status: usagePercent < 80 ? "healthy" : usagePercent < 95 ? "degraded" : "unhealthy",
      timestamp: new Date(),
    }

    if (healthCheck.status !== "healthy") {
      log.warn(`High memory usage: ${usagePercent.toFixed(2)}%`, {
        totalMB,
        usedMB,
        usagePercent,
      })
    }

    // Track memory usage in Sentry
    Sentry.setContext("memory", {
      totalMB,
      usedMB,
      usagePercent,
    })

    return healthCheck
  }

  // Get overall application health
  async getOverallHealth(): Promise<{
    status: "healthy" | "degraded" | "unhealthy"
    checks: HealthCheck[]
    timestamp: Date
  }> {
    const checks: HealthCheck[] = []

    // Run all health checks
    checks.push(await this.checkDatabase())
    checks.push(...(await this.checkExternalAPIs()))
    checks.push(this.getMemoryUsage())

    // Determine overall status
    const unhealthyCount = checks.filter((c) => c.status === "unhealthy").length
    const degradedCount = checks.filter((c) => c.status === "degraded").length

    let overallStatus: "healthy" | "degraded" | "unhealthy"

    if (unhealthyCount > 0) {
      overallStatus = "unhealthy"
    } else if (degradedCount > 0) {
      overallStatus = "degraded"
    } else {
      overallStatus = "healthy"
    }

    // Log overall health status
    if (overallStatus !== "healthy") {
      log.warn(`Application health status: ${overallStatus}`, {
        unhealthyServices: checks.filter((c) => c.status === "unhealthy").map((c) => c.service),
        degradedServices: checks.filter((c) => c.status === "degraded").map((c) => c.service),
      })
    }

    return {
      status: overallStatus,
      checks,
      timestamp: new Date(),
    }
  }
}

export const monitor = new ApplicationMonitor()
