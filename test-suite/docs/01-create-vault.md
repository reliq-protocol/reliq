# 01 - Create Vault

## 操作描述

使用 BITE SDK 加密 vault payload 並創建新的 vault，存入 0.0001 ETH 作為測試金額。

## 執行時間

2026-02-13 17:18:41

## 交易詳情

- **Transaction Hash**: `0x6868b6f12ca6603a848f5ec4a9f5ef230b5fa5c7555610fc878721b86c82b528`
- **Block**: 875852
- **Gas Used**: 463,240
- **Status**: ✅ Success

## Explorer

https://base-sepolia-testnet-explorer.skalenodes.com/tx/0x6868b6f12ca6603a848f5ec4a9f5ef230b5fa5c7555610fc878721b86c82b528

## 輸入參數

### 函數
```solidity
createVault(bytes encryptedPayload, uint256 timeout) payable
```

### 參數

- **encryptedPayload**: BITE 加密後的 payload
  ```
  0xf901d580b901d10103c8e482f36f1cb51958f55697889766c8ceacf0d486a91b...
  ```

- **timeout**: `300` 秒（5 分鐘，用於測試）

- **value**: `100000000000000` wei (0.0001 ETH)

### 原始 Payload (加密前)

```json
{
  "beneficiary": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "amount": "100000000000000",
  "message": "This is a test vault. If you receive this, the vault was successfully triggered!"
}
```

### Payload Hex (加密前)

```
0x7b2262656e6566696369617279223a22307837343264333543633636333443303533323932356133623834344263343534653434333866343465222c22616d6f756e74223a22313030303030303030303030303030222c226d657373616765223a225468697320697320612074657374207661756c742e20496620796f75207265636569766520746869732c20746865207661756c7420776173207375636365737366756c6c792074726967676572656421227d
```

## 輸出結果

```json
{
  "vaultId": "0",
  "totalVaults": "1",
  "blockNumber": 875852,
  "gasUsed": "463240",
  "status": "success"
}
```

## 創建的 Vault

- **Vault ID**: `0`
- **Owner**: `0x9554CEb8aEAA4bDEc5b088ec980254d6a2Da3c72`
- **Amount**: 0.0001 ETH
- **Timeout**: 300 seconds (5 minutes)
- **Beneficiary** (加密在 payload 中): `0x742d35Cc6634C0532925a3b844Bc454e4438f44e`

## BITE 加密

✅ **成功使用 BITE SDK 加密 payload**

原始 payload 使用 BITE threshold encryption 加密，確保只有在 vault 觸發後才能解密內容。這確保了受益人地址和訊息的隱私性。

## 測試通過

✅ Vault 創建成功
✅ BITE 加密正常運作
✅ 金額正確存入合約 (0.0001 ETH)
✅ Vault ID 正確分配 (ID: 0)
