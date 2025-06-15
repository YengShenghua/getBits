import * as Sentry from "@sentry/nextjs"

// Browser-compatible logging levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
}

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Browser-compatible logger
const createLogger = () => {
  if (isBrowser) {
    // Client-side logging (browser)
    return {
      error: (message: string, meta?: any) => {
        console.error(`[ERROR] ${message}`, meta)
      },
      warn: (message: string, meta?: any) => {
        console.warn(`[WARN] ${message}`, meta)
      },
      info: (message: string, meta?: any) => {
        console.info(`[INFO] ${message}`, meta)
      },
      debug: (message: string, meta?: any) => {
        console.debug(`[DEBUG] ${message}`, meta)
      },
    }
  } else {
    // Server-side logging (Node.js)
    try {
      const winston = require("winston")

      return winston.createLogger({
        level: process.env.NODE_ENV === "production" ? "info" : "debug",
        format: winston.format.combine(
          winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          winston.format.printf((info: any) => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`),
        ),
        transports: [
          new winston.transports.Console(),
          // Only add file transports in production
          ...(process.env.NODE_ENV === "production"
            ? [
                new winston.transports.File({
                  filename: "logs/error.log",
                  level: "error",
                }),
                new winston.transports.File({
                  filename: "logs/combined.log",
                }),
              ]
            : []),
        ],
      })
    } catch (error) {
      // Fallback to console if Winston fails
      return {
        error: (message: string, meta?: any) => console.error(`[ERROR] ${message}`, meta),
        warn: (message: string, meta?: any) => console.warn(`[WARN] ${message}`, meta),
        info: (message: string, meta?: any) => console.info(`[INFO] ${message}`, meta),
        debug: (message: string, meta?: any) => console.debug(`[DEBUG] ${message}`, meta),
      }
    }
  }
}

const logger = createLogger()

// Enhanced logging functions with Sentry integration
export const log = {
  error: (message: string, error?: Error, context?: Record<string, any>) => {
    logger.error(message, { error: error?.message, stack: error?.stack, ...context })

    // Send to Sentry
    if (error) {
      Sentry.captureException(error, {
        tags: { level: "error" },
        extra: context,
      })
    } else {
      Sentry.captureMessage(message, "error")
    }
  },

  warn: (message: string, context?: Record<string, any>) => {
    logger.warn(message, context)
    if (isBrowser) {
      Sentry.captureMessage(message, "warning")
    }
  },

  info: (message: string, context?: Record<string, any>) => {
    logger.info(message, context)
  },

  debug: (message: string, context?: Record<string, any>) => {
    logger.debug(message, context)
  },

  // Financial transaction logging (critical)
  transaction: (message: string, transactionData: Record<string, any>) => {
    const logData = {
      level: "info",
      message,
      timestamp: new Date().toISOString(),
      type: "FINANCIAL_TRANSACTION",
      ...transactionData,
    }

    logger.info(message, logData)

    // Always send financial transactions to Sentry for monitoring
    Sentry.addBreadcrumb({
      message,
      category: "transaction",
      level: "info",
      data: transactionData,
    })
  },

  // Security event logging
  security: (message: string, securityData: Record<string, any>) => {
    const logData = {
      level: "warn",
      message,
      timestamp: new Date().toISOString(),
      type: "SECURITY_EVENT",
      ...securityData,
    }

    logger.warn(message, logData)

    // Send security events to Sentry
    if (isBrowser) {
      Sentry.captureMessage(message, "warning")
      Sentry.setContext("security", securityData)
    }
  },

  // Performance logging
  performance: (message: string, performanceData: Record<string, any>) => {
    logger.info(message, { type: "PERFORMANCE", ...performanceData })

    // Track performance in Sentry
    if (isBrowser) {
      Sentry.addBreadcrumb({
        message,
        category: "performance",
        level: "info",
        data: performanceData,
      })
    }
  },
}

export default logger
