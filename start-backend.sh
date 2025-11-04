#!/bin/bash

# Start Backend Server Script

cd "$(dirname "$0")/backend"

echo "🔧 Starting WalletX Backend..."

# Check for .env
if [ ! -f .env ]; then
    echo "⚠️  Warning: backend/.env not found"
    echo "Creating basic .env file..."
    cat > .env << EOF
DATABASE_URL="postgresql://walletx:walletx_dev_password@localhost:5432/walletx?schema=public"
JWT_SECRET=$(openssl rand -hex 32)
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=$(openssl rand -hex 32)
JWT_REFRESH_EXPIRES_IN=7d
PORT=4000
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
EOF
    echo "✅ Created backend/.env"
fi

# Check for Prisma client
if [ ! -d "node_modules/@prisma/client" ]; then
    echo "📦 Generating Prisma client..."
    npm run prisma:generate
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🚀 Starting NestJS server..."
npm run start:dev

