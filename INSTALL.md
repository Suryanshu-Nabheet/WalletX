# Installation Guide

## Step-by-Step Installation

Follow these steps in order to set up WalletX:

### 1. Install Root Dependencies

```bash
npm install
```

### 2. Build Shared Package First

```bash
cd shared
npm install
npm run build
cd ..
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 4. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 5. Set Up Environment Variables

**Backend** - Create `backend/.env`:
```env
DATABASE_URL="postgresql://walletx:walletx_dev_password@localhost:5432/walletx?schema=public"
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
PORT=4000
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

**Frontend** - Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 6. Start PostgreSQL

**Option A: Using Docker (Recommended)**
```bash
# Try docker compose (newer version)
docker compose up -d postgres

# Or docker-compose (older version)
docker-compose up -d postgres
```

**Option B: Using Local PostgreSQL**
```bash
# Create database
createdb walletx

# Or using psql
psql -U postgres -c "CREATE DATABASE walletx;"
```

### 7. Run Database Migrations

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
cd ..
```

### 8. Start Development Servers

**Option A: Using npm script (from root)**
```bash
npm run dev
```

**Option B: Start separately**

Terminal 1 (Backend):
```bash
cd backend
npm run start:dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

## Troubleshooting

### Issue: `workspace:*` protocol error
**Solution**: The workspace references have been updated to use `file:../shared`. Make sure you run `npm install` from the root directory first.

### Issue: `docker-compose: command not found`
**Solutions**:
1. Try `docker compose` (without hyphen) - newer Docker versions
2. Install docker-compose: `brew install docker-compose` (macOS)
3. Use local PostgreSQL instead

### Issue: `cd: no such file or directory`
**Solution**: Make sure you're in the WalletX root directory. Check with `pwd` and `ls`.

### Issue: Prisma errors
**Solution**: 
```bash
cd backend
rm -rf node_modules/.prisma
npm run prisma:generate
```

### Issue: Module not found errors
**Solution**: Rebuild shared package:
```bash
cd shared
rm -rf dist node_modules
npm install
npm run build
cd ..
```

## Quick Install Script

You can also use the automated setup:

```bash
./setup.sh
```

Then verify:
```bash
./verify-setup.sh
```

## Verify Installation

After installation, verify everything works:

```bash
# Check Node.js
node -v  # Should be 18+

# Check PostgreSQL
docker ps | grep postgres  # Or: pg_isready

# Check if services start
npm run dev
```

Then visit:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

