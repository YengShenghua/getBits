import { execSync } from "child_process"
import * as fs from "fs"
import * as path from "path"

async function fixPrisma() {
  try {
    // Check if schema exists
    const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma")
    if (!fs.existsSync(schemaPath)) {
      console.error("❌ Prisma schema not found at:", schemaPath)
      process.exit(1)
    }

    console.log("✅ Prisma schema found")
    console.log("🔄 Regenerating Prisma client...")

    // Clear any existing generated client
    const clientPath = path.join(process.cwd(), "node_modules", ".prisma")
    if (fs.existsSync(clientPath)) {
      console.log("🗑️ Clearing existing Prisma client...")
      fs.rmSync(clientPath, { recursive: true, force: true })
    }

    // Generate Prisma client with explicit schema path
    execSync(`npx prisma generate --schema="${schemaPath}"`, {
      stdio: "inherit",
      cwd: process.cwd(),
    })
    console.log("✅ Prisma client generated")

    // Push schema to database
    console.log("🔄 Pushing schema to database...")
    execSync(`npx prisma db push --schema="${schemaPath}"`, {
      stdio: "inherit",
      cwd: process.cwd(),
    })
    console.log("✅ Schema pushed to database")

    console.log("🎉 Prisma setup complete!")
  } catch (error) {
    console.error("❌ Error fixing Prisma:", error)

    // Try alternative approach
    console.log("🔄 Trying alternative approach...")
    try {
      execSync("npx prisma generate", {
        stdio: "inherit",
        cwd: process.cwd(),
        env: { ...process.env, PRISMA_SCHEMA_PATH: "prisma/schema.prisma" },
      })
      console.log("✅ Alternative approach worked!")
    } catch (altError) {
      console.error("❌ Alternative approach also failed:", altError)
      process.exit(1)
    }
  }
}

fixPrisma()
