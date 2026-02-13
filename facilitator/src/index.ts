import dotenv from 'dotenv';
import express from 'express';
import { createWalletClient, http, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { x402Facilitator } from '@x402/core/facilitator';
import { toFacilitatorEvmSigner } from '@x402/evm';
import { registerExactEvmScheme } from '@x402/evm/exact/facilitator';
import type { PaymentPayload, PaymentRequirements, VerifyResponse, SettleResponse } from '@x402/core/types';

dotenv.config();

// Configuration
const PORT = process.env.PORT || '8080';
const PRIVATE_KEY = process.env.EVM_PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL_103698795 || 'https://base-sepolia-testnet.skalenodes.com/v1/bite-v2-sandbox';

// Validate required environment variables
if (!PRIVATE_KEY) {
    console.error('❌ EVM_PRIVATE_KEY environment variable is required');
    process.exit(1);
}

// Initialize the EVM account from private key
const evmAccount = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);
console.info(`🔐 EVM Facilitator account: ${evmAccount.address}`);

// Create a Viem client with both wallet and public capabilities
// BITE V2 Sandbox 2
const viemClient = createWalletClient({
    account: evmAccount,
    chain: {
        id: 103698795,
        name: 'BITE V2 Sandbox 2',
        nativeCurrency: { name: 'sFUEL', symbol: 'sFUEL', decimals: 18 },
        rpcUrls: {
            default: { http: [RPC_URL] },
            public: { http: [RPC_URL] },
        },
        blockExplorers: {
            default: {
                name: 'SKALE Explorer',
                url: 'https://base-sepolia-testnet-explorer.skalenodes.com:10032',
            },
        },
    },
    transport: http(RPC_URL),
}).extend(publicActions);

// Initialize the x402 Facilitator with EVM support
const evmSigner = toFacilitatorEvmSigner({
    getCode: (args: { address: `0x${string}` }) => viemClient.getCode(args),
    address: evmAccount.address,
    readContract: (args: {
        address: `0x${string}`;
        abi: readonly unknown[];
        functionName: string;
        args?: readonly unknown[];
    }) =>
        viemClient.readContract({
            ...args,
            args: args.args || [],
        }),
    verifyTypedData: (args: {
        address: `0x${string}`;
        domain: Record<string, unknown>;
        types: Record<string, unknown>;
        primaryType: string;
        message: Record<string, unknown>;
        signature: `0x${string}`;
    }) => viemClient.verifyTypedData(args as any),
    writeContract: (args: {
        address: `0x${string}`;
        abi: readonly unknown[];
        functionName: string;
        args: readonly unknown[];
    }) =>
        viemClient.writeContract({
            ...args,
            args: args.args || [],
        }),
    sendTransaction: (args: { to: `0x${string}`; data: `0x${string}` }) =>
        viemClient.sendTransaction(args),
    waitForTransactionReceipt: (args: { hash: `0x${string}` }) =>
        viemClient.waitForTransactionReceipt(args),
});

// Create the facilitator with lifecycle hooks
const facilitator = new x402Facilitator()
    .onBeforeVerify(async (context) => {
        console.log('🔍 Before verify:', {
            network: context.paymentPayload.network,
            scheme: context.paymentPayload.scheme,
        });
    })
    .onAfterVerify(async (context) => {
        console.log('✅ After verify:', {
            success: context.result.success,
            network: context.paymentPayload.network,
        });
    })
    .onVerifyFailure(async (context) => {
        console.log('❌ Verify failure:', context.error?.message);
    })
    .onBeforeSettle(async (context) => {
        console.log('💰 Before settle:', {
            network: context.paymentPayload.network,
        });
    })
    .onAfterSettle(async (context) => {
        console.log('✅ After settle:', {
            success: context.result.success,
            txHash: context.result.txHash,
        });
    })
    .onSettleFailure(async (context) => {
        console.log('❌ Settle failure:', context.error?.message);
    });

// Register EVM scheme for SKALE Chaos Testnet (eip155:103698795)
registerExactEvmScheme(facilitator, {
    signer: evmSigner,
    networks: 'eip155:103698795', // SKALE Chaos Testnet
    deployERC4337WithEIP6492: true,
});

console.log('✅ Registered EVM scheme for eip155:103698795');

// Initialize Express app
const app = express();
app.use(express.json());

/**
 * GET /
 * Health check and service info
 */
app.get('/', (req, res) => {
    res.json({
        name: 'ReliQ x402 Facilitator',
        version: '2.0.0',
        status: 'healthy',
        wallet: evmAccount.address,
        networks: ['eip155:103698795'],
        endpoints: {
            verify: '/verify',
            settle: '/settle',
            supported: '/supported',
        },
    });
});

/**
 * POST /verify
 * Verify a payment against requirements
 */
app.post('/verify', async (req, res) => {
    try {
        const { paymentPayload, paymentRequirements } = req.body as {
            paymentPayload: PaymentPayload;
            paymentRequirements: PaymentRequirements;
        };

        if (!paymentPayload || !paymentRequirements) {
            return res.status(400).json({
                error: 'Missing paymentPayload or paymentRequirements',
            });
        }

        const response: VerifyResponse = await facilitator.verify(
            paymentPayload,
            paymentRequirements,
        );

        res.json(response);
    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

/**
 * POST /settle
 * Settle a payment on-chain
 */
app.post('/settle', async (req, res) => {
    try {
        const { paymentPayload, paymentRequirements } = req.body;

        if (!paymentPayload || !paymentRequirements) {
            return res.status(400).json({
                error: 'Missing paymentPayload or paymentRequirements',
            });
        }

        const response: SettleResponse = await facilitator.settle(
            paymentPayload as PaymentPayload,
            paymentRequirements as PaymentRequirements,
        );

        res.json(response);
    } catch (error) {
        console.error('Settle error:', error);

        // Check if this was an abort from hook
        if (
            error instanceof Error &&
            error.message.includes('Settlement aborted:')
        ) {
            return res.json({
                success: false,
                errorReason: error.message.replace('Settlement aborted: ', ''),
                network: req.body?.paymentPayload?.network || 'unknown',
            } as SettleResponse);
        }

        res.status(500).json({
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

/**
 * GET /supported
 * Get supported payment kinds and extensions
 */
app.get('/supported', async (req, res) => {
    try {
        const response = facilitator.getSupported();
        res.json(response);
    } catch (error) {
        console.error('Supported error:', error);
        res.status(500).json({
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

// Start the server
app.listen(parseInt(PORT), () => {
    console.log(`🚀 ReliQ Facilitator listening on http://localhost:${PORT}`);
    console.log(`📡 Network: eip155:103698795 (SKALE Chaos Testnet)`);
    console.log(`💼 Wallet: ${evmAccount.address}`);
    console.log();
});
