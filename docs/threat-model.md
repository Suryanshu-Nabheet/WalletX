# WalletX Threat Model

## Overview
This document outlines the threat model for WalletX, a secure Web3 wallet application. It identifies potential threats, attack vectors, and mitigation strategies.

## Assets

### High Value Assets
1. **Private Keys (Non-Custodial)**: Encrypted mnemonic/private keys stored on server
2. **Private Keys (Custodial)**: Keys stored in KMS
3. **User Credentials**: Email/password, OAuth tokens
4. **Session Tokens**: JWT access/refresh tokens
5. **User Funds**: Cryptocurrency balances in wallets

### Medium Value Assets
1. **User PII**: Email addresses, login history
2. **Audit Logs**: User activity logs
3. **Transaction History**: On-chain transaction records

## Threat Actors

### External Attackers
- **Script Kiddies**: Low-skill attackers using automated tools
- **Sophisticated Attackers**: Advanced persistent threats (APTs)
- **Phishing Actors**: Social engineering attacks
- **Malicious Insiders**: Compromised team members

### Attack Vectors

#### 1. Client-Side Attacks
**Threat**: Browser-based attacks, XSS, malicious extensions
- **Risk**: High - Could steal private keys or session tokens
- **Mitigation**:
  - Content Security Policy (CSP)
  - Subresource Integrity (SRI)
  - Secure WebCrypto API usage
  - Never store plaintext private keys in localStorage
  - SameSite cookies for session management

#### 2. Server-Side Attacks
**Threat**: SQL injection, authentication bypass, API abuse
- **Risk**: High - Could compromise user accounts or encrypted data
- **Mitigation**:
  - Parameterized queries (Prisma)
  - Rate limiting (Throttler)
  - Input validation (class-validator)
  - RBAC for admin endpoints
  - WAF rules

#### 3. Network Attacks
**Threat**: Man-in-the-middle, DNS hijacking, TLS downgrade
- **Risk**: Medium - Could intercept traffic
- **Mitigation**:
  - TLS 1.2+ only
  - HSTS headers
  - Certificate pinning (mobile apps)
  - Secure cookie flags

#### 4. Key Management Attacks
**Threat**: Encryption key compromise, KMS breaches
- **Risk**: Critical - Could decrypt all user wallets
- **Mitigation**:
  - Never store plaintext keys on server
  - KMS with hardware security modules
  - Key rotation policies
  - Separation of concerns (non-custodial vs custodial)

#### 5. Phishing Attacks
**Threat**: Fake domains, social engineering
- **Risk**: High - Users could enter credentials on fake sites
- **Mitigation**:
  - Domain verification warnings
  - Educational content
  - Multi-factor authentication
  - Transaction confirmations for large amounts

## Attack Scenarios

### Scenario 1: XSS Attack Steals Private Key
**Attack**: Attacker injects malicious script that reads private key from memory
**Mitigation**: 
- CSP prevents inline scripts
- Private keys only in memory, never in DOM
- Secure WebCrypto usage

### Scenario 2: Database Breach
**Attack**: Attacker gains access to database
**Impact**: 
- Non-custodial: Encrypted blobs exposed (still encrypted with user passphrase)
- Custodial: KMS key IDs exposed (keys still in KMS)
**Mitigation**:
- Encrypted blobs require user passphrase to decrypt
- KMS keys never stored in database
- Database encryption at rest

### Scenario 3: Session Hijacking
**Attack**: Attacker steals JWT token
**Mitigation**:
- Short-lived access tokens (15 minutes)
- Refresh tokens in HTTP-only cookies
- Token rotation on refresh
- IP/User-Agent validation

### Scenario 4: KMS Compromise
**Attack**: Attacker gains access to KMS
**Impact**: Could decrypt custodial wallets
**Mitigation**:
- KMS access requires IAM roles
- Audit logging of KMS operations
- Multi-signature for key operations
- Regular key rotation

## Security Controls

### Authentication
- Strong password requirements (min 8 chars)
- Bcrypt hashing (12 rounds)
- OAuth 2.0 for third-party auth
- WebAuthn support (passkeys)
- Optional 2FA (TOTP)

### Authorization
- JWT-based session management
- Role-based access control (RBAC)
- Admin endpoints protected
- Rate limiting

### Encryption
- AES-256-GCM for client-side encryption
- PBKDF2 (600k iterations) for key derivation
- TLS 1.2+ for transport
- Database encryption at rest

### Monitoring
- Audit logging (all sensitive operations)
- Error tracking (Sentry)
- Rate limiting alerts
- Unusual activity detection

### Compliance
- GDPR: Right to deletion, data portability
- CCPA: User data access
- Data retention policies
- Minimal PII collection

## Residual Risks

1. **User Error**: Users losing passphrase or mnemonic
   - **Mitigation**: Backup reminders, recovery flow testing

2. **Zero-Day Vulnerabilities**: Unknown exploits in dependencies
   - **Mitigation**: Regular dependency updates, SAST/DAST scanning

3. **Social Engineering**: Users tricked into revealing credentials
   - **Mitigation**: Education, transaction confirmations, 2FA

## Penetration Testing

Before production launch:
1. **SAST**: Static Application Security Testing (Semgrep, SonarQube)
2. **DAST**: Dynamic Application Security Testing (OWASP ZAP)
3. **Third-Party Audit**: Independent security firm
4. **Bug Bounty**: Public bug bounty program

## Incident Response

1. **Detection**: Automated alerts, user reports
2. **Containment**: Isolate affected systems
3. **Investigation**: Root cause analysis
4. **Remediation**: Fix vulnerabilities
5. **Communication**: Notify affected users
6. **Post-Mortem**: Document lessons learned

## Review Schedule

- Quarterly threat model review
- Annual penetration testing
- Continuous dependency updates
- Monthly security audit log review

