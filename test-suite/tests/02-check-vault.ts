/**
 * Step 2: Check Vault Details
 * 
 * This script:
 * 1. Reads the vault ID from the previous step
 * 2. Queries the contract for vault details
 * 3. Logs the status
 */

import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { TestLogger, formatTimestamp, generateSessionId, loadEnv } from './utils'; loadEnv();


const RPC_URL = process.env.RPC_URL!;
const CONTRACT_ADDRESS = '0x1F24BB1C838E169a383Eabc52302394c24FC1538';

const VAULT_ABI = [
    'function getVault(uint256) view returns (tuple(address owner, bytes encryptedCondition, uint256 amount, bool isUnlocked, bool executed))',
    'function isConditionMet(uint256) view returns (bool)',
];

async function main() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Step 2: Check Vault Details');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    const sessionId = process.argv[2] || generateSessionId();
    const logger = new TestLogger(sessionId);

    // Get vault ID from previous step
    const vaultIdPath = path.join(logger.getSessionDir(), 'vault_id.txt');
    const vaultId = fs.existsSync(vaultIdPath)
        ? fs.readFileSync(vaultIdPath, 'utf8').trim()
        : '0';

    console.log(`Vault ID: ${vaultId}`);
    console.log('');

    // Setup
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, VAULT_ABI, provider);

    // Query vault
    console.log('🔍 Querying vault details...');
    const vault = await contract.getVault(vaultId);
    const canTrigger = await contract.isConditionMet(vaultId);

    console.log('');
    console.log('Vault Details:');
    console.log(`  Owner: ${vault.owner}`);
    console.log(`  Amount: ${ethers.formatEther(vault.amount)} ETH`);
    console.log(`  Unlocked: ${vault.isUnlocked}`);
    console.log(`  Executed: ${vault.executed}`);
    console.log(`  Can Trigger (BITE): ${canTrigger}`);
    console.log('');

    // Prepare logs
    const input = {
        function: 'getVault(uint256)',
        vaultId: vaultId,
    };

    const output = {
        owner: vault.owner,
        amount: vault.amount.toString(),
        amountETH: ethers.formatEther(vault.amount),
        isUnlocked: vault.isUnlocked,
        executed: vault.executed,
        canTrigger: canTrigger
    };

    logger.logTransaction({
        step: '2',
        description: 'Check Vault Details',
        timestamp: formatTimestamp(),
        input,
        output,
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Step 2 Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main().catch(console.error);
