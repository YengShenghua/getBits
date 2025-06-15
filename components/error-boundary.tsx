"use client"

import React from "react"
import * as Sentry from "@sentry/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)

    // Log to Sentry
    Sentry.withScope((scope) => {
      scope.setTag("errorBoundary", true)
      scope.setContext("errorInfo", errorInfo)
      Sentry.captureException(error)
    })

    this.setState({
      error,
      errorInfo,
    })
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />
      }

      return <DefaultErrorFallback error={this.state.error!} resetError={this.resetError} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 text-red-500">
            <AlertTriangle className="h-full w-full" />
          </div>
          <CardTitle className="text-red-600">Something went wrong</CardTitle>
          <CardDescription>We're sorry, but something unexpected happened. Our team has been notified.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === "development" && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm font-medium text-red-800">Error Details:</p>
              <p className="text-xs text-red-600 mt-1 font-mono">{error.message}</p>
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={resetError} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => (window.location.href = "/")} className="flex-1">
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Specific error boundary for financial operations
export function FinancialErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Transaction Error
            </CardTitle>
            <CardDescription>
              There was an issue processing your financial transaction. Please try again or contact support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button onClick={resetError} size="sm">
                Retry Transaction
              </Button>
              <Button variant="outline" size="sm" onClick={() => (window.location.href = "/support")}>
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}
