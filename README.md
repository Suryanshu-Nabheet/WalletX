# WalletX - Secure Web3 Wallet

A secure, user-friendly web3 wallet web app inspired by Backpack, featuring non-custodial and optional custodial key management, multi-chain support, and integrated token swapping.

## 🚀 Features

- **Authentication**: Email/password, OAuth (Google/Apple), WebAuthn (passkeys)
- **Key Management**: Non-custodial (default) with client-side encryption, optional custodial mode with KMS
- **Multi-chain**: EVM-compatible chains (Ethereum, Polygon, Arbitrum, etc.)
- **Trading**: Integrated swap aggregator (0x/1inch) for token swaps
- **Security**: 2FA (TOTP), session management, audit logging, security center
- **Hardware Wallet**: Ledger/Trezor support via WalletConnect

## 📁 Project Structure

```
WalletX/
├── frontend/          # Next.js frontend application
├── backend/           # NestJS backend API
├── shared/            # Shared TypeScript types and utilities
└── docs/              # Documentation (architecture, threat model, etc.)
```

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (React + TypeScript)
- Tailwind CSS
- Zustand (state management)
- SWR (data fetching)
- ethers.js (Web3 operations)

### Backend
- NestJS (Node.js + TypeScript)
- PostgreSQL
- Prisma ORM
- AWS KMS / GCP KMS (for custodial mode)
- JWT + Refresh tokens

### Security
- AES-256-GCM encryption (client-side)
- Argon2id key derivation
- WebAuthn / FIDO2
- Rate limiting, WAF, CSP

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Docker (optional, for local development)

### Installation

1. Clone and install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

3. Start PostgreSQL database:
```bash
docker-compose up -d postgres
```

4. Run database migrations:
```bash
cd backend && npm run prisma:migrate
```

5. Start development servers:
```bash
npm run dev
```

Frontend: http://localhost:3000
Backend API: http://localhost:4000

## 📖 Documentation

- [Architecture Overview](./docs/architecture.md)
- [Threat Model & Security](./docs/threat-model.md)
- [Deployment Guide](./docs/deployment.md)
- [API Documentation](./docs/api.md)

## 🔒 Security

- **Zero-knowledge**: Server never sees plaintext private keys for non-custodial users
- **Encryption**: AES-256-GCM with Argon2id key derivation
- **KMS**: AWS KMS / GCP KMS for custodial key storage
- **Audit Logging**: All sensitive operations logged
- **Pen Testing**: Required before production launch

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run backend tests
npm run test:backend

# Run frontend tests
npm run test:frontend

# E2E tests with Hardhat fork
cd backend && npm run test:e2e
```

## 📝 License

MIT

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

**⚠️ Security Notice**: This is production-ready code. Always conduct security audits before deploying to production.

