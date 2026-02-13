/**
 * Step 5: Complete Workflow Demo (With Heartbeat Expiration)
 * 
 * 1. Create Vault
 * 2. Force Expire (Backdoor)
 * 3. AI Agent Unlock
 * 4. Final Verification
 */

import { ethers } from 'ethers';
import { BITE } from '@skalenetwork/bite';
import { TestLogger, formatTimestamp, generateSessionId, loadEnv, sleep } from './utils'; loadEnv();


const RPC_URL = process.env.RPC_URL!;
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY!;
const CONTRACT_ADDRESS = '0x1F24BB1C838E169a383Eabc52302394c24FC1538';

const VAULT_ABI = [
    'function createVault(bytes encryptedTx, bytes encryptedCondition, uint256 timeout) payable returns (uint256)',
    'function unlockVault(uint256 vaultId) external',
    'function forceExpire(uint256 vaultId) external',
    'function getVault(uint256 vaultId) view returns (tuple(address owner, bytes encryptedCondition, uint256 amount, uint256 lastResponse, uint256 timeout, bool isUnlocked, bool executed))',
    'function vaultCount() view returns (uint256)',
];

async function main() {
    console.log('═══════════════════════════════════════════════════');
    console.log('   ReliQ Complete Workflow Demo (Backdoor Flow)');
    console.log('═══════════════════════════════════════════════════');
    console.log('');

    const sessionId = generateSessionId();
    const logger = new TestLogger(sessionId);

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, VAULT_ABI, wallet);
    const bite = new BITE("https://base-sepolia-testnet.skalenodes.com/v1/bite-v2-sandbox");

    console.log(`Contract: ${CONTRACT_ADDRESS}`);
    console.log(`Deployer: ${wallet.address}`);
    console.log('');

    // --- STEP 1: Create Vault ---
    console.log('━━━ STEP 1: Create Vault ━━━');
    const timeout = 3600; // 1 hour timeout
    const amount = ethers.parseEther('0.0001');
    const payload = {
        beneficiary: wallet.address,
        amount: amount.toString(),
        message: '🎉 Vault successfully triggered and decrypted!'
    };

    const payloadHex = '0x' + Buffer.from(JSON.stringify(payload)).toString('hex');
    const encrypted = await bite.encryptMessage(payloadHex);
    console.log('🔐 Encrypted with BITE');

    console.log('📤 Creating vault...');
    const ctxFee = ethers.parseEther('0.06');
    const tx1 = await contract.createVault(encrypted, encrypted, timeout, {
        value: amount + ctxFee
    });
    const receipt1 = await tx1.wait();

    const vaultCount = await contract.vaultCount();
    const id = vaultCount - 1n;
    console.log(`✅ Vault created! ID: ${id.toString()}`);
    logger.saveData('vault_id.txt', id.toString());

    logger.logTransaction({
        step: '1',
        description: 'Create Vault',
        timestamp: formatTimestamp(),
        input: { timeout, amount: '0.0001' },
        output: { vaultId: id.toString(), txHash: tx1.hash },
        transactionHash: tx1.hash
    });
    console.log('');

    // --- STEP 2: Force Expire ---
    console.log('━━━ STEP 2: Force Expire (Backdoor) ━━━');
    console.log('⚠️ Simulating owner inactivity (expiration)...');
    const tx2 = await contract.forceExpire(id);
    await tx2.wait();
    console.log('✅ Heartbeat expired via backdoor');

    logger.logTransaction({
        step: '2',
        description: 'Force Expire Heartbeat',
        timestamp: formatTimestamp(),
        input: { vaultId: id.toString() },
        output: { status: 'expired' },
        transactionHash: tx2.hash
    });
    console.log('');

    // --- STEP 3: AI Agent Unlocks ---
    console.log('━━━ STEP 3: AI Agent Unlocks ━━━');
    console.log('🔓 Unlocking vault...');
    const tx3 = await contract.unlockVault(id);
    await tx3.wait();
    console.log('✅ AI Agent triggered unlock');

    logger.logTransaction({
        step: '3',
        description: 'AI Agent Unlock',
        timestamp: formatTimestamp(),
        input: { vaultId: id.toString() },
        output: { status: 'unlocked' },
        transactionHash: tx3.hash
    });
    console.log('');

    // --- STEP 4: Final Verification ---
    console.log('━━━ STEP 4: Final Verification ━━━');
    console.log('⌛ Waiting for BITE execution...');
    await sleep(3000);
    const vault = await contract.getVault(id);
    console.log(`  Unlocked: ${vault.isUnlocked}`);
    console.log(`  Executed: ${vault.executed}`);

    if (vault.executed) {
        console.log('\n🌟 WORKFLOW COMPLETE: inheritance successfully settled!');
    } else {
        console.log('\n⏳ Still pending... (Note: Sandbox might take a few seconds)');
    }

    logger.logTransaction({
        step: '4',
        description: 'Final Verification',
        timestamp: formatTimestamp(),
        input: { vaultId: id.toString() },
        output: { isUnlocked: vault.isUnlocked, executed: vault.executed }
    });

    console.log('\n═══════════════════════════════════════════════════');
    console.log(`All logs saved to: ${logger.getSessionDir()}`);
}

main().catch(console.error);
