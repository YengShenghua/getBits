// Simple monitoring utility that works in both browser and server environments
export class SimpleMonitor {
  private static instance: SimpleMonitor
  private metrics: Map<string, any> = new Map()

  static getInstance(): SimpleMonitor {
    if (!SimpleMonitor.instance) {
      SimpleMonitor.instance = new SimpleMonitor()
    }
    return SimpleMonitor.instance
  }

  // Track application metrics
  track(key: string, value: any) {
    this.metrics.set(key, {
      value,
      timestamp: Date.now(),
    })
  }

  // Get metric value
  get(key: string) {
    return this.metrics.get(key)
  }

  // Get all metrics
  getAll() {
    return Object.fromEntries(this.metrics)
  }

  // Check if database is healthy (simplified)
  async checkDatabaseHealth(): Promise<boolean> {
    try {
      // In a real implementation, you'd ping your database
      // For now, we'll just return true
      return true
    } catch (error) {
      console.error("Database health check failed:", error)
      return false
    }
  }

  // Get system health status
  async getHealthStatus() {
    const dbHealthy = await this.checkDatabaseHealth()

    return {
      status: dbHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealthy ? "up" : "down",
        api: "up", // Simplified - always up if this code runs
      },
      uptime: process.uptime ? process.uptime() : 0,
    }
  }
}

export const monitor = SimpleMonitor.getInstance()
