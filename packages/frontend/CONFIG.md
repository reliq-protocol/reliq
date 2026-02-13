# ReliQ Frontend Configuration

## Environment Variables

The frontend uses environment variables for different deployment scenarios:

### Development (`.env`)
Used when running `bun run dev`:
- `VITE_AGENT_URL=http://localhost:3002` - Points to local agent server
- `VITE_API_URL=http://localhost:3001` - Points to local backend API

### Production (`.env.production`)
Used when building for production with `bun run build`:
- `VITE_AGENT_URL=https://your-agent-api.com` - Your deployed agent server
- `VITE_API_URL=https://your-backend-api.com` - Your deployed backend API

## Quick Start

### Development
```bash
bun install
bun run dev   # Uses .env configuration
```

### Production Build
```bash
# 1. Create .env.production with your deployed URLs
cp .env.production.example .env.production
nano .env.production  # Update URLs

# 2. Build
bun run build

# 3. Preview
bun run preview
```

## Configuration Files

- `.env` - Development environment (localhost)
- `.env.example` - Template for development setup
- `.env.production.example` - Template for production setup
- `.env.production` - Production environment (gitignored)

## Environment Variables Reference

| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `VITE_RPC_URL` | SKALE RPC endpoint | Same | Same |
| `VITE_CHAIN_ID` | Network chain ID | 103698795 | 103698795 |
| `VITE_AGENT_URL` | Agent API URL | localhost:3002 | Deployed URL |
| `VITE_API_URL` | Backend API URL | localhost:3001 | Deployed URL |
| `VITE_VAULT_CONTRACT_ADDRESS` | Smart contract address | Contract address | Contract address |
