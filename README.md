# Reliq - Privacy-First Digital Inheritance

Modern monorepo structure for the Reliq protocol - privacy-first digital inheritance using BITE encryption on SKALE.

## Project Structure

```
reliq/
├── packages/
│   ├── contracts/          # Smart contracts (Foundry)
│   ├── backend/            # Backend API (Node.js/Express)
│   └── frontend/           # Frontend app (React/Vite)
├── test-suite/             # Integration tests
├── docs/                   # Documentation
└── package.json            # Root workspace configuration
```

## Quick Start

```bash
# Install all dependencies
npm install

# Build contracts
npm run contracts:build

# Run backend
npm run backend:dev

# Run frontend
npm run frontend:dev

# Run tests
npm run test
```

## Packages

### @reliq/contracts
Solidity smart contracts deployed on SKALE Base Sepolia.

### @reliq/backend
TypeScript backend with BITE SDK integration, SIWE auth, and vault management.

### @reliq/frontend
React frontend with wallet connect and vault creation UI.

## Network

- **Deployed Contract**: `0x2277f5210daAaab3E26e565c96E5F9BeDb46662B`
- **Network**: SKALE Base Sepolia
- **Chain ID**: 324705682
- **Explorer**: https://base-sepolia-testnet-explorer.skalenodes.com/

## Documentation

See [docs/](./docs/) for detailed documentation:
- [DESIGN.md](./docs/DESIGN.md) - System architecture
- [DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Deployment guide
- [NETWORK.md](./docs/NETWORK.md) - Network configuration

## Testing

```bash
# Run full test suite
cd test-suite && npm test

# Run individual tests
npm run test:01  # Create vault
npm run test:02  # Check vault
npm run test:03  # Heartbeat
npm run test:04  # Trigger vault
npm run test:05  # Complete workflow demo
```

## License

MIT
