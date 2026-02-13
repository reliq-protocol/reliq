# ReliQ Test Suite

TypeScript-based test suite for the ReliQ smart contract with BITE protocol integration.

## Overview

This test suite demonstrates the complete ReliQ protocol workflow:

1. **Step 1**: Create vault with BITE-encrypted payload (0.0001 ETH)
2. **Step 2**: Query vault details from contract
3. **Step 3**: Send heartbeat response with EIP-712 signature
4. **Step 4**: Check trigger status and trigger vault if timeout reached

## Features

- ✅ **BITE SDK Integration**: Real encryption using `@skalenetwork/bite`
- ✅ **Comprehensive Logging**: Each step logs input, output, and transaction hash
- ✅ **Small Amounts**: Uses 0.0001 ETH to preserve test tokens
- ✅ **EIP-712 Signatures**: Proper heartbeat signature generation
- ✅ **TypeScript**: Full type safety and modern development

## Installation

```bash
cd test-suite
npm install
```

## Usage

### Run Full Test Suite

```bash
npm test
```

This runs all 4 steps in sequence and generates a comprehensive report.

### Run Individual Steps

```bash
# Step 1: Create vault
npm run test:step1

# Step 2: Check vault
npm run test:step2

# Step 3: Send heartbeat
npm run test:step3

# Step 4: Trigger vault
npm run test:step4
```

## Test Results

All test results are saved to `test-results/session_<timestamp>/`:

```
test-results/
└── session_2026-02-14_01-10-00/
    ├── step_1.log          # Human-readable log
    ├── step_1.json         # Machine-readable JSON
    ├── step_1_input.txt    # Detailed input
    ├── step_1_output.txt   # Detailed output
    ├── step_2.log
    ├── step_2.json
    ├── ...
    ├── vault_id.txt        # Generated vault ID
    └── session_id.txt      # Session identifier
```

Each log file contains:
- Transaction hash
- Explorer link
- Input parameters
- Output results
- Gas usage
- Timestamps

## Example Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1: Create Vault with BITE Encryption
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Deployer: 0x9554CEb8aEAA4bDEc5b088ec980254d6a2Da3c72
Contract: 0xEaBEA691f021691d2da93dBC00826B6a7D060cF6
Amount: 0.0001 ETH

Vault payload: {
  beneficiary: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  amount: '100000000000000',
  message: 'This is a test vault...'
}

🔐 Encrypting payload with BITE...
Encrypted payload: 0x89a3c4f2...

📤 Submitting transaction...
Transaction hash: 0xabc123...

✅ Transaction confirmed!
Created vault ID: 0
```

## Network Configuration

- **Network**: SKALE Base Sepolia
- **Contract**: `0xEaBEA691f021691d2da93dBC00826B6a7D060cF6`
- **RPC URL**: `https://base-sepolia-testnet.skalenodes.com/v1/bite-v2-sandbox`
- **Explorer**: https://base-sepolia-testnet-explorer.skalenodes.com:10032/
