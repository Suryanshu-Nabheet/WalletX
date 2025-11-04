# WalletX Deployment Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- AWS Account (for KMS - custodial mode)
- Docker (optional, for containerized deployment)
- Domain with SSL certificate

## Environment Setup

### Backend Environment Variables

Create `backend/.env`:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/walletx?schema=public"

# JWT
JWT_SECRET=<generate-strong-random-secret>
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=<generate-strong-random-secret>
JWT_REFRESH_EXPIRES_IN=7d

# OAuth (optional)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# AWS KMS (for custodial mode)
AWS_REGION=us-east-1
AWS_KMS_KEY_ID=<your-kms-key-id>
AWS_ACCESS_KEY_ID=<your-aws-access-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-key>

# RPC Providers
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR-API-KEY
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR-API-KEY
ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/YOUR-API-KEY

# Swap Aggregators
ZEROX_API_KEY=<your-0x-api-key>
ONEINCH_API_KEY=<your-1inch-api-key>

# Security
CORS_ORIGIN=https://walletx.com
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# Monitoring
SENTRY_DSN=<your-sentry-dsn>
ENVIRONMENT=production

# App
PORT=4000
NODE_ENV=production
```

### Frontend Environment Variables

Create `frontend/.env.production`:

```bash
NEXT_PUBLIC_API_URL=https://api.walletx.com
```

## Database Setup

1. **Create PostgreSQL Database**:
```bash
createdb walletx
```

2. **Run Migrations**:
```bash
cd backend
npm run prisma:migrate
```

3. **Generate Prisma Client**:
```bash
npm run prisma:generate
```

## AWS KMS Setup (Custodial Mode)

1. **Create KMS Key**:
```bash
aws kms create-key --description "WalletX Custodial Wallet Encryption"
```

2. **Create Alias**:
```bash
aws kms create-alias --alias-name alias/walletx-custodial --target-key-id <key-id>
```

3. **Configure IAM Policy**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "kms:Encrypt",
        "kms:Decrypt",
        "kms:GenerateDataKey"
      ],
      "Resource": "arn:aws:kms:us-east-1:ACCOUNT:key/KEY-ID"
    }
  ]
}
```

## Build Process

### Backend

```bash
cd backend
npm install
npm run build
```

### Frontend

```bash
cd frontend
npm install
npm run build
```

## Deployment Options

### Option 1: Vercel (Frontend) + AWS (Backend)

#### Frontend (Vercel)
1. Connect GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

#### Backend (AWS ECS/EC2)
1. **Build Docker Image**:
```bash
docker build -t walletx-backend ./backend
```

2. **Push to ECR**:
```bash
aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker tag walletx-backend:latest <account>.dkr.ecr.us-east-1.amazonaws.com/walletx-backend:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/walletx-backend:latest
```

3. **Deploy to ECS**:
- Create ECS task definition
- Configure RDS database connection
- Set environment variables
- Deploy service

### Option 2: Docker Compose (All-in-One)

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: walletx
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: walletx
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      DATABASE_URL: postgresql://walletx:${POSTGRES_PASSWORD}@postgres:5432/walletx
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://backend:4000
    depends_on:
      - backend
```

## Security Checklist

- [ ] SSL/TLS certificates configured
- [ ] Environment variables secured (not in git)
- [ ] Database credentials rotated
- [ ] JWT secrets are strong random values
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] WAF rules configured
- [ ] KMS keys properly secured
- [ ] Audit logging enabled
- [ ] Monitoring/alerting setup
- [ ] Backup strategy in place
- [ ] Disaster recovery plan documented

## Monitoring

### Sentry Setup
1. Create Sentry project
2. Add DSN to environment variables
3. Configure error tracking

### Logging
- Use structured logging (Winston/Pino)
- Centralized logging (CloudWatch/DataDog)
- Log retention: 90 days

### Metrics
- API response times
- Error rates
- Active users
- Transaction volumes

## Backup & Recovery

### Database Backups
```bash
# Daily automated backups
pg_dump walletx > backup-$(date +%Y%m%d).sql

# Restore
psql walletx < backup-20240101.sql
```

### KMS Key Backup
- Use AWS KMS key rotation
- Maintain key version history
- Document key recovery procedures

## Post-Deployment

1. **Verify Health Checks**:
   - Frontend: `https://walletx.com/health`
   - Backend: `https://api.walletx.com/health`

2. **Test Critical Flows**:
   - User registration
   - Wallet creation
   - Transaction signing
   - Swap execution

3. **Monitor**:
   - Error rates
   - Response times
   - User activity

4. **Security Audit**:
   - Run penetration tests
   - Review audit logs
   - Check for vulnerabilities

## Scaling

### Horizontal Scaling
- Load balancer for backend
- Multiple backend instances
- Database read replicas

### Caching
- Redis for session storage
- CDN for frontend assets
- API response caching

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check DATABASE_URL
   - Verify network access
   - Check PostgreSQL logs

2. **KMS Errors**
   - Verify IAM permissions
   - Check AWS region
   - Review KMS key policy

3. **CORS Errors**
   - Verify CORS_ORIGIN setting
   - Check frontend URL matches

4. **Rate Limiting**
   - Adjust RATE_LIMIT_MAX
   - Check for DDoS attacks

## Support

For deployment issues, contact:
- DevOps Team: devops@walletx.com
- Security Team: security@walletx.com

