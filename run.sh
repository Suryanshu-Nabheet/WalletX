#!/bin/bash

# WalletX Run Script
# Starts all services for development

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting WalletX...${NC}\n"

# Check if PostgreSQL is running
if ! docker ps | grep -q walletx-postgres && ! pg_isready -h localhost -p 5432 &> /dev/null; then
    echo -e "${YELLOW}Starting PostgreSQL with Docker...${NC}"
    docker-compose up -d postgres
    echo "Waiting for PostgreSQL to be ready..."
    sleep 5
fi

# Check if database exists
echo -e "${BLUE}Checking database...${NC}"
if ! docker exec walletx-postgres psql -U walletx -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw walletx; then
    echo -e "${YELLOW}Database 'walletx' not found. Creating...${NC}"
    docker exec walletx-postgres psql -U walletx -c "CREATE DATABASE walletx;" 2>/dev/null || echo "Database may already exist or using external PostgreSQL"
fi

# Run migrations if needed
if [ -d "backend/prisma/migrations" ]; then
    echo -e "${BLUE}Running database migrations...${NC}"
    cd backend
    npm run prisma:migrate deploy 2>/dev/null || npm run prisma:migrate || echo "Migrations may have already been applied"
    cd ..
fi

# Start services
echo -e "${GREEN}Starting development servers...${NC}\n"
echo -e "${BLUE}Backend will run on: http://localhost:4000${NC}"
echo -e "${BLUE}Frontend will run on: http://localhost:3000${NC}\n"

# Use concurrently if available, otherwise start separately
if command -v concurrently &> /dev/null; then
    npm run dev
else
    echo -e "${YELLOW}Concurrently not found. Starting services separately...${NC}"
    echo "Press Ctrl+C to stop all services"
    
    # Start backend
    cd backend && npm run start:dev &
    BACKEND_PID=$!
    
    # Start frontend
    cd ../frontend && npm run dev &
    FRONTEND_PID=$!
    
    # Wait for interrupt
    trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
    wait
fi

