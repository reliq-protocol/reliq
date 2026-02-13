# Reliq - BITE Hackathon Submission

**Privacy-first Digital Inheritance Vault on SKALE**

## Project Description

Reliq is a decentralized digital inheritance protocol that allows users to create encrypted "dead man's switch" vaults. It leverages **BITE v2 (Blockchain Integrated Threshold Encryption)** to ensure that sensitive asset transfer instructions remain completely private until a specific condition (user inactivity/timeout) is met.

Unlike traditional dead man's switches that rely on centralized servers or reveal intent on-chain immediately, Reliq ensures that the beneficiary, amount, and message are encrypted and only decryptable by the SKALE network itself when the timeout condition is proven valid.

## How it uses BITE v2

Reliq implements a "Conditional Transaction" workflow to solve the privacy problem in digital inheritance:

1.  **Encryption (What stays private)**: The vault payload (containing the beneficiary address and a personal message) is encrypted client-side using the BITE SDK before it ever touches the chain.
2.  **Condition (What unlocks it)**: A smart contract condition checks if `block.timestamp > lastHeartbeat + timeout`. The vault owner can reset this timer by sending a "heartbeat".
3.  **Execution (How failure is handled)**: If the owner fails to send a heartbeat before the timeout, anyone can trigger the vault. The BITE nodes verify the condition on-chain, and if met, they collaborate to decrypt the payload and execute the asset transfer to the beneficiary.

## Evidence of BITE v2 Usage

We successfully deployed and tested the full lifecycle on **SKALE Base Sepolia Testnet**.

**Contract Address:** `0x2277f5210daAaab3E26e565c96E5F9BeDb46662B`

### 1. Complete Workflow Demo (Privacy + Execution)

In this flow, we created a vault, effectively establishing an encrypted intent. We then simulated a timeout (using a demo-only backdoor) and triggered the execution.

*   **Step A: Encrypted Intent (Vault Creation)**
    *   **Description**: User deposits funds and provides encrypted instructions.
    *   **Transaction Hash**: `0x5482f03cd361cd417ca646a576346f3133b2ae9ddadd5755c8606587aa5ac49d`
    *   **Status**: The payload on-chain is purely encrypted bytes. The potential beneficiary is unknown to observers.

*   **Step B: Conditional Execution (Trigger)**
    *   **Description**: After the condition (`timeout`) was met, the vault was triggered. The SKALE network verified the condition, decrypted the payload, and executed the transfer.
    *   **Transaction Hash**: `0x465bad558de0f73f2ea491d7e073c3a0e90d16f610396a245a111e54e5934587`
    *   **Outcome**: 0.0001 ETH transferred to beneficiary `0x742d35Cc6634C0532925a3b844Bc454e4438f44e`.

### 2. Gasless "Heartbeat" Feature (UX Trust Model)

To encourage users to keep their vaults active without needing ETH for gas every time, we implemented EIP-712 signatures.

*   **Description**: The vault owner signs a message off-chain. An agent submits this to the chain to prove liveness.
*   **Transaction Hash**: `0x402faac209ecc6fa9d88796f18724117fad7ff4a8ab7ca1e4ad98b522deecd2a`
*   **Significance**: Demonstrates a "Proof of Life" mechanism that is user-friendly and cost-effective.