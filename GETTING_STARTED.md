# Getting Started with WalletX

## Quick Start Guide

This guide will help you get WalletX up and running quickly.

### Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL 14+** - [Download](https://www.postgresql.org/download/) or use Docker
- **Docker** (Optional) - [Download](https://www.docker.com/)

### Installation Steps

#### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/Suryanshu-Nabheet/WalletX.git
cd WalletX

# Run the automated setup script
./setup.sh
```

This script will:
- Install all dependencies
- Create environment files
- Set up the database
- Generate Prisma client

#### Option 2: Manual Setup

1. **Clone the repository**:
```bash
git clone https://github.com/Suryanshu-Nabheet/WalletX.git
cd WalletX
```

2. **Install dependencies**:
```bash
# Root dependencies
npm install

# Shared package
cd shared && npm install && npm run build && cd ..

# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..
```

3. **Set up environment variables**:

**Backend** (`backend/.env`):
```bash
DATABASE_URL="postgresql://walletx:walletx_dev_password@localhost:5432/walletx?schema=public"
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

4. **Start PostgreSQL**:
```bash
# Using Docker (recommended)
docker-compose up -d postgres

# Or use your existing PostgreSQL
createdb walletx
```

5. **Run database migrations**:
```bash
cd backend
npm run prisma:migrate
npm run prisma:generate
cd ..
```

### Running the Application

#### Start All Services

```bash
# Using the run script
./run.sh

# Or manually
npm run dev
```

This starts:
- **Backend API**: http://localhost:4000
- **Frontend**: http://localhost:3000

#### Start Services Separately

**Backend**:
```bash
cd backend
npm run start:dev
```

**Frontend**:
```bash
cd frontend
npm run dev
```

### Verify Setup

Run the verification script to check if everything is set up correctly:

```bash
./verify-setup.sh
```

### First Use

1. **Open Browser**: Navigate to http://localhost:3000
2. **Sign Up**: Create a new account with email and password
3. **Create Wallet**:
   - Generate a 12-word recovery phrase
   - **IMPORTANT**: Write down and securely store your recovery phrase
   - Create a strong passphrase (minimum 8 characters)
4. **Unlock Wallet**: Enter your passphrase to unlock
5. **Start Using**: View balances, send transactions, swap tokens

### Troubleshooting

#### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps | grep postgres
# or
pg_isready

# Restart PostgreSQL
docker-compose restart postgres
```

#### Port Already in Use
```bash
# Change backend port in backend/.env
PORT=4001

# Change frontend port
cd frontend && npm run dev -- -p 3001
```

#### Module Not Found Errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Do the same for each workspace
cd shared && rm -rf node_modules && npm install && cd ..
cd backend && rm -rf node_modules && npm install && cd ..
cd frontend && rm -rf node_modules && npm install && cd ..
```

#### Prisma Issues
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

### Development Commands

```bash
# Install dependencies
npm install

# Start development servers
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Lint code
npm run lint
```

### Project Structure

```
WalletX/
├── frontend/          # Next.js frontend
│   ├── src/
│   │   ├── app/      # Next.js app router pages
│   │   ├── lib/      # Utilities (crypto, API client)
│   │   └── store/    # Zustand state management
│   └── package.json
├── backend/          # NestJS backend
│   ├── src/
│   │   ├── auth/     # Authentication module
│   │   ├── wallets/  # Wallet management
│   │   ├── transactions/ # Transaction handling
│   │   ├── swap/     # Token swap integration
│   │   └── admin/    # Admin features
│   ├── prisma/       # Database schema
│   └── package.json
├── shared/           # Shared TypeScript types
│   ├── src/
│   └── package.json
└── docs/             # Documentation
```

### Next Steps

- Read [Architecture Documentation](./docs/architecture.md)
- Review [Security Guidelines](./docs/threat-model.md)
- Check [Deployment Guide](./docs/deployment.md)
- See [Contributing Guide](./CONTRIBUTING.md)

### Support

- **GitHub Issues**: [Report an issue](https://github.com/Suryanshu-Nabheet/WalletX/issues)
- **Documentation**: See the `docs/` folder
- **Repository**: [https://github.com/Suryanshu-Nabheet/WalletX.git](https://github.com/Suryanshu-Nabheet/WalletX.git)

---

**Happy Coding! 🚀**

