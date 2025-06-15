export function generateDepositAddress(asset: string, userId: string): string {
  // In production, this would integrate with actual crypto services
  const prefix = asset === "BTC" ? "bc1" : asset === "ETH" ? "0x" : "T"
  const hash = Buffer.from(`${userId}-${asset}-${Date.now()}`).toString("hex").slice(0, 32)
  return `${prefix}${hash}`
}

export function validateCryptoAddress(address: string, asset: string): boolean {
  if (!address || !asset) return false

  switch (asset.toUpperCase()) {
    case "BTC":
      return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/.test(address)
    case "ETH":
      return /^0x[a-fA-F0-9]{40}$/.test(address)
    case "USDT":
      return /^0x[a-fA-F0-9]{40}$/.test(address) || /^T[A-Za-z1-9]{33}$/.test(address)
    default:
      return address.length > 10 && address.length < 100
  }
}

export function estimateTransactionFee(asset: string, amount: number): number {
  const feeRates = {
    BTC: 0.0001,
    ETH: 0.002,
    USDT: 1.0,
    USD: 2.5,
  }

  return feeRates[asset as keyof typeof feeRates] || 0.001
}
