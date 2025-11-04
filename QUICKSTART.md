# WalletX Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- npm or yarn package manager

## Quick Setup

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install workspace dependencies
cd shared && npm install && cd ..
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 2. Database Setup

```bash
# Start PostgreSQL (if using Docker)
docker-compose up -d postgres

# Or use your existing PostgreSQL instance
# Create database
createdb walletx

# Run migrations
cd backend
npm run prisma:migrate
npm run prisma:generate
cd ..
```

### 3. Environment Configuration

**Backend** (`backend/.env`):
```bash
DATABASE_URL="postgresql://walletx:walletx_dev_password@localhost:5432/walletx?schema=public"
JWT_SECRET=your-secret-key-change-this
JWT_REFRESH_SECRET=your-refresh-secret-change-this
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 4. Start Development Servers

```bash
# From root directory
npm run dev
```

This will start:
- Backend API on http://localhost:4000
- Frontend on http://localhost:3000

## First Steps

1. **Open Browser**: Navigate to http://localhost:3000
2. **Sign Up**: Create a new account
3. **Create Wallet**: 
   - Generate a recovery phrase (12 words)
   - Back up the phrase securely
   - Create a passphrase to encrypt your wallet
4. **Start Using**: View balances, send transactions, swap tokens

## Testing

### Backend Tests
```bash
cd backend
npm run test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## Common Issues

### Database Connection Error
- Verify PostgreSQL is running
- Check DATABASE_URL in `backend/.env`
- Ensure database exists: `createdb walletx`

### Port Already in Use
- Change PORT in `backend/.env`
- Change Next.js port: `npm run dev -- -p 3001`

### Module Not Found
- Run `npm install` in the workspace
- Rebuild: `npm run build`

## Next Steps

- Read [Architecture Documentation](./docs/architecture.md)
- Review [Security Guidelines](./docs/threat-model.md)
- Check [Deployment Guide](./docs/deployment.md)

## Support

For issues, check:
- [GitHub Issues](https://github.com/yourusername/WalletX/issues)
- [Documentation](./docs/)
- [Contributing Guide](./CONTRIBUTING.md)

