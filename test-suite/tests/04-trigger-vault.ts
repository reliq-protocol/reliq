/**
 * Step 4: Trigger Vault (if timeout reached)
 * 
 * Check if vault can be triggered and trigger it
 */

import { ethers } from 'ethers';
import { BITE } from '@skalenetwork/bite';
import fs from 'fs';
import path from 'path';
import { TestLogger, formatTimestamp, loadEnv } from './utils'; loadEnv();


const RPC_URL = process.env.RPC_URL!;
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY!;
const CONTRACT_ADDRESS = '0x2277f5210daAaab3E26e565c96E5F9BeDb46662B';

const VAULT_ABI = [
    'function canTrigger(uint256) view returns (bool)',
    'function triggerVault(uint256, address)',
    'function vaults(uint256) view returns (address owner, bytes encryptedPayload, uint256 lastResponse, uint256 timeout, uint256 amount, bool executed)',
];

async function main() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Step 4: Trigger Vault');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    const sessionId = process.argv[2];
    if (!sessionId) {
        console.error('Error: Session ID required. Run step1 first.');
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
    const bite = new BITE(RPC_URL);

    // Check if can trigger
    const canTrigger = await contract.canTrigger(vaultId);

    console.log(`Can trigger: ${canTrigger}`);
    console.log('');

    if (!canTrigger) {
        console.log('❌ Vault cannot be triggered yet.');
        console.log('   Timeout period has not passed or heartbeat is recent.');
        console.log('');

        // Still log this check
        logger.logTransaction({
            step: '4',
            description: 'Check Trigger Status (Cannot Trigger)',
            timestamp: formatTimestamp(),
            input: { vaultId },
            output: { canTrigger: false, reason: 'Timeout not reached or recent heartbeat' },
        });

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Step 4 Complete (not triggered)');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        return;
    }

    // Get vault data to decrypt payload
    const vaultData = await contract.vaults(vaultId);
    const [owner, encryptedPayload, lastResponse, timeout, amount, executed] = vaultData;

    console.log('Vault can be triggered!');
    console.log(`Owner: ${owner}`);
    console.log(`Amount: ${ethers.formatEther(amount)} ETH`);
    console.log('');

    // In a real scenario, we would decrypt the payload here using BITE
    // For now, we'll use a dummy beneficiary
    const beneficiary = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';

    console.log(`Beneficiary: ${beneficiary}`);
    console.log('');

    // Prepare input log
    const input = {
        function: 'triggerVault(uint256,address)',
        parameters: {
            vaultId: vaultId,
            beneficiary: beneficiary,
        },
    };

    // Trigger vault
    console.log('📤 Triggering vault...');
    const tx = await contract.triggerVault(vaultId, beneficiary);

    console.log(`Transaction hash: ${tx.hash}`);
    console.log('Waiting for confirmation...');
    console.log('');

    const receipt = await tx.wait();

    console.log('✅ Vault triggered!');
    console.log(`Block: ${receipt?.blockNumber}`);
    console.log(`Gas used: ${receipt?.gasUsed.toString()}`);
    console.log('');

    // Prepare output log
    const output = {
        beneficiary,
        amountTransferred: ethers.formatEther(amount),
        blockNumber: receipt?.blockNumber,
        gasUsed: receipt?.gasUsed.toString(),
        status: receipt?.status === 1 ? 'success' : 'failed',
    };

    logger.logTransaction({
        step: '4',
        description: 'Trigger Vault',
        timestamp: formatTimestamp(),
        input,
        output,
        transactionHash: tx.hash,
        explorerUrl: `https://base-sepolia-testnet-explorer.skalenodes.com/tx/${tx.hash}`,
        gasUsed: receipt?.gasUsed.toString(),
        status: receipt?.status === 1 ? 'success' : 'failed',
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Step 4 Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main().catch(console.error);
