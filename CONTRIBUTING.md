# Contributing to WalletX

Thank you for your interest in contributing to WalletX! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Follow security best practices
- Report security vulnerabilities responsibly

## Development Setup

1. **Fork and Clone**:
```bash
git clone https://github.com/yourusername/WalletX.git
cd WalletX
```

2. **Install Dependencies**:
```bash
npm install
```

3. **Set Up Environment**:
- Copy `.env.example` files to `.env` in both `backend/` and `frontend/`
- Configure database and API keys

4. **Start Development Servers**:
```bash
npm run dev
```

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

### Testing
- Write tests for new features
- Maintain >80% code coverage
- Run tests before committing:
```bash
npm run test
```

### Security
- Never commit secrets or private keys
- Follow secure coding practices
- Review security implications of changes
- Update threat model if needed

### Pull Requests

1. **Create a Branch**:
```bash
git checkout -b feature/your-feature-name
```

2. **Make Changes**:
- Write clear, focused commits
- Add tests for new functionality
- Update documentation if needed

3. **Submit PR**:
- Write a clear description
- Reference related issues
- Request review from maintainers

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Areas for Contribution

- Bug fixes
- Feature additions
- Documentation improvements
- Test coverage
- Performance optimizations
- Security enhancements

## Security Vulnerabilities

**Do NOT** open a public issue for security vulnerabilities. Instead:
1. Email security@walletx.com
2. Include detailed description
3. Wait for response before disclosure

## Questions?

Open an issue or contact maintainers.

