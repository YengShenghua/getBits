import * as fs from "fs"
import * as path from "path"

function validateSchema() {
  const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma")

  if (!fs.existsSync(schemaPath)) {
    console.error("❌ Schema file not found!")
    return false
  }

  const schemaContent = fs.readFileSync(schemaPath, "utf-8")

  // Check for common issues
  const checks = [
    {
      name: "Database URL",
      test: () => schemaContent.includes('url      = env("DATABASE_URL")'),
      fix: "Make sure DATABASE_URL is set in your .env file",
    },
    {
      name: "Generator block",
      test: () => schemaContent.includes("generator client"),
      fix: "Add generator client block to schema",
    },
    {
      name: "User model",
      test: () => schemaContent.includes("model User"),
      fix: "User model is missing",
    },
    {
      name: "firstName field",
      test: () => schemaContent.includes("firstName"),
      fix: "firstName field is missing from User model",
    },
    {
      name: "lastName field",
      test: () => schemaContent.includes("lastName"),
      fix: "lastName field is missing from User model",
    },
  ]

  console.log("🔍 Validating Prisma schema...")
  console.log("==============================")

  let allPassed = true
  checks.forEach((check) => {
    const passed = check.test()
    console.log(`${passed ? "✅" : "❌"} ${check.name}`)
    if (!passed) {
      console.log(`   Fix: ${check.fix}`)
      allPassed = false
    }
  })

  if (allPassed) {
    console.log("\n🎉 Schema validation passed!")
  } else {
    console.log("\n❌ Schema validation failed!")
  }

  return allPassed
}

validateSchema()
