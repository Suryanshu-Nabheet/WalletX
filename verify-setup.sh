#!/bin/bash

# WalletX Verification Script
# This script verifies that the project is set up correctly

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0

echo -e "${BLUE}🔍 Verifying WalletX Setup...${NC}\n"

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} $NODE_VERSION"
else
    echo -e "${RED}✗ Node.js not found${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} $NPM_VERSION"
else
    echo -e "${RED}✗ npm not found${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check PostgreSQL
echo -n "Checking PostgreSQL... "
if command -v psql &> /dev/null || docker ps | grep -q postgres; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ PostgreSQL not found (Docker will be used)${NC}"
fi

# Check dependencies
echo -n "Checking root dependencies... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ Run 'npm install' first${NC}"
fi

echo -n "Checking shared package... "
if [ -d "shared/node_modules" ] && [ -d "shared/dist" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ Run 'cd shared && npm install && npm run build'${NC}"
fi

echo -n "Checking backend dependencies... "
if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ Run 'cd backend && npm install'${NC}"
fi

echo -n "Checking frontend dependencies... "
if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ Run 'cd frontend && npm install'${NC}"
fi

# Check environment files
echo -n "Checking backend/.env... "
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ Create backend/.env from .env.example${NC}"
fi

echo -n "Checking frontend/.env.local... "
if [ -f "frontend/.env.local" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ Create frontend/.env.local${NC}"
fi

# Check Prisma
echo -n "Checking Prisma client... "
if [ -d "backend/node_modules/@prisma/client" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ Run 'cd backend && npm run prisma:generate'${NC}"
fi

# Check database connection
echo -n "Checking database connection... "
if docker ps | grep -q walletx-postgres || psql -lqt | cut -d \| -f 1 | grep -qw walletx; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ Database not accessible. Start with 'docker-compose up -d postgres'${NC}"
fi

echo ""
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ Setup verification complete!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Start database: docker-compose up -d postgres"
    echo "2. Run migrations: cd backend && npm run prisma:migrate"
    echo "3. Start dev servers: npm run dev"
else
    echo -e "${RED}❌ Found $ERRORS critical issues${NC}"
    exit 1
fi

