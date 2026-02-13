/**
 * Step 2: Check Vault Details
 * 
 * Query vault information from the contract
 */

import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { TestLogger, formatTimestamp, generateSessionId, loadEnv } from './utils'; loadEnv();


const RPC_URL = process.env.RPC_URL!;
const CONTRACT_ADDRESS = '0x2277f5210daAaab3E26e565c96E5F9BeDb46662B';

const VAULT_ABI = [
    'function getVault(uint256) view returns (address owner, uint256 lastResponse, uint256 timeout, uint256 amount, bool executed)',
    'function canTrigger(uint256) view returns (bool)',
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
    const vaultData = await contract.getVault(vaultId);
    const canTrigger = await contract.canTrigger(vaultId);

    const [owner, lastResponse, timeout, amount, executed] = vaultData;

    console.log('');
    console.log('Vault Details:');
    console.log(`  Owner: ${owner}`);
    console.log(`  Last Response: ${new Date(Number(lastResponse) * 1000).toISOString()}`);
    console.log(`  Timeout: ${timeout} seconds`);
    console.log(`  Amount: ${ethers.formatEther(amount)} ETH`);
    console.log(`  Executed: ${executed}`);
    console.log(`  Can Trigger: ${canTrigger}`);
    console.log('');

    // Prepare logs
    const input = {
        function: 'getVault(uint256)',
        vaultId: vaultId,
    };

    const output = {
        owner: owner,
        lastResponse: lastResponse.toString(),
        lastResponseDate: new Date(Number(lastResponse) * 1000).toISOString(),
        timeout: timeout.toString(),
        amount: amount.toString(),
        amountETH: ethers.formatEther(amount),
        executed: executed,
        canTrigger: canTrigger,
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
