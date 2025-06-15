export interface RiskAssessment {
  score: number
  flags: string[]
  recommendation: "approve" | "review" | "reject"
}

export function assessTransactionRisk(
  amount: number,
  asset: string,
  userHistory: any,
  method?: string,
): RiskAssessment {
  let score = 0
  const flags: string[] = []

  // Amount-based risk
  const limits = {
    BTC: 1,
    ETH: 10,
    USDT: 10000,
    USD: 10000,
  }

  const limit = limits[asset as keyof typeof limits] || 1000
  if (amount > limit * 0.8) {
    score += 30
    flags.push("high_amount")
  }

  // User history risk
  if (!userHistory.hasDeposited) {
    score += 20
    flags.push("first_transaction")
  }

  if (!userHistory.isVerified) {
    score += 25
    flags.push("unverified_user")
  }

  // Method-based risk
  if (method === "crypto") {
    score += 10
    flags.push("crypto_transaction")
  }

  // Time-based risk (rapid transactions)
  const now = new Date()
  const recentTransactions = userHistory.recentTransactions || []
  const recentCount = recentTransactions.filter(
    (tx: any) => new Date(tx.createdAt) > new Date(now.getTime() - 24 * 60 * 60 * 1000),
  ).length

  if (recentCount > 5) {
    score += 40
    flags.push("rapid_transactions")
  }

  // Determine recommendation
  let recommendation: "approve" | "review" | "reject"
  if (score >= 70) {
    recommendation = "reject"
  } else if (score >= 40) {
    recommendation = "review"
  } else {
    recommendation = "approve"
  }

  return { score, flags, recommendation }
}
