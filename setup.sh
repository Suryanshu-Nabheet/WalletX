#!/bin/bash

# WalletX Setup Script
# This script sets up the entire WalletX project

set -e

echo "🚀 Setting up WalletX..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js version
echo -e "${BLUE}Checking Node.js version...${NC}"
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${YELLOW}Warning: Node.js 18+ is required. Current version: $(node -v)${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js version OK${NC}"

# Install root dependencies
echo -e "${BLUE}Installing root dependencies...${NC}"
npm install

# Install shared package dependencies
echo -e "${BLUE}Installing shared package dependencies...${NC}"
cd shared
npm install
npm run build
cd ..

# Install backend dependencies
echo -e "${BLUE}Installing backend dependencies...${NC}"
cd backend
npm install

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating backend/.env from template...${NC}"
    cat > .env << EOF
# Database
DATABASE_URL="postgresql://walletx:walletx_dev_password@localhost:5432/walletx?schema=public"

# JWT
JWT_SECRET=$(openssl rand -hex 32)
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=$(openssl rand -hex 32)
JWT_REFRESH_EXPIRES_IN=7d

# OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AWS KMS (for custodial mode - optional)
AWS_REGION=us-east-1
AWS_KMS_KEY_ID=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

# RPC Providers
ETHEREUM_RPC_URL=https://eth.llamarpc.com
POLYGON_RPC_URL=https://polygon.llamarpc.com
ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
OPTIMISM_RPC_URL=https://mainnet.optimism.io
BASE_RPC_URL=https://mainnet.base.org
SEPOLIA_RPC_URL=https://rpc.sepolia.org

# Swap Aggregators (optional)
ZEROX_API_KEY=
ONEINCH_API_KEY=

# Security
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# Monitoring (optional)
SENTRY_DSN=
ENVIRONMENT=development

# App
PORT=4000
NODE_ENV=development
EOF
    echo -e "${GREEN}✓ Created backend/.env${NC}"
else
    echo -e "${GREEN}✓ backend/.env already exists${NC}"
fi

cd ..

# Install frontend dependencies
echo -e "${BLUE}Installing frontend dependencies...${NC}"
cd frontend
npm install

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Creating frontend/.env.local...${NC}"
    echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > .env.local
    echo -e "${GREEN}✓ Created frontend/.env.local${NC}"
else
    echo -e "${GREEN}✓ frontend/.env.local already exists${NC}"
fi

cd ..

# Check if PostgreSQL is running
echo -e "${BLUE}Checking PostgreSQL...${NC}"
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✓ PostgreSQL found${NC}"
    echo -e "${YELLOW}Note: Make sure PostgreSQL is running and database 'walletx' exists${NC}"
    echo -e "${YELLOW}You can create it with: createdb walletx${NC}"
else
    echo -e "${YELLOW}PostgreSQL not found. Using Docker Compose...${NC}"
fi

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo -e "${BLUE}Starting Docker services...${NC}"
    docker-compose up -d postgres redis 2>/dev/null || echo -e "${YELLOW}Docker services may already be running${NC}"
else
    echo -e "${YELLOW}Docker not found. Skipping Docker services...${NC}"
fi

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Start PostgreSQL (if not using Docker):"
echo "   docker-compose up -d postgres"
echo ""
echo "2. Run database migrations:"
echo "   cd backend && npm run prisma:migrate"
echo ""
echo "3. Start development servers:"
echo "   npm run dev"
echo ""
echo -e "${GREEN}Git Repository: https://github.com/Suryanshu-Nabheet/WalletX.git${NC}"

