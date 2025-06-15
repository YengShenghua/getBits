import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  beforeSend(event, hint) {
    // Filter out certain errors
    if (event.exception) {
      const error = hint.originalException

      // Don't send expected business logic errors
      if (
        error?.message?.includes("Insufficient balance") ||
        error?.message?.includes("Invalid credentials") ||
        error?.message?.includes("User already exists")
      ) {
        return null
      }
    }

    return event
  },

  // Set server context
  initialScope: {
    tags: {
      component: "server",
    },
  },
})
