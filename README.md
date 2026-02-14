<p align="center">
  <img src="packages/frontend/public/reliq-logo.webp" alt="ReliQ Logo" width="100%">
</p>

# ReliQ - The "Smart Will" Protocol

<div align="center">

[![SKALE Network](https://img.shields.io/badge/SKALE-BITE%20v2-00E5FF?style=for-the-badge&logo=skale&logoColor=white)](https://skale.space)
[![x402 Protocol](https://img.shields.io/badge/x402-Agentic%20Payments-FF0055?style=for-the-badge)](https://x402.org)
[![AI Powered](https://img.shields.io/badge/AI-OpenRouter-7B2CBF?style=for-the-badge&logo=openai&logoColor=white)](https://openrouter.ai)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

**Privacy-First・Automated Inheritance・Conditional Execution**

[**🎬 Watch Demo**](https://youtu.be/YOUR_VIDEO_ID) | [**📄 Read Submission**](SUBMISSION.md) | [**🛠️ View Contract**](https://base-sepolia-testnet-explorer.skalenodes.com:10032/address/0x1F24BB1C838E169a383Eabc52302394c24FC1538)

</div>

---

> *"Morgan, I love you 3,000. These assets are yours... but only when you graduate from MIT." — Tony Stark*

**ReliQ** is a next-generation inheritance protocol built for the **SKALE x402 Hackathon**. It uses **BITE v2** to encrypt entire transaction intents (not just messages) and **x402** to power a sustainable, AI-driven verification oracle.

## 🚀 The Problem vs. Solution

| Problem | The ReliQ Solution | Technology |
| :--- | :--- | :--- |
| **Trust Issues** | Traditional wills rely on lawyers who can be slow, expensive, or corrupt. | **Trustless Automation**: The will is a smart contract that self-executes. |
| **Privacy Leaks** | Wills are often public records. Everyone knows who gets what. | **BITE v2 Encryption**: Asset transfers are encrypted until the moment of execution. |
| **Simple Triggers** | "Dead Man's Switches" only check if you're inactive (Time). | **AI Verification**: We check *complex conditions* (e.g., "Graduate University"). |
| **Spam Risks** | AI agents can be spammed with fake requests. | **x402 Protocol**: Beneficiaries must pay (flow-to-compute) for AI verification. |

## 🎬 The Narrative Flow (Tony & Morgan)

1.  **Provisioning (Tony Stark)**:
    *   Tony deposits **3,000 USDC** into a ReliQ Vault.
    *   He sets a condition: *"Morgan must graduate from MIT."* -> **Encrypted with Agent's Key** (Privacy).
    *   He creates a transaction: *"Transfer 3,000 USDC to Morgan."* -> **Encrypted with BITE v2 SDK** (Security).
    *   **Result**: The vault is locked on-chain. The "Transfer" instruction is queued as a **Conditional Transaction (CTX)**.

2.  **The Event**:
    *   Years pass. Tony is gone. The vault remains dormant and secure in the SKALE BITE Sandbox.

3.  **Claiming (Morgan Stark)**:
    *   Morgan sees the vault. She cannot open it, but she knows she needs to provide a diploma.
    *   She uploads her **MIT Diploma (PDF)** to the Agent.
    
    <p align="center">
      <img src="packages/frontend/public/mit_diploma.webp" alt="MIT Diploma" width="400" style="border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    </p>

    *   She pays **0.01 rUSD** via **x402** to the Agent for verification.

4.  **Verification & Execution (The AI Executor)**:
    *   **OpenRouter AI** analyzes the diploma against the decrypted condition.
    *   **Approval**: The Agent calls `ReliQ.unlockVault(vaultId)`.
    *   **Auto-Execution**: The BITE Network detects the condition is met. It **automatically decrypts** the queued transaction and transfers the funds to Morgan.

## 🛠 Technical Architecture

### 1. BITE v2: "Encryption as Commitment"
We use the **Conditional Transaction (CTX)** pattern. By calling `BITE.submitCTX` at the *moment of creation*, Tony commits to the transfer. No one—not even Tony's ghost—can stop it once the condition is met.

```typescript
// BITE SDK: Encrypting the intent off-chain
const encryptedTx = await bite.encrypt({
  to: morganAddress,
  value: parseEther("3000"),
  data: encodeTestament("Love you 3000")
});
```

### 2. x402: "Pay-to-Verify"
We use the **x402 standard** to gate the AI Agent API. This ensures the Agent is sustainable and not DDoSed.
- **Client**: Sends request -> Gets `402 Payment Required`.
- **Payment**: Signs a micro-transaction.
- **Server**: Verifies payment -> Runs `verifyWithAI()`.

### 3. AI Agent: "The Oracle"
We use **OpenRouter** to access high-performance models (like Claude 3.5 Sonnet) for accurate document analysis. The Agent acts as the "Oracle of Truth" for the smart contract.

## 📦 Project Structure

-   `packages/contracts`: **Solidity** contracts (ReliQ + BITE Interfaces).
-   `packages/agent`: **Hono** server with x402 & OpenRouter integration.
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
<p align="center">
  © 2026 ReliQ Protocol Team・Built with ❤️ by You
</p>
