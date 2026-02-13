# Reliq Test Suite

Integration tests for the Reliq protocol using TypeScript, ethers.js, and BITE SDK.

## Structure

```
test-suite/
├── tests/                  # Test scripts
│   ├── 01-create-vault.ts
│   ├── 02-check-vault.ts
│   ├── 03-heartbeat.ts
│   ├── 04-trigger-vault.ts
│   ├── 05-complete-workflow-demo.ts
│   └── run-all-tests.ts
├── docs/                   # Test documentation & reports
│   ├── 01-create-vault.md
│   ├── 02-check-vault.md
│   ├── 03-heartbeat.md
│   ├── 04-trigger-vault.md
│   ├── 05-complete-workflow-demo.md
│   ├── README.md
│   └── TEST-SUMMARY.md
├── logs/                   # Execution logs
├── test-results/           # Detailed JSON results
├── utils.ts                # Test utilities
├── package.json
└── tsconfig.json
```

## Quick Start

```bash
# Install dependencies
npm install

# Run individual tests
npm run test:01    # Create vault
npm run test:02    # Check vault
npm run test:03    # Heartbeat
npm run test:04    # Trigger vault  
npm run test:05    # Complete workflow demo

# Run all tests
npm run test:all
```

## Test Documentation

All test execution details are documented in `docs/`:
- Input parameters
- Transaction hashes
- Gas usage
- Explorer links
- Output results

## Test Results

Results are saved to `test-results/session_<timestamp>/`:
- `step_X.json` - Machine-readable results
- `step_X.log` - Detailed execution logs

## Features

✅ BITE encryption integration  
✅ EIP-712 signature testing  
✅ Complete workflow coverage  
✅ Detailed logging and reporting  
✅ Gas tracking
