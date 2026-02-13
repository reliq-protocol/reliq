<p align="center">
  <img src="packages/frontend/public/reliq-logo.webp" alt="ReliQ Logo" width="100%">
</p>

# ReliQ - The "Smart Will" Protocol (Powered by BITE v2 & x402)

> *"Morgan, I love you 3000. These assets are yours... but only when you graduate from MIT." — Tony Stark*

**ReliQ** is a privacy-first, automated inheritance protocol on the **SKALE Network**. It uses **BITE v2** to create encrypted, conditional transactions that automatically execute when an AI Agent verifies real-world conditions (like a diploma).

## 🚀 The Problem vs. Solution

| Problem | The ReliQ Solution | Technology |
| :--- | :--- | :--- |
| **Trust Issues** | Traditional wills rely on lawyers who can be slow, expensive, or corrupt. | **Trustless Automation**: The will is a smart contract that self-executes. |
| **Privacy Leaks** | Wills are often public records. Everyone knows who gets what. | **BITE v2 Encryption**: Asset transfers are encrypted until the moment of execution. |
| **Simple Triggers** | "Dead Man's Switches" only check if you're inactive (Time). | **AI Verification**: We check *complex conditions* (e.g., "Graduate University"). |
| **Spam Risks** | AI agents can be spammed with fake requests. | **x402 Protocol**: Beneficiaries must pay (flow-to-compute) for AI verification. |

## 🎬 The Narrative Flow (Tony & Morgan)

1.  **Provisioning (Tony Stark)**:
    *   Tony deposits **4.2 ETH** into a ReliQ Vault.
    *   He sets a condition: *"Morgan must graduate from MIT."* -> **Encrypted with Agent's Key** (Privacy).
    *   He creates a transaction: *"Transfer 4.2 ETH to Morgan."* -> **Encrypted with BITE v2 SDK** (Security).
    *   **Result**: The vault is locked on-chain. The "Transfer" instruction is queued in the BITE network as a **Conditional Transaction (CTX)**.

2.  **The Event**:
    *   Years pass. Tony is gone. The vault remains dormant and secure.

3.  **Claiming (Morgan Stark)**:
    *   Morgan sees the vault. She cannot open it, but she knows she needs to provide a diploma.
    *   She uploads her **MIT Diploma (PDF)** to the Agent.
    
    <p align="center">
      <img src="packages/frontend/public/mit_diploma.webp" alt="MIT Diploma" width="400">
    </p>

    *   She pays **0.01 rUSD** via **x402** to the Agent for verification.

4.  **Verification & Execution (The AI Executor)**:
    *   **Anthropic Claude** analyzes the diploma against the decrypted condition.
    *   **Approval**: The Agent calls `ReliQ.unlockVault(vaultId)`.
    *   **Auto-Execution**: The BITE Network detects the condition is met. It **automatically decrypts** the queued transaction and transfers the 4.2 ETH to Morgan.

## 🛠 Technical Architecture

### 1. BITE v2: "Encryption as Commitment"
We use BITE v2 not just for privacy, but for **autonomous execution**.
By calling `BITE.submitCTX` at the *moment of creation*, Tony commits to the transfer. No one—not even Tony's ghost—can stop it once the condition is met.

```solidity
// ReliQ.sol (Simplified)
function createVault(bytes encryptedTx, bytes encryptedCondition) external {
    // 1. Store the encrypted condition (for Agent)
    vaults[id].encryptedCondition = encryptedCondition;

    // 2. Queue the encrypted transfer (for BITE)
    // The condition for BITE is: "ReliQ.isUnlocked(id) == true"
    BITE.submitCTX(..., encryptedTx, ...);
}
```

### 2. x402: "Pay-to-Verify"
We use the **x402 standard** to gate the AI Agent API. This ensures the Agent is sustainable and not DDoSed.
- **Client**: Sends request -> Gets `402 Payment Required`.
- **Payment**: Signs a micro-transaction.
- **Server**: Verifies payment -> Runs `verifyWithClaude()`.

### 3. AI Agent: "The Oracle"
We use **Anthropic Claude 3 Haiku** for high-speed, low-cost document analysis. The Agent acts as the "Oracle of Truth" for the smart contract.

## 📦 Project Structure

-   `packages/contracts`: **Solidity** contracts (ReliQ + BITE Interfaces).
-   `packages/agent`: **Hono** server with x402 & Anthropic integration.
-   `packages/frontend`: **React** UI for Vault Provisioning & Claiming.

## 🏃‍♂️ How to Run

1.  **Start the Agent**:
    ```bash
    cd packages/agent
    npm install
    npm run dev
    ```

2.  **Start the Frontend**:
    ```bash
    cd packages/frontend
    bun dev
    ```

3.  **Deploy Contracts**:
    ```bash
    cd packages/contracts
    forge script script/Deploy.s.sol --rpc-url skale_chaos
    ```

## ❤️ Hackathon Submission
Built for the **SKALE x402 Hackathon**.
*   **BITE v2**: For conditional, encrypted transaction execution.
*   **x402**: For AI Agent modernization and monetization.
*   **ReliQUSD (rUSD)**: Custom payment token deployed at `0xd3b33C51d430117F705D9930A1D7A080b1ee839d`.

---
© 2026 ReliQ Protocol Team
