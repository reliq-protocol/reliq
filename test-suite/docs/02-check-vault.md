# 02 - Check Vault Details

## 操作描述

查詢剛創建的 vault (ID: 0) 的詳細信息，包括 owner、最後響應時間、timeout、金額等。

## 執行時間

2026-02-13 17:19:35

## 查詢類型

只讀查詢（view function），不產生交易

## 輸入參數

### 函數
```solidity
getVault(uint256 vaultId) view returns (address owner, uint256 lastResponse, uint256 timeout, uint256 amount, bool executed)
canTrigger(uint256 vaultId) view returns (bool)
```

### 參數

- **vaultId**: `0`

## 輸出結果

### Vault 詳情

```json
{
  "owner": "0x9554CEb8aEAA4bDEc5b088ec980254d6a2Da3c72",
  "lastResponse": "1739462324",
  "lastResponseDate": "2026-02-13T17:18:44.000Z",
  "timeout": "300",
  "amount": "100000000000000",
  "amountETH": "0.0001",
  "executed": false,
  "canTrigger": false
}
```

### 詳細說明

- **Owner**: `0x9554CEb8aEAA4bDEc5b088ec980254d6a2Da3c72`
  - Vault 創建者和擁有者

- **Last Response**: `2026-02-13T17:18:44.000Z`
  - 最後一次 heartbeat 響應時間
  - 創建時自動設置為部署時間

- **Timeout**: `300` 秒 (5 分鐘)
  - 如果超過這個時間沒有 heartbeat，vault 可以被觸發

- **Amount**: `0.0001 ETH`
  - 存入 vault 的金額

- **Executed**: `false`
  - Vault 尚未被執行/觸發

- **Can Trigger**: `false`
  - 目前還不能觸發 vault
  - 原因：離最後響應時間還不到 5 分鐘

## 測試通過

✅ Vault 信息查詢成功
✅ Owner 地址正確
✅ Amount 正確 (0.0001 ETH)
✅ Timeout 設置正確 (300 秒)
✅ Executed 狀態正確 (false)
✅ Can Trigger 邏輯正確 (false - 時間未到)

## 備註

這是一個只讀查詢操作，不消耗 gas，不產生交易 hash。主要用於驗證 vault 創建成功並且狀態正確。
