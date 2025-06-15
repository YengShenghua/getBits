export interface RiskAssessment {
  score: number
  level: "LOW" | "MEDIUM" | "HIGH"
  flags: string[]
}

export function assessTransactionRisk(amount: number, asset: string, userHistory: any = {}): RiskAssessment {
  let score = 0
  const flags: string[] = []

  // Amount-based risk
  if (amount > 10000) {
    score += 30
    flags.push("HIGH_AMOUNT")
  } else if (amount > 1000) {
    score += 10
    flags.push("MEDIUM_AMOUNT")
  }

  // Asset-based risk
  if (asset === "BTC" && amount > 1) {
    score += 20
    flags.push("HIGH_VALUE_CRYPTO")
  }

  // User history risk
  if (!userHistory.hasDeposited) {
    score += 15
    flags.push("NEW_USER")
  }

  // Determine risk level
  let level: "LOW" | "MEDIUM" | "HIGH" = "LOW"
  if (score >= 50) level = "HIGH"
  else if (score >= 25) level = "MEDIUM"

  return { score, level, flags }
}
