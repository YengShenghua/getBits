#!/bin/bash
set -e

echo "🚀 Starting build process..."

# Remove any existing lock files
rm -f pnpm-lock.yaml yarn.lock

# Use npm for installation
echo "📦 Installing dependencies with npm..."
npm ci --legacy-peer-deps

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Build the application
echo "🏗️ Building application..."
npm run build

echo "✅ Build completed successfully!"
