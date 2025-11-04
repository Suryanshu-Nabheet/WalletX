# WalletX Architecture

## System Overview

WalletX is a secure Web3 wallet application with support for non-custodial and custodial key management modes. The system consists of:

- **Frontend**: Next.js React application
- **Backend**: NestJS REST API
- **Database**: PostgreSQL
- **KMS**: AWS KMS (for custodial mode)
- **Blockchain**: Multiple EVM-compatible chains

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Next.js Frontend (React)                 │  │
│  │  - Wallet UI                                    │  │
│  │  - Client-side encryption (WebCrypto)           │  │
│  │  - ethers.js for signing                        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────┐
│              NestJS Backend API                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │   Auth   │  │ Wallets  │  │  Swap    │              │
│  │  Module  │  │  Module  │  │  Module  │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │Transactions│ │  Admin  │  │  Audit   │              │
│  │  Module    │ │  Module │  │  Module  │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  PostgreSQL  │      │   AWS KMS    │      │  RPC Nodes   │
│   Database   │      │ (Custodial)  │      │ (Alchemy/    │
│              │      │              │      │  Infura)     │
└──────────────┘      └──────────────┘      └──────────────┘
```

## Data Flow

### Non-Custodial Wallet Creation

1. User signs up → Backend creates user account
2. Frontend generates mnemonic (client-side)
3. User enters passphrase
4. Frontend encrypts mnemonic with passphrase (AES-256-GCM)
5. Frontend derives wallet address from mnemonic
6. Frontend sends encrypted blob + address to backend
7. Backend stores encrypted blob (never sees plaintext)
8. User unlocks wallet by decrypting blob locally

### Custodial Wallet Creation

1. User opts in to custodial mode
2. Backend generates wallet (ethers.js)
3. Backend encrypts private key with KMS
4. Backend stores KMS key ID (not the key itself)
5. User signs transactions → Backend decrypts with KMS and signs

### Transaction Flow (Non-Custodial)

1. User initiates transaction
2. Frontend builds transaction payload
3. Frontend signs with private key (ethers.js)
4. Frontend sends signed transaction to backend
5. Backend broadcasts to blockchain
6. Backend returns transaction hash

### Swap Flow

1. User selects tokens and amount
2. Frontend requests quote from backend
3. Backend queries 0x/1inch API
4. Backend returns quote + transaction data
5. Frontend signs transaction (non-custodial) or backend signs (custodial)
6. Transaction broadcasted to blockchain

## Security Layers

### 1. Client-Side Security
- **Encryption**: AES-256-GCM with PBKDF2 key derivation
- **Key Storage**: Private keys never stored in localStorage
- **CSP**: Content Security Policy prevents XSS
- **WebCrypto**: Native browser crypto API

### 2. Transport Security
- **TLS**: All traffic encrypted in transit
- **HSTS**: HTTP Strict Transport Security
- **Secure Cookies**: HTTP-only, SameSite cookies

### 3. Server-Side Security
- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based access control
- **Rate Limiting**: Prevent abuse
- **Input Validation**: All inputs validated
- **SQL Injection**: Prisma ORM prevents injection

### 4. Key Management
- **Non-Custodial**: Keys encrypted client-side, server never sees plaintext
- **Custodial**: Keys stored in AWS KMS, never in database
- **HSM**: Hardware security modules for KMS

## Database Schema

### Users Table
- `id`: Primary key
- `email`: Unique email
- `passwordHash`: Bcrypt hash
- `twoFaEnabled`: Boolean
- `oauthProvider`: OAuth provider name
- `createdAt`, `updatedAt`: Timestamps

### Wallets Table
- `id`: Primary key
- `userId`: Foreign key to users
- `chain`: Blockchain name
- `address`: Wallet address
- `encryptedBlob`: JSON (non-custodial only)
- `mode`: 'noncustodial' | 'custodial'
- `kmsKeyId`: KMS key ID (custodial only)

### Sessions Table
- `id`: Primary key
- `userId`: Foreign key to users
- `refreshTokenHash`: Bcrypt hash
- `expiresAt`: Expiration timestamp
- `ip`, `userAgent`: Session metadata

### Audit Logs Table
- `id`: Primary key
- `userId`: Foreign key to users
- `action`: Action name (e.g., 'wallet.created')
- `meta`: JSON metadata
- `ip`, `userAgent`: Request metadata
- `createdAt`: Timestamp

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

### Wallets
- `POST /api/wallet/create` - Create wallet
- `GET /api/wallet` - List wallets
- `GET /api/wallet/:id` - Get wallet
- `GET /api/wallet/:id/export` - Export encrypted blob
- `PUT /api/wallet/:id` - Update wallet
- `DELETE /api/wallet/:id` - Delete wallet

### Transactions
- `GET /api/tx/balances` - Get balance
- `GET /api/tx/token-balances` - Get token balances
- `POST /api/tx/send` - Send transaction
- `GET /api/tx/status/:hash` - Get transaction status

### Swap
- `POST /api/swap/quote` - Get swap quote
- `POST /api/swap/execute` - Execute swap

### Admin
- `GET /api/admin/users` - List users
- `GET /api/admin/users/:id/audit-logs` - Get audit logs
- `GET /api/admin/users/:id/wallets` - Get user wallets

## Technology Stack

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Data Fetching**: SWR
- **Web3**: ethers.js v6
- **Crypto**: WebCrypto API, bip39

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: Passport.js (JWT, Local, OAuth)
- **Validation**: class-validator
- **Rate Limiting**: @nestjs/throttler
- **Web3**: ethers.js v6

### Infrastructure
- **Database**: PostgreSQL (RDS or self-hosted)
- **KMS**: AWS KMS / GCP KMS
- **RPC**: Alchemy / Infura / QuickNode
- **Monitoring**: Sentry
- **Deployment**: Vercel (frontend), AWS/GCP (backend)

## Scalability Considerations

### Horizontal Scaling
- Stateless backend API (can run multiple instances)
- Load balancer for traffic distribution
- Database connection pooling
- Redis for session storage (optional)

### Caching
- API response caching (Redis)
- CDN for static assets
- RPC response caching

### Database Optimization
- Indexes on frequently queried columns
- Read replicas for read-heavy operations
- Connection pooling

## Monitoring & Observability

### Metrics
- API response times
- Error rates
- Active users
- Transaction volumes
- Database query performance

### Logging
- Structured logging (JSON)
- Centralized log aggregation
- Log retention: 90 days

### Alerting
- Error rate thresholds
- Response time thresholds
- Unusual activity detection
- KMS operation alerts

## Future Enhancements

1. **Multi-chain Support**: Add Solana, Cosmos, etc.
2. **Hardware Wallet**: Ledger/Trezor integration
3. **Social Recovery**: Shamir's Secret Sharing
4. **Gas Abstraction**: Meta-transactions / paymasters
5. **Mobile App**: React Native version
6. **Advanced Trading**: Limit orders, DCA
7. **NFT Support**: Full NFT management

