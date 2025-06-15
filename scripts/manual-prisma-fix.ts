import { execSync } from "child_process"

console.log("🔧 Manual Prisma Fix - Step by Step")
console.log("=====================================")

try {
  console.log("\n1️⃣ Checking Prisma installation...")
  execSync("npx prisma --version", { stdio: "inherit" })

  console.log("\n2️⃣ Validating schema...")
  execSync("npx prisma validate", { stdio: "inherit" })

  console.log("\n3️⃣ Formatting schema...")
  execSync("npx prisma format", { stdio: "inherit" })

  console.log("\n4️⃣ Generating client...")
  execSync("npx prisma generate", { stdio: "inherit" })

  console.log("\n5️⃣ Pushing to database...")
  execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" })

  console.log("\n✅ All steps completed successfully!")
} catch (error) {
  console.error("\n❌ Error at step:", error)
  console.log("\n🔍 Try running these commands manually:")
  console.log("1. npx prisma validate")
  console.log("2. npx prisma format")
  console.log("3. npx prisma generate")
  console.log("4. npx prisma db push")
}
