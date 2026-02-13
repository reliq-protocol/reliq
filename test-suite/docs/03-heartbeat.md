# 03 - Send Heartbeat Response

## 操作描述

使用 EIP-712 簽署 heartbeat 消息，通過 agent 中繼提交到合約，更新 vault 的最後響應時間。

## 執行時間

2026-02-13 17:22:39

## 交易詳情

- **Transaction Hash**: `0x77c9fb080b326173af25a94458f6afeb35b194a9450ac3e059b779dfe7aac13c`
- **Block**: 875865
- **Gas Used**: 61,807
- **Status**: ✅ Success

## Explorer

https://base-sepolia-testnet-explorer.skalenodes.com:10032/tx/0x77c9fb080b326173af25a94458f6afeb35b194a9450ac3e059b779dfe7aac13c

## 輸入參數

###函數
```solidity
respondViaAgent(uint256 vaultId, uint256 timestamp, uint256 nonce, bytes signature)
```

### 參數

- **vaultId**: `0`
- **timestamp**: `1771003259`
- **nonce**: `357030` (隨機生成)
- **signature**: `0xe1b03891cac57f5241054c933eed9599032c64ead6944564b148b2552d4d84700ccdf321d7671f99d666dc7ccff50ed45cc0f88ff205446323fd2806fb6364a21c`

## EIP-712 簽名詳情

### Domain

```json
{
  "name": "ReliQ",
  "version": "1",
  "chainId": 103698795,
  "verifyingContract": "0xEaBEA691f021691d2da93dBC00826B6a7D060cF6"
}
```

### Type Hash

```
0x64b69b4e3bb3e2dc7670f23ca449710dad1fe4af066b05c5123111b18e93dbaf
```

### Struct Hash

```
keccak256(abi.encode(HEARTBEAT_TYPEHASH, vaultId, timestamp, nonce))
= 0x803d5170ec5ce7027d9259f02c8ef83f7d6ee8dab27e392a5bb7c5378f571838
```

### Digest

```
keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, structHash))
= 0xd2337704920054340bc23aaa9f2ee412b3b620ef8f9f19499291fa0bc7ed87ac
```

### Domain Separator

```
0xa679c7f8dda7d587c1def8fcb57982d517370d7d1fbd7806af8fe23100043897
```

## 輸出結果

```json
{
  "blockNumber": 875865,
  "gasUsed": "61807",
  "status": "success"
}
```

## 效果

✅ **更新 vault 最後響應時間**
- Vault ID 0 的 `lastResponse` 更新為當前區塊時間
- Nonce 357030 被標記為已使用，防止重放攻擊
- Timeout 計時器重置，需要再過 300 秒才能觸發 vault

## EIP-712 簽名驗證

1. **合約驗證簽名者身份**: 通過 `ecrecover` 從簽名中恢復地址
2. **檢查是 vault owner**: 簽名者必須是 vault 的擁有者
3. **防重放攻擊**: Nonce 機制確保每個簽名只能使用一次
4. **Gas 優化**: Owner 不需要支付 gas，由 agent 代付

## 測試通過

✅ EIP-712 簽名生成正確
✅ Agent 成功中繼交易
✅ 合約正確驗證簽名
✅ Vault lastResponse 更新成功
✅ Nonce 防重放機制正常
✅ Gas 成本低 (61,807 gas)
