import winston from "winston"
import * as Sentry from "@sentry/nextjs"

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

// Define colors for each level
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
}

winston.addColors(colors)

// Create the logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    winston.format.colorize({ all: true }),
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/all.log",
    }),
  ],
})

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
    Sentry.captureMessage(message, "warning")
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
    Sentry.captureMessage(message, "warning")
    Sentry.setContext("security", securityData)
  },

  // Performance logging
  performance: (message: string, performanceData: Record<string, any>) => {
    logger.info(message, { type: "PERFORMANCE", ...performanceData })

    // Track performance in Sentry
    Sentry.addBreadcrumb({
      message,
      category: "performance",
      level: "info",
      data: performanceData,
    })
  },
}

export default logger
