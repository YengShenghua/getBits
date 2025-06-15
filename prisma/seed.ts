import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@getbits.com" },
    update: {},
    create: {
      email: "admin@getbits.com",
      password: adminPassword,
      name: "Admin User",
      role: "ADMIN",
      hasDeposited: true,
      hasTraded: true,
      signupBonus: 0,
    },
  })

  // Create demo user
  const demoPassword = await bcrypt.hash("demo123", 12)
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@getbits.com" },
    update: {},
    create: {
      email: "demo@getbits.com",
      password: demoPassword,
      name: "Demo User",
      role: "USER",
      hasDeposited: false,
      hasTraded: false,
      signupBonus: 0.002,
    },
  })

  // Create wallets for demo user
  const assets = ["BTC", "ETH", "USDT", "BNB"]
  const prices = { BTC: 43250, ETH: 2650, USDT: 1, BNB: 315 }

  for (const asset of assets) {
    await prisma.wallet.upsert({
      where: {
        userId_asset: {
          userId: demoUser.id,
          asset,
        },
      },
      update: {},
      create: {
        userId: demoUser.id,
        asset,
        balance: asset === "BTC" ? 0.002 : 0,
        locked: 0,
        usdPrice: prices[asset as keyof typeof prices],
      },
    })
  }

  // Create sample transactions
  await prisma.transaction.create({
    data: {
      userId: demoUser.id,
      type: "BONUS",
      asset: "BTC",
      amount: 0.002,
      status: "COMPLETED",
      description: "Welcome bonus",
    },
  })

  // Create market data
  const marketData = [
    { symbol: "BTC/USDT", price: 43250.5, change: "+2.4%", volume: "1.2B", isUp: true },
    { symbol: "ETH/USDT", price: 2650.75, change: "+1.8%", volume: "890M", isUp: true },
    { symbol: "BNB/USDT", price: 315.2, change: "-0.5%", volume: "245M", isUp: false },
    { symbol: "ADA/USDT", price: 0.485, change: "+3.2%", volume: "180M", isUp: true },
    { symbol: "SOL/USDT", price: 98.45, change: "+5.1%", volume: "320M", isUp: true },
    { symbol: "DOT/USDT", price: 7.85, change: "-1.2%", volume: "95M", isUp: false },
  ]

  for (const data of marketData) {
    await prisma.marketData.upsert({
      where: { symbol: data.symbol },
      update: data,
      create: data,
    })
  }

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
