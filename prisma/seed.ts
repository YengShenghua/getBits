import { PrismaClient } from "@prisma/client"
import { hashPassword } from "../lib/auth"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create admin user
  const adminPassword = await hashPassword("admin123")
  const admin = await prisma.user.upsert({
    where: { email: "admin@getbits.com" },
    update: {},
    create: {
      email: "admin@getbits.com",
      password: adminPassword,
      role: "SUPER_ADMIN",
      isVerified: true,
      kycStatus: "APPROVED",
      referralCode: "GBADMIN001",
      hasDeposited: true,
      hasTraded: true,
    },
  })

  // Create demo user
  const demoPassword = await hashPassword("demo123")
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@getbits.com" },
    update: {},
    create: {
      email: "demo@getbits.com",
      password: demoPassword,
      phone: "+1234567890",
      firstName: "Demo",
      lastName: "User",
      isVerified: true,
      kycStatus: "APPROVED",
      referralCode: "GBDEMO001",
      signupBonus: 0.002,
      hasDeposited: true,
      hasTraded: false,
    },
  })

  // Create wallets for admin
  const assets = ["BTC", "ETH", "USDT", "BNB", "USD", "EUR", "GBP"]
  const adminBalances = {
    BTC: 10,
    ETH: 100,
    USDT: 50000,
    BNB: 500,
    USD: 100000,
    EUR: 90000,
    GBP: 80000,
  }

  for (const asset of assets) {
    await prisma.wallet.upsert({
      where: { userId_asset: { userId: admin.id, asset } },
      update: {},
      create: {
        userId: admin.id,
        asset,
        balance: adminBalances[asset as keyof typeof adminBalances] || 0,
      },
    })
  }

  // Create wallets for demo user
  const demoBalances = {
    BTC: 0.002,
    ETH: 0.1,
    USDT: 500,
    BNB: 2,
    USD: 1000,
    EUR: 900,
    GBP: 800,
  }

  for (const asset of assets) {
    await prisma.wallet.upsert({
      where: { userId_asset: { userId: demoUser.id, asset } },
      update: {},
      create: {
        userId: demoUser.id,
        asset,
        balance: demoBalances[asset as keyof typeof demoBalances] || 0,
      },
    })
  }

  // Create sample market data
  const marketData = [
    { symbol: "BTC", price: 45000, change24h: 2.5, volume24h: 28000000000 },
    { symbol: "ETH", price: 3200, change24h: -1.2, volume24h: 15000000000 },
    { symbol: "USDT", price: 1, change24h: 0.01, volume24h: 45000000000 },
    { symbol: "BNB", price: 320, change24h: 3.8, volume24h: 2000000000 },
  ]

  for (const data of marketData) {
    await prisma.marketData.upsert({
      where: { symbol: data.symbol },
      update: data,
      create: data,
    })
  }

  // Create sample transactions
  await prisma.transaction.create({
    data: {
      userId: demoUser.id,
      type: "DEPOSIT",
      asset: "BTC",
      amount: 0.002,
      status: "COMPLETED",
      method: "crypto",
      processedAt: new Date(),
    },
  })

  await prisma.transaction.create({
    data: {
      userId: demoUser.id,
      type: "DEPOSIT",
      asset: "USD",
      amount: 1000,
      status: "COMPLETED",
      method: "bank",
      processedAt: new Date(),
    },
  })

  // Create system settings
  await prisma.systemSetting.upsert({
    where: { key: "maintenance_mode" },
    update: {},
    create: {
      key: "maintenance_mode",
      value: false,
    },
  })

  await prisma.systemSetting.upsert({
    where: { key: "trading_enabled" },
    update: {},
    create: {
      key: "trading_enabled",
      value: true,
    },
  })

  console.log("✅ Database seeded successfully!")
  console.log("👤 Admin: admin@getbits.com / admin123")
  console.log("👤 Demo User: demo@getbits.com / demo123")
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
