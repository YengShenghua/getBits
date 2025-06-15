"use client"

import { useEffect, useRef } from "react"
import * as Sentry from "@sentry/nextjs"

export function usePerformanceMonitoring(componentName: string) {
  const mountTime = useRef<number>()
  const renderCount = useRef(0)

  useEffect(() => {
    mountTime.current = performance.now()
    renderCount.current += 1

    // Log slow component mounts
    const checkMountTime = () => {
      if (mountTime.current) {
        const mountDuration = performance.now() - mountTime.current

        if (mountDuration > 1000) {
          // Slow mount (>1s)
          console.warn(`Slow component mount: ${componentName}`, {
            component: componentName,
            mountTime: mountDuration,
            renderCount: renderCount.current,
          })

          Sentry.addBreadcrumb({
            message: `Slow mount: ${componentName}`,
            category: "performance",
            level: "warning",
            data: {
              mountTime: mountDuration,
              renderCount: renderCount.current,
            },
          })
        }
      }
    }

    // Check mount time after a brief delay
    const timeoutId = setTimeout(checkMountTime, 100)

    return () => {
      clearTimeout(timeoutId)

      // Log excessive re-renders
      if (renderCount.current > 10) {
        console.warn(`Excessive re-renders: ${componentName}`, {
          component: componentName,
          renderCount: renderCount.current,
        })
      }
    }
  }, [componentName])

  // Return performance utilities
  return {
    startTimer: (operationName: string) => {
      const start = performance.now()

      return {
        end: () => {
          const duration = performance.now() - start

          if (duration > 500) {
            // Slow operation (>500ms)
            console.warn(`Slow operation: ${operationName}`, {
              component: componentName,
              operation: operationName,
              duration,
            })
          }

          return duration
        },
      }
    },
  }
}
