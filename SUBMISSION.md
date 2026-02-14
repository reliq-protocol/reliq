# Hackathon Submission: ReliQ (The Smart Will Protocol)
<p align="center">
  <img src="https://raw.githubusercontent.com/reliq-protocol/reliq/refs/heads/main/packages/frontend/public/reliq-logo.webp" alt="ReliQ Logo" width="100%">
</p>

> *"Morgan, I love you 3000. These assets are yours... but only when you graduate from MIT." — Tony Stark*

**ReliQ** is a privacy-first, automated inheritance protocol built on **SKALE Network**. It uses **BITE v2** to create "Smart Wills" — conditional transactions that remain encrypted on-chain and only execute when an AI Agent verifies a real-world achievement.

---

##  Submission Requirements: BITE v2 & x402

This project was built specifically to demonstrate the power of **BITE v2 (Blockchain Integrated Threshold Encryption)** combined with **x402 (flow-to-compute)**.

### 1. What Stays Encrypted? (Privacy Model)
**Everything that matters.**
In ReliQ, we cloak the entire intent, not just the money.

| Data Component | On-Chain Visibility | When Revealed |
| :--- | :--- | :--- |
| **Trigger Condition** | **Encrypted** (BITE v2) | ONLY after AI verification passes |
| **Testament (Will)** | **Encrypted** (BITE v2) | ONLY after AI verification passes |
| **Asset Amount** | **Encrypted** (BITE v2) | ONLY automatically decoded upon execution |
| **Beneficiary** | **Encrypted** (BITE v2) | ONLY automatically decoded upon execution |
| **Vault Existence** | **Public** | Always (as a generic contract interaction) |

*   **Why it matters:** This prevents "wealth signaling" and protects beneficiaries from being targeted or pressured before the condition is met.

### 2. What Condition Unlocks Execution?
**A "Proof of Graduation" verified by an AI Oracle.**
Unlike simple "Dead Man's Switches" (which just check time), ReliQ demands a **Qualitative Verification**:
*   **The Condition:** "Beneficiary must hold a valid MIT Diploma matching the name Morgan Stark."
*   **The Oracle:** An **x402 AI Agent** (powered by **OpenRouter**) analyzes the uploaded PDF document. This architecture provides high flexibility, allowing the agent to seamlessly switch between hundreds of powerful models.
*   **The Trigger:** Once the Agent verifies the document, it calls `unlockVault()`. The **SKALE DKG (Distributed Key Generation)** nodes detect this on-chain state change and automatically decrypt/execute the queued transaction.

### 3. How Failure is Handled?
**Trustless Reversion & Expiry.**
*   **Verification Failure:** If Morgan uploads a fake diploma, the AI Agent rejects the request (returning a 400 error). The vault remains locked. No gas is wasted on the main decryption flow.
*   **Timeout/Expiry:** If the condition is never met (e.g., waiting 50 years), the original creator (Tony) has a fallback key or "Time-Lock" to reclaim the assets, ensuring funds are never permanently lost.

---

## 🎬 The Narrative Flow (Tony & Morgan)

1.  **Provisioning (Tony)**: Tony locks 3,000 USDC. He sets the condition: *"Morgan must graduate from MIT."*
    *   *Tech:* The transfer instruction is encrypted into a **BITE Conditional Transaction (CTX)**.
2.  **The Event**: Years pass. The vault sits dormant on SKALE, fully encrypted.
3.  **Claiming (Morgan)**: Morgan connects her wallet. She uploads her MIT Diploma.
    *   *Tech:* She pays a **0.01 rUSD** fee via **x402** to the Agent service.
4.  **Settlement**: The AI Agent confirms the diploma. BITE decrypts the 3,000 USDC transfer and sends it to Morgan.

---

## � Technical Implementation (The "Magic")

### BITE v2: Encryption
We use the BITE SDK to encrypt the transfer instruction off-chain before it ever hits the network.

```typescript
// Client-side: Encrypting the "Smart Will"
const encryptedData = await bite.encrypt({
  to: beneficiaryAddress,
  value: parseEther("3000"),
  data: encodeTestament("Love you 3000")
});
```

### x402: Verification
Our Agent uses Hono middleware to gate the AI verification behind a payment.

```typescript
// Agent-side: Charging for AI verification
app.post('/verify', payment({ price: '0.01 rUSD' }), async (c) => {
  const proof = await c.req.parseBody();
  const isValid = await askOpenRouter(proof, encryptedCondition);
  if (isValid) await contract.unlockVault(vaultId);
});
```

---

## �🔍 Evidence of BITE v2 Usage

We have successfully deployed and tested the entire flow on the **SKALE BITE V2 Sandbox**.

### 1. Contract Addresses
*   **ReliQ Protocol**: `0x1F24BB1C838E169a383Eabc52302394c24FC1538`
*   **Payment Token (Available on x402)**: `0xc4083B1E81ceb461Ccef3FDa8A9F24F0d764B6D8`

### 2. Execution Trace
The following transaction hashes demonstrate the **Encrypted -> Condition -> Decrypt** lifecycle:

| Step | Action | Transaction Hash |
| :--- | :--- | :--- |
| **Step 1** | **Vault Creation** (Encrypted CTX Submitted) | `0x86cc8a248d62b7b6722807714f2237fb3053811c9d9148578bfa3d6db1576ba1` |
| **Step 2** | **AI Verification** (Condition Met) | `0xde4d93b16e1c44ba853ebd64fe3a69f82bb84d8447d1d081b051f664ad024864` |
| **Step 3** | **BITE Decryption** (Auto-Execution) | *Automatic callback from SKALE DKG nodes (internal tx)* |

---

## 📦 Tech Stack
*   **SKALE Chain**: Chaos Testnet / BITE v2 Sandbox
*   **Encryption**: BITE v2 TypeScript SDK (CTX Mode)
*   **AI Layer**: OpenRouter (Flexible Model Access) via x402 Agent
*   **Backend**: Hono + ethers.js + @x402/hono
*   **Frontend**: React + Vite + TailwindCSS

---
*Built with ❤️ for the SKALE x402 Hackathon.*
