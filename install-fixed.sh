#!/bin/bash

# Fixed Installation Script for WalletX
# This script handles the workspace protocol issues

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔧 WalletX Fixed Installation${NC}\n"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Please run this script from the WalletX root directory${NC}"
    exit 1
fi

# Step 1: Install root dependencies
echo -e "${BLUE}Step 1: Installing root dependencies...${NC}"
npm install

# Step 2: Build shared package first
echo -e "\n${BLUE}Step 2: Building shared package...${NC}"
cd shared
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run build
cd ..

# Step 3: Install backend dependencies
echo -e "\n${BLUE}Step 3: Installing backend dependencies...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..

# Step 4: Install frontend dependencies
echo -e "\n${BLUE}Step 4: Installing frontend dependencies...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..

# Step 5: Generate Prisma client
echo -e "\n${BLUE}Step 5: Generating Prisma client...${NC}"
cd backend
npm run prisma:generate || echo -e "${YELLOW}Note: Database may not be set up yet${NC}"
cd ..

echo -e "\n${GREEN}✅ Installation complete!${NC}\n"

echo -e "${BLUE}Next steps:${NC}"
echo "1. Set up environment variables (see INSTALL.md)"
echo "2. Start PostgreSQL:"
echo "   docker compose up -d postgres"
echo "   # or: docker-compose up -d postgres"
echo "3. Run migrations:"
echo "   cd backend && npm run prisma:migrate"
echo "4. Start dev servers:"
echo "   npm run dev"

