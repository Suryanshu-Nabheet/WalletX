# Quick Fix Guide

## ✅ Extension Errors - IGNORE THEM!

Those `chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj` errors are **NOT your application errors**. They come from a browser extension (likely a password manager or ad blocker) and are completely harmless.

**Solution**: Ignore them or filter them out in Chrome DevTools:
- Click the filter icon in console
- Add filter: `-chrome-extension`

## 🔧 Backend Not Starting - FIXED!

The backend wasn't starting because:
1. ✅ Dependencies were missing → Fixed (npm install completed)
2. ✅ .env file was missing → Fixed (created)
3. ✅ Prisma client was missing → Fixed (generated)

## 🚀 Start the Application

### Option 1: Use the Start Script
```bash
# Start backend in a separate terminal
./start-backend.sh
```

### Option 2: Manual Start
```bash
# Terminal 1: Backend
cd backend
npm run start:dev

# Terminal 2: Frontend (already running)
cd frontend
npm run dev
```

### Option 3: Use Root Script
```bash
npm run dev
```

## ✅ Verify Everything Works

1. **Check Backend**: http://localhost:4000
   - Should see NestJS starting message
   - No errors in terminal

2. **Check Frontend**: http://localhost:3000
   - Should load the app
   - Ignore chrome-extension errors in console

3. **Test the App**:
   - Open http://localhost:3000
   - You should see the onboarding page
   - Create an account and wallet

## 🔍 What to Look For

### ✅ Good Signs:
- Backend terminal shows: `🚀 WalletX Backend running on http://localhost:4000`
- Frontend terminal shows: `Ready - started server on 0.0.0.0:3000`
- Browser shows your app (not 404)

### ❌ Real Errors (not extension errors):
- `Cannot find module '@walletx/shared'` → Rebuild shared package
- `ECONNREFUSED 127.0.0.1:4000` → Backend not running
- `PrismaClient is not initialized` → Run `npm run prisma:generate`
- `Failed to fetch` in Network tab → Backend issue

## 📝 Next Steps

1. **Start backend** (if not already running):
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Verify database is running**:
   ```bash
   docker compose ps | grep postgres
   # or
   docker-compose ps | grep postgres
   ```

3. **Run migrations** (if needed):
   ```bash
   cd backend
   npm run prisma:migrate
   ```

4. **Test the app**:
   - Go to http://localhost:3000
   - Sign up
   - Create wallet
   - Everything should work!

## 🎯 Summary

- ✅ Extension errors = Harmless, ignore them
- ✅ Backend setup = Fixed
- ✅ Frontend = Already running
- 🚀 Next = Start backend and test!

