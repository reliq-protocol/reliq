/**
 * Step 4: Verify Execution (BITE Callback Result)
 * 
 * Check if the vault has been successfully executed by BITE
 */

import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { TestLogger, formatTimestamp, loadEnv } from './utils'; loadEnv();


const RPC_URL = process.env.RPC_URL!;
const CONTRACT_ADDRESS = '0x1F24BB1C838E169a383Eabc52302394c24FC1538';

const VAULT_ABI = [
    'function getVault(uint256 vaultId) view returns (tuple(address owner, bytes encryptedCondition, uint256 amount, bool isUnlocked, bool executed))',
];

async function main() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Step 4: Verify Execution Status');
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
    const contract = new ethers.Contract(CONTRACT_ADDRESS, VAULT_ABI, provider);

    // Check status
    console.log('🔍 Checking final execution status...');
    const vault = await contract.getVault(vaultId);
    
    console.log('');
    console.log(`  Executed: ${vault.executed}`);
    console.log(`  Unlocked: ${vault.isUnlocked}`);
    
    if (vault.executed) {
        console.log('\n✅ SUCCESS: Vault has been executed!');
        console.log('   The BITE automated workflow is complete.');
    } else {
        console.log('\n⏳ Vault is still pending execution.');
    }

    // Prepare logs
    const output = {
        executed: vault.executed,
        isUnlocked: vault.isUnlocked,
        timestamp: formatTimestamp()
    };

    logger.logTransaction({
        step: '4',
        description: 'Verify Vault Execution',
        timestamp: formatTimestamp(),
        input: { vaultId },
        output
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Step 4 Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main().catch(console.error);
