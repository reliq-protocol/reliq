# Hackathon Submission: ReliQ (The Smart Will Protocol)

> *"Morgan, I love you 3000. These assets are yours... but only when you graduate from MIT." — Tony Stark*

**ReliQ** is a privacy-first, automated inheritance protocol built on the **SKALE Network**. It ensures that digital legacies are handled with the same care, privacy, and complexity as real-world wishes.

## 🎬 The Narrative: Tony & Morgan Stark
Traditional wills are public, static, and often require manual intervention. ReliQ brings Tony Stark’s vision to life through technology:

1.  **The Provisioning (Tony)**: Tony locks 4.2 ETH in a vault. He doesn't want the world to know how much he's leaving or to whom. He sets a complex condition: *"Morgan must graduate from MIT."*
2.  **The Encryption**: Using **BITE v2**, the transfer instruction itself is encrypted. Even the validators cannot see the destination address or the amount until the condition is met.
3.  **The Claim (Morgan)**: Years later, Morgan uploads her MIT diploma. She pays a small **x402 fee** to trigger the AI Agent's verification process.
4.  **The Settlement**: The AI Agent confirms the diploma's authenticity. BITE automatically decrypts and executes the transaction. Morgan receives her inheritance instantly and privately.

## 🛠️ Why BITE v2 + x402?
*   **BITE v2 (Privacy as Commitment)**: We use the **Conditional Transaction (CTX)** pattern. The transfer is "locked" in an encrypted state at creation. It is unstoppable yet completely private until the AI Agent flips the switch.
*   **x402 (Sustainable Oracle)**: Verifying complex real-world documents (like diplomas) requires AI compute. x402 allows the ReliQ Agent to charge a micro-fee for this service, preventing spam and ensuring the "Executor" is always online.

---

## 🔍 On-Chain Evidence (BITE V2 Sandbox)

We have successfully simulated this entire narrative on the **SKALE BITE V2 Sandbox (Chain ID: 103698795)**.

### 1. Contract Information
*   **ReliQ Contract**: `0x1F24BB1C838E169a383Eabc52302394c24FC1538`
*   **Official USDC (Payment Token)**: `0xc4083B1E81ceb461Ccef3FDa8A9F24F0d764B6D8`

### 2. Full Workflow Trace
| Step | Action | Transaction Hash |
| :--- | :--- | :--- |
| **Step 1** | **Tony Stark Creates Vault** | `0x86cc8a248d62b7b6722807714f2237fb3053811c9d9148578bfa3d6db1576ba1` |
| **Step 2** | **Simulate Inactivity** (Backdoor Expire) | `0x5d2c23d95dfb6a5bb34675b559a218c0b31caeca052a96c4be0228f860459afd` |
| **Step 3** | **AI Agent Verifies & Unlocks** | `0xde4d93b16e1c44ba853ebd64fe3a69f82bb84d8447d1d081b051f664ad024864` |
| **Step 4** | **BITE Auto-Settlement** (Success) | *Verified via BITE Network Callback* |

---

## 📦 Technical Stack
*   **Smart Contracts**: Solidity 0.8.27 (EVM: Istanbul)
*   **Encryption**: SKALE BITE v2 SDK (CTX Mode)
*   **AI Layer**: Anthropic Claude 3 Haiku via x402 Agent
*   **Backend**: Hono + Ethers.js v6

---
Built with ❤️ for the SKALE x402 Hackathon.
