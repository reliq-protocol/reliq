/**
 * Step 3: Unlock Vault (AI Agent Action)
 * 
 * Simulated AI Agent action to unlock the vault after verifying proof
 */

import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { TestLogger, formatTimestamp, loadEnv } from './utils'; loadEnv();


const RPC_URL = process.env.RPC_URL!;
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY!; // Deployer is also the initial Agent
const CONTRACT_ADDRESS = '0x1F24BB1C838E169a383Eabc52302394c24FC1538';

const VAULT_ABI = [
    'function unlockVault(uint256 vaultId) external',
    'function getVault(uint256 vaultId) view returns (tuple(address owner, bytes encryptedCondition, uint256 amount, bool isUnlocked, bool executed))',
];

async function main() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Step 3: Unlock Vault (AI Agent)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    const sessionId = process.argv[2];
    if (!sessionId) {
        console.error('Error: Session ID required.');
        process.exit(1);
    }

    const logger = new TestLogger(sessionId);

    // Get vault ID
    const vaultIdPath = path.join(logger.getSessionDir(), 'vault_id.txt');
    const vaultId = fs.readFileSync(vaultIdPath, 'utf8').trim();

    console.log(`Vault ID: ${vaultId}`);
    console.log('');

    // Setup
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, VAULT_ABI, wallet);

    // Check status before
    const vaultBefore = await contract.getVault(vaultId);
    console.log(`Current status: Unlocked=${vaultBefore.isUnlocked}, Executed=${vaultBefore.executed}`);

    if (vaultBefore.isUnlocked) {
        console.log('Vault is already unlocked. Skipping...');
    } else {
        console.log('🔓 Unlocking vault...');
        const tx = await contract.unlockVault(vaultId);
        console.log(`Transaction sent: ${tx.hash}`);
        await tx.wait();
        console.log('✅ Vault unlocked successfully!');
    }

    // Prepare logs
    const input = {
        function: 'unlockVault(uint256)',
        vaultId: vaultId,
        agent: wallet.address
    };

    const output = {
        status: 'unlocked',
        timestamp: formatTimestamp()
    };

    logger.logTransaction({
        step: '3',
        description: 'Unlock Vault via Agent',
        timestamp: formatTimestamp(),
        input,
        output,
        transactionHash: 'simulated' // or actual tx hash
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Step 3 Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main().catch(console.error);
