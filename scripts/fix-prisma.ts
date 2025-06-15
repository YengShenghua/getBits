import { execSync } from "child_process"

async function fixPrisma() {
  try {
    console.log("🔄 Regenerating Prisma client...")

    // Generate Prisma client
    execSync("npx prisma generate", { stdio: "inherit" })
    console.log("✅ Prisma client generated")

    // Push schema to database
    console.log("🔄 Pushing schema to database...")
    execSync("npx prisma db push", { stdio: "inherit" })
    console.log("✅ Schema pushed to database")

    console.log("🎉 Prisma setup complete!")
  } catch (error) {
    console.error("❌ Error fixing Prisma:", error)
    process.exit(1)
  }
}

fixPrisma()
