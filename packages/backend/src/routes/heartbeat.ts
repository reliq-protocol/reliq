import express, { Request, Response } from 'express';
import { ethers } from 'ethers';

const router = express.Router();

// TODO: Import ABI when contracts are deployed
const VaultManagerABI = [
    "function respondViaAgent(uint256 vaultId, uint256 timestamp, uint256 nonce, bytes calldata signature) external",
    "function vaults(uint256) external view returns (address owner, bytes memory encryptedPayload, uint256 lastResponse, uint256 timeout, bool executed)",
    "function canTrigger(uint256 vaultId) external view returns (bool)"
];

// ============ Respond to Heartbeat ============
router.post('/respond', async (req: Request, res: Response) => {
    try {
        const { vaultId, timestamp, nonce, signature } = req.body;

        if (vaultId === undefined || !timestamp || !nonce || !signature) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Connect to blockchain
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const wallet = new ethers.Wallet(process.env.AGENT_PRIVATE_KEY!, provider);
        const contract = new ethers.Contract(
            process.env.VAULT_CONTRACT_ADDRESS!,
            VaultManagerABI,
            wallet
        );

        // Submit heartbeat response via agent
        const tx = await contract.respondViaAgent(
            vaultId,
            timestamp,
            nonce,
            signature
        );

        await tx.wait();

        console.log(`✅ Heartbeat recorded for vault ${vaultId}`);
        res.json({
            success: true,
            transactionHash: tx.hash
        });

    } catch (error) {
        console.error('Heartbeat response error:', error);
        res.status(500).json({ error: 'Failed to record heartbeat' });
    }
});

// ============ Get Vault Status ============
router.get('/status/:vaultId', async (req: Request, res: Response) => {
    try {
        const vaultId = parseInt(String(req.params.vaultId));

        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const contract = new ethers.Contract(
            process.env.VAULT_CONTRACT_ADDRESS!,
            VaultManagerABI,
            provider
        );

        const vault = await contract.vaults(vaultId);
        const canTrigger = await contract.canTrigger(vaultId);

        res.json({
            vaultId,
            owner: vault.owner,
            lastResponse: Number(vault.lastResponse),
            timeout: Number(vault.timeout),
            executed: vault.executed,
            canTrigger
        });

    } catch (error) {
        console.error('Get vault status error:', error);
        res.status(500).json({ error: 'Failed to fetch vault status' });
    }
});

export default router;
