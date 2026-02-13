# SKALE Base Sepolia Testnet - Network Information

## Network Details
- **Network Name**: SKALE Base Sepolia
- **RPC URL**: `https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha`
- **Chain ID**: `324705682`
- **Chain ID (Hex)**: `0x135A9D92`
- **Block Explorer**: https://base-sepolia-testnet-explorer.skalenodes.com/
- **Faucet**: https://base-sepolia-faucet.skale.space

## Wallet Information
- **Address**: `0x9554CEb8aEAA4bDEc5b088ec980254d6a2Da3c72`
- **Private Key**: Stored in `.env` files (DO NOT COMMIT)

## Getting Test Tokens
Visit the faucet to get test ETH for deployment:
```
https://base-sepolia-faucet.skale.space
```

## Adding Network to MetaMask
```json
{
  "chainId": "0x135A9D92",
  "chainName": "SKALE Base Sepolia",
  "rpcUrls": ["https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha"],
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "blockExplorerUrls": ["https://base-sepolia-testnet-explorer.skalenodes.com/"]
}
```

## Configuration Files Updated
- ✅ `backend/.env`
- ✅ `frontend/.env`  
- ✅ `contracts/.env`
