import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { paymentMiddleware } from '@x402/hono';
import { ExactEvmScheme } from '@x402/evm/exact/server';
import { HTTPFacilitatorClient, x402ResourceServer } from '@x402/core/server';
import { config } from 'dotenv';
import { ethers } from 'ethers';
import { verifyWithClaude } from './services/ai.js';

config();

const app = new Hono();

app.use('/*', cors());

// Health check
app.get('/health', (c) => c.json({ status: 'ok', service: 'ReliQ-Agent' }));

// Free tier verification (Mock)
app.post('/api/verify', async (c) => {
    const body = await c.req.json();
    return c.json({
        verified: true,
        confidence: 0.85,
        note: 'Free tier verification (Mock)'
    });
});

// Setup x402 Payment Middleware
// 使用環境變數設定 facilitator URL，預設為本地（如果有設定的話）
// 否則使用 SKALE 官方的 facilitator 作為後備
const facilitatorUrl = process.env.FACILITATOR_URL || "https://facilitator.dirtroad.dev";
// Fallback to a dummy address if not set, to allow server to start
const receivingAddress = process.env.AGENT_WALLET_ADDRESS || "0x000000000000000000000000000000000000dEaD";
// Fallback to ReliQ USD (rUSD) on SKALE Chaos or similar if not set
const paymentToken = process.env.PAYMENT_TOKEN_ADDRESS || "0xc4083B1E81ceb461Ccef3FDa8A9F24F0d764B6D8"; // Official USDC on BITE V2 Sandbox 2
// SKALE Chaos Testnet Chain ID
const network = "eip155:103698795"; // Using the same chain as deployment

console.log(`🔗 x402 Facilitator URL: ${facilitatorUrl}`);
if (!process.env.AGENT_WALLET_ADDRESS) {
    console.warn("⚠️ AGENT_WALLET_ADDRESS not set. Using dummy address.");
}
if (!process.env.PAYMENT_TOKEN_ADDRESS) {
    console.warn("⚠️ PAYMENT_TOKEN_ADDRESS not set. Using default ReliQUSD.");
}
if (!process.env.FACILITATOR_URL) {
    console.warn("⚠️ FACILITATOR_URL not set. Using default facilitator.dirtroad.dev");
}

let x402Middleware: any = null;

try {
    const facilitatorClient = new HTTPFacilitatorClient({ url: facilitatorUrl });
    const resourceServer = new x402ResourceServer(facilitatorClient);

    // Explicitly register the scheme for ANY network to catch-all if possible, or just specific one
    // VaultAgent uses "eip155:*"
    resourceServer.register("eip155:*", new ExactEvmScheme());

    x402Middleware = paymentMiddleware(
        {
            "POST /api/verify-paid": {
                accepts: [{
                    scheme: "exact",
                    network: network, // Ensure this matches exactly "eip155:103698795"
                    payTo: receivingAddress,
                    price: {
                        amount: "10000",
                        asset: paymentToken,
                        extra: { name: "Axios USD", version: "1" },
                    },
                }],
                description: "ReliQ Agent Verification Service",
                mimeType: "application/json",
            }
        },
        resourceServer,
        // Disable sync on start if it's failing, to see if we can lazy load
        null,
        null,
        false // syncFacilitatorOnStart = false
    );
    console.log(`✅ x402 Payment Middleware initialized`);
    console.log(`   Facilitator: ${facilitatorUrl}`);
    console.log(`   Receiving: ${receivingAddress}`);
    console.log(`   Network: ${network}`);
} catch (error: any) {
    console.warn("⚠️ Failed to initialize x402 middleware (Facilitator might be down or misconfigured):", error.message);
    console.warn("⚠️ /api/verify-paid will be disabled or return 503");
}

// Premium x402-gated verification (Real AI)
app.post(
    '/api/verify-paid',
    async (c, next) => {
        if (x402Middleware) {
            return x402Middleware(c, next);
        }
        return c.json({ error: "Service unavailable: Payment gateway (x402) is down." }, 503);
    },
    async (c) => {
        try {
            const body = await c.req.json();
            const { proof, condition, vaultId } = body;

            if (!vaultId && vaultId !== 0) {
                return c.json({ error: 'vaultId is required' }, 400);
            }

            // 1. Real AI Verification
            const result = await verifyWithClaude(condition, proof);

            // 2. If verified, Agent triggers the Smart Contract
            let txHash = null;
            if (result.verified) {
                // Initialize provider/wallet inside request to ensure fresh state/env
                if (!process.env.AGENT_PRIVATE_KEY) throw new Error("Missing AGENT_PRIVATE_KEY");

                const provider = new ethers.JsonRpcProvider(process.env.SKALE_RPC_URL);
                const wallet = new ethers.Wallet(process.env.AGENT_PRIVATE_KEY, provider);

                // Minimal ABI for unlockVault
                const abi = ["function unlockVault(uint256 vaultId) external"];
                const contract = new ethers.Contract(process.env.RELIQ_CONTRACT_ADDRESS!, abi, wallet);

                console.log(`🔓 Unlocking vault ${vaultId}...`);
                const tx = await contract.unlockVault(vaultId);
                await tx.wait();
                txHash = tx.hash;
                console.log(`✅ Vault unlocked! Tx: ${txHash}`);
            }

            const response = {
                verified: result.verified,
                analysis: result.reasoning,
                confidence: result.confidence,
                txHash: txHash,
                timestamp: new Date().toISOString()
            };

            return c.json(response);
        } catch (err: any) {
            console.error("Agent Error:", err);
            return c.json({ error: err.message }, 500);
        }
    }
);

const port = 3002;
console.log(`🤖 ReliQ Agent running on port ${port}`);

serve({
    fetch: app.fetch,
    port
});
