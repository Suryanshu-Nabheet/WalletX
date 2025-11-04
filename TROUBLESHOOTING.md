# Troubleshooting Guide

## Common Installation Issues

### 1. `workspace:*` Protocol Error

**Error**: `npm error Unsupported URL Type "workspace:"`

**Solution**: The workspace protocol has been fixed. Use one of these:

**Option A: Use the fixed install script**
```bash
./install-fixed.sh
```

**Option B: Manual installation**
```bash
# Install root
npm install

# Build shared first
cd shared
npm install
npm run build
cd ..

# Then install backend and frontend
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

**Option C: Use npm workspaces (if supported)**
```bash
npm install --workspaces
```

### 2. `docker-compose: command not found`

**Error**: `zsh: command not found: docker-compose`

**Solutions**:

**Option A: Use newer Docker syntax**
```bash
docker compose up -d postgres
```

**Option B: Install docker-compose**
```bash
# macOS
brew install docker-compose

# Or use Docker Desktop which includes it
```

**Option C: Use local PostgreSQL**
```bash
# Install PostgreSQL
brew install postgresql@14  # macOS
# or
sudo apt-get install postgresql-14  # Linux

# Start PostgreSQL
brew services start postgresql@14  # macOS
# or
sudo systemctl start postgresql  # Linux

# Create database
createdb walletx
```

### 3. `cd: no such file or directory`

**Error**: `cd: no such file or directory: backend`

**Solution**: Make sure you're in the WalletX root directory:
```bash
pwd  # Should show: /path/to/WalletX
ls   # Should show: backend, frontend, shared, package.json
```

If not, navigate to the correct directory:
```bash
cd /Users/suryanshunabheet/Downloads/Wallet
```

### 4. Prisma Migration Errors

**Error**: `PrismaClient is not available` or migration errors

**Solution**:
```bash
cd backend

# Clean and regenerate
rm -rf node_modules/.prisma
npm run prisma:generate

# If database doesn't exist
# Make sure PostgreSQL is running, then:
npm run prisma:migrate

cd ..
```

### 5. Module Not Found: `@walletx/shared`

**Error**: `Cannot find module '@walletx/shared'`

**Solution**:
```bash
# Rebuild shared package
cd shared
rm -rf dist node_modules
npm install
npm run build
cd ..

# Reinstall backend/frontend
cd backend
rm -rf node_modules
npm install
cd ..

cd frontend
rm -rf node_modules
npm install
cd ..
```

### 6. Port Already in Use

**Error**: `Port 3000/4000 is already in use`

**Solution**:
```bash
# Find what's using the port
lsof -i :3000  # Frontend
lsof -i :4000  # Backend

# Kill the process or change ports
# In backend/.env: PORT=4001
# In frontend/.env.local: NEXT_PUBLIC_API_URL=http://localhost:4001
# Then run: cd frontend && npm run dev -- -p 3001
```

### 7. Database Connection Errors

**Error**: `Can't reach database server` or `connection refused`

**Solution**:
```bash
# Check if PostgreSQL is running
docker ps | grep postgres
# or
pg_isready

# Start PostgreSQL
docker compose up -d postgres
# or
docker-compose up -d postgres

# Check connection string in backend/.env
# Should be: DATABASE_URL="postgresql://walletx:walletx_dev_password@localhost:5432/walletx"
```

### 8. TypeScript Errors

**Error**: Various TypeScript compilation errors

**Solution**:
```bash
# Rebuild shared package
cd shared
npm run build
cd ..

# Clean and rebuild
cd backend
rm -rf dist
npm run build
cd ..

cd frontend
rm -rf .next
npm run build
cd ..
```

### 9. Missing Script Errors

**Error**: `Missing script: "dev"` or similar

**Solution**: Make sure you're running commands from the correct directory:
```bash
# For shared
cd shared && npm run build

# For backend
cd backend && npm run start:dev

# For frontend
cd frontend && npm run dev

# For root (runs both)
npm run dev
```

### 10. npm Install Hangs

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# If using workspaces, try:
npm install --legacy-peer-deps
```

## Complete Fresh Start

If nothing works, start completely fresh:

```bash
# Remove all node_modules
rm -rf node_modules
rm -rf shared/node_modules shared/dist
rm -rf backend/node_modules backend/dist
rm -rf frontend/node_modules frontend/.next

# Clear npm cache
npm cache clean --force

# Reinstall everything
./install-fixed.sh
```

## Getting Help

1. Check the [INSTALL.md](./INSTALL.md) for step-by-step instructions
2. Verify your setup: `./verify-setup.sh`
3. Check [GitHub Issues](https://github.com/Suryanshu-Nabheet/WalletX/issues)
4. Review the [Getting Started Guide](./GETTING_STARTED.md)

## System Requirements

- **Node.js**: 18+ (check with `node -v`)
- **npm**: 9+ (check with `npm -v`)
- **PostgreSQL**: 14+ (or Docker)
- **Docker**: Optional but recommended

Check your versions:
```bash
node -v
npm -v
psql --version  # or check Docker: docker --version
```

