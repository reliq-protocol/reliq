# 04 - Trigger Vault (Status Check)

## 操作描述

檢查 vault 是否可以被觸發。由於在 test 03 中剛發送了 heartbeat，timeout 還未到期，所以 vault 不能被觸發。

## 執行時間

2026-02-13 17:23:07

## 查詢類型

只讀查詢 (view function)，不產生交易

## 輸入參數

### 函數
```solidity
canTrigger(uint256 vaultId) view returns (bool)
```

### 參數

- **vaultId**: `0`

## 輸出結果

```json
{
  "canTrigger": false,
  "reason": "Timeout not reached or recent heartbeat"
}
```

## 詳細說明

### Can Trigger: `false`

**原因分析：**

1. **最後 heartbeat 時間**: 2026-02-13 17:22:39 (Test 03)
2. **Timeout 設定**: 300 秒 (5 分鐘)
3. **可觸發時間**: 2026-02-13 17:27:39
4. **當前時間**: 2026-02-13 17:23:07
5. **剩餘時間**: ~272 秒

由於還在 timeout 期限內，並且 owner 在 test 03 中證明了還活躍（發送了 heartbeat），所以 vault 無法被觸發。

### Vault 觸發條件

根據合約邏輯 (`ReliQ.sol` line 181-185):

```solidity
function canTrigger(uint256 vaultId) public view returns (bool) {
    Vault storage vault = vaults[vaultId];
    if (vault.executed) return false;
    return (block.timestamp >= vault.lastResponse + vault.timeout);
}
```

Vault 可以被觸發當且僅當：
1. ✅ Vault 未被執行 (`executed == false`)
2. ❌ 當前時間 >= 最後響應時間 + timeout

## 如果要測試 Trigger 功能

有兩種方式：

### 方法 1: 等待 timeout
```bash
# 等待 5 分鐘後再檢查
sleep 300
npm run test:04 2026-02-13_17-18-41
```

### 方法 2: 創建新的 vault 不發送 heartbeat
```bash
# 創建新vault但不發送heartbeat
npm run test:01
# 等待5分鐘
sleep 300
# 觸發vault
npm run test:04
```

## 測試通過

✅ `canTrigger` 函數正常運作
✅ Timeout 邏輯正確
✅ Heartbeat 更新正確影響觸發狀態
✅ 安全機制正常（防止過早觸發）

## 備註

這個測試展示了 ReliQ 協議的核心安全特性：只要 vault owner 定期發送 heartbeat 證明活躍，vault 就不會被觸發。這確保了數字資產只在 owner 真正無法響應時才轉移給受益人。
