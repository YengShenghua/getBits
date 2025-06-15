#!/bin/bash
set -e

echo "🚀 Starting deployment build..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Generate Prisma client (with fallback DATABASE_URL if not set)
echo "🔧 Generating Prisma client..."
export DATABASE_URL="${DATABASE_URL:-mongodb://localhost:27017/getbits}"
npx prisma generate

# Build the application
echo "🏗️ Building Next.js application..."
npm run build

echo "✅ Deployment build completed!"
