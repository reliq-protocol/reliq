# ReliQ x402 Facilitator

Self-hosted x402 payment verification service for ReliQ project.

## What is a Facilitator?

The facilitator handles x402 payment verification and settlement:
- Verify on-chain payment transactions
- Settle payments to recipients
- Provide API endpoints for the agent server

## Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Environment

```bash
cp .env.example .env
nano .env  # Fill in your configuration
```

Required settings:
- `EVM_PRIVATE_KEY` - Facilitator wallet private key (needs sFUEL for gas)
- `RPC_URL_103698795` - SKALE Chaos RPC URL

### 3. Start Facilitator

```bash
# Development mode (auto-reload)
bun run dev

# Or use the convenience script
./start.sh
```

## API Endpoints

### GET `/`
Health check and service information

### POST `/verify`
Verify payment transaction
```json
{
  "transactionHash": "0x...",
  "chainId": 103698795
}
```

### POST `/settle`
Settle payment to recipient
```json
{
  "recipient": "0x...",
  "amount": "1000000",
  "tokenAddress": "0x..."
}
```

## Configuration

### Supported Networks
- SKALE Chaos Testnet (Chain ID: 103698795)

### Supported Tokens
- ReliQUSD (rUSD): `0xd3b33C51d430117F705D9930A1D7A080b1ee839d`

## Tech Stack

- TypeScript
- Express.js
- ethers.js v6
- Bun runtime
- SKALE Network

## Important Notes

⚠️ The facilitator wallet needs sufficient sFUEL to pay for gas fees
