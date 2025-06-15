import { execSync } from "child_process"

async function resetDatabase() {
  try {
    console.log("⚠️  Resetting database...")

    // Reset database
    execSync("npx prisma db push --force-reset", { stdio: "inherit" })
    console.log("✅ Database reset")

    // Generate client
    execSync("npx prisma generate", { stdio: "inherit" })
    console.log("✅ Prisma client generated")

    // Seed database
    console.log("🌱 Seeding database...")
    execSync("npx prisma db seed", { stdio: "inherit" })
    console.log("✅ Database seeded")

    console.log("🎉 Database reset complete!")
  } catch (error) {
    console.error("❌ Error resetting database:", error)
    process.exit(1)
  }
}

resetDatabase()
