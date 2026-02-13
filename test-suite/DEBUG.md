# Test Suite Execution Issues

##問題

測試執行時遇到私鑰驗證錯誤：

```
Error: invalid private key (argument="privateKey", value="[ REDACTED ]")
```

## 調試信息

- **dotenv 路徑**: `../../packages/contracts/.env` (從 test-suite/tests/)
- **合約地址**: 已更新到 `0x2277f5210daAaab3E26e565c96E5F9BeDb46662B`
- **utils.ts**: 已移至 `test-suite/tests/utils.ts`
- **導入路徑**: 已修復為 `./utils.ts`

## 需要檢查

1. `packages/contracts/.env` 中的 `DEPLOYER_PRIVATE_KEY` 格式
2. 私鑰是否以 `0x` 開頭？
3. 私鑰長度是否為 66 字符？

## 已完成的重構

✅ ReliQ → ReliQ 重命名
✅ Monorepo 結構
✅ test-suite 組織化
✅ 合約地址更新
