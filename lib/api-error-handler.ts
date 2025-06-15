import { type NextRequest, NextResponse } from "next/server"
import * as Sentry from "@sentry/nextjs"
import { log } from "./logger"

export interface APIError extends Error {
  statusCode?: number
  code?: string
  details?: Record<string, any>
}

export function createAPIError(
  message: string,
  statusCode = 500,
  code?: string,
  details?: Record<string, any>,
): APIError {
  const error = new Error(message) as APIError
  error.statusCode = statusCode
  error.code = code
  error.details = details
  return error
}

export function handleAPIError(error: unknown, request: NextRequest, context?: string): NextResponse {
  const timestamp = new Date().toISOString()
  const requestId = crypto.randomUUID()

  // Extract request information
  const requestInfo = {
    method: request.method,
    url: request.url,
    userAgent: request.headers.get("user-agent"),
    ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
    requestId,
    timestamp,
    context,
  }

  if (error instanceof Error) {
    const apiError = error as APIError
    const statusCode = apiError.statusCode || 500
    const errorCode = apiError.code || "INTERNAL_ERROR"

    // Log the error
    log.error(`API Error: ${error.message}`, error, {
      ...requestInfo,
      statusCode,
      errorCode,
      details: apiError.details,
    })

    // Send to Sentry with context
    Sentry.withScope((scope) => {
      scope.setTag("api_error", true)
      scope.setTag("error_code", errorCode)
      scope.setLevel("error")
      scope.setContext("request", requestInfo)
      scope.setContext("error_details", apiError.details || {})
      Sentry.captureException(error)
    })

    // Return appropriate error response
    const errorResponse = {
      error: {
        message: statusCode < 500 ? error.message : "Internal server error",
        code: errorCode,
        requestId,
        timestamp,
        ...(process.env.NODE_ENV === "development" && {
          stack: error.stack,
          details: apiError.details,
        }),
      },
    }

    return NextResponse.json(errorResponse, { status: statusCode })
  }

  // Handle unknown errors
  const unknownError = new Error("Unknown error occurred")

  log.error("Unknown API Error", unknownError, {
    ...requestInfo,
    originalError: String(error),
  })

  Sentry.withScope((scope) => {
    scope.setTag("api_error", true)
    scope.setTag("error_type", "unknown")
    scope.setLevel("error")
    scope.setContext("request", requestInfo)
    scope.setExtra("original_error", error)
    Sentry.captureException(unknownError)
  })

  return NextResponse.json(
    {
      error: {
        message: "Internal server error",
        code: "UNKNOWN_ERROR",
        requestId,
        timestamp,
      },
    },
    { status: 500 },
  )
}

// Wrapper for API routes with error handling
export function withErrorHandling(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>,
  context?: string,
) {
  return async (request: NextRequest, routeContext?: any): Promise<NextResponse> => {
    try {
      return await handler(request, routeContext)
    } catch (error) {
      return handleAPIError(error, request, context)
    }
  }
}
