# Debugging Guide

## Browser Extension Errors

If you see errors like:
```
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/background.js
FrameIsBrowserFrameError
FrameDoesNotExistError
```

**These are NOT your application errors!** They come from browser extensions (password managers, ad blockers, etc.) trying to interact with pages. They're harmless and can be ignored.

### To Clean Up Console Output

1. **Disable extensions for development**:
   - Open Chrome in incognito mode (extensions are usually disabled)
   - Or create a separate Chrome profile for development

2. **Filter console errors**:
   - In Chrome DevTools, click the filter icon
   - Uncheck "Hide extension errors" or add filter: `-chrome-extension`

3. **Check for actual app errors**:
   - Look for errors from `localhost:3000` or `localhost:4000`
   - Look for errors mentioning your code files (not chrome-extension://)

## Common Application Issues

### Frontend Not Loading

**Check:**
```bash
# Is the frontend server running?
curl http://localhost:3000

# Check for errors in terminal
cd frontend
npm run dev
```

**Common fixes:**
- Port 3000 already in use: `lsof -i :3000` then kill process or change port
- Missing dependencies: `rm -rf node_modules && npm install`
- Build errors: Check terminal output for specific errors

### Backend Not Responding

**Check:**
```bash
# Is the backend server running?
curl http://localhost:4000/api/auth/login

# Check backend logs
cd backend
npm run start:dev
```

**Common fixes:**
- Port 4000 already in use
- Database connection issues (check DATABASE_URL in .env)
- Missing Prisma client: `npm run prisma:generate`

### Database Connection Errors

**Check:**
```bash
# Is PostgreSQL running?
docker ps | grep postgres
# or
pg_isready

# Can you connect?
psql -h localhost -U walletx -d walletx
```

**Common fixes:**
- Start PostgreSQL: `docker compose up -d postgres`
- Check DATABASE_URL in backend/.env
- Run migrations: `cd backend && npm run prisma:migrate`

### Module Not Found Errors

**Check:**
```bash
# Is shared package built?
ls shared/dist

# Rebuild if needed
cd shared && npm run build && cd ..
```

### React/Next.js Errors

**Check browser console for:**
- Actual error messages (not extension errors)
- Network requests failing (check Network tab)
- Component errors (check React DevTools)

**Common fixes:**
- Clear .next cache: `rm -rf frontend/.next`
- Reinstall: `cd frontend && rm -rf node_modules && npm install`
- Check for TypeScript errors: `cd frontend && npm run build`

## Verifying Application Works

### 1. Check Backend Health

```bash
curl http://localhost:4000/api/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

Should return an error (user doesn't exist) but confirms backend is working.

### 2. Check Frontend

Open http://localhost:3000 in browser:
- Should see the app (not 404)
- Check Network tab for successful API calls
- Look for actual application errors (not extension errors)

### 3. Test Full Flow

1. Open http://localhost:3000
2. Click "Sign Up" or navigate to onboarding
3. Create account
4. Create wallet
5. Check console for YOUR application errors (not extension errors)

## Real Application Errors to Watch For

These ARE your application errors:

```
❌ Error: Cannot find module '@walletx/shared'
❌ Error: connect ECONNREFUSED 127.0.0.1:4000
❌ Error: PrismaClient is not initialized
❌ TypeError: Cannot read property 'address' of undefined
❌ Error: Failed to fetch (from your API calls)
```

## Debugging Tools

### Chrome DevTools
- **Console**: Filter out extension errors
- **Network**: Check API calls to localhost:4000
- **Application**: Check localStorage, cookies
- **Sources**: Set breakpoints in your code

### Terminal Logs
- **Backend**: Check NestJS logs for errors
- **Frontend**: Check Next.js compilation errors
- **Database**: Check PostgreSQL logs

### Useful Commands

```bash
# Check if ports are in use
lsof -i :3000
lsof -i :4000

# Check if services are running
ps aux | grep node
docker ps

# Check logs
docker logs walletx-postgres
```

## Getting Help

If you encounter actual application errors:

1. **Check the error message** - Is it from your code or an extension?
2. **Check the terminal** - Backend/frontend logs show real errors
3. **Check Network tab** - Are API calls succeeding?
4. **Check browser console** - Filter out extension errors first

For extension errors: **Ignore them** - they don't affect your app!

