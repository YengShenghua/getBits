import { NextResponse } from "next/server"
import { monitor } from "@/lib/monitoring"
import { log } from "@/lib/logger"

export async function GET() {
  try {
    const health = await monitor.getOverallHealth()

    const statusCode = health.status === "healthy" ? 200 : health.status === "degraded" ? 200 : 503

    return NextResponse.json(health, { status: statusCode })
  } catch (error) {
    log.error("Health check endpoint failed", error as Error)

    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Health check failed",
        timestamp: new Date(),
      },
      { status: 503 },
    )
  }
}
