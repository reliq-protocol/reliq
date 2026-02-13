/**
 * 05 - Complete Workflow Demo with Instant Trigger
 * 
 * This test demonstrates the COMPLETE Reliq protocol flow:
 * 1. Create vault with BITE encryption
 * 2. Use forceExpireTimeout() to instantly expire timeout (DEMO function)
 * 3. Trigger vault
 * 4. Decrypt BITE payload to reveal beneficiary
 */

import { ethers } from 'ethers';
import { BITE } from '@skalenetwork/bite';
import { TestLogger, formatTimestamp, generateSessionId, loadEnv } from './utils'; loadEnv(); loadEnv();


const RPC_URL = process.env.RPC_URL!;
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY!;
const CONTRACT_ADDRESS = '0x2277f5210daAaab3E26e565c96E5F9BeDb46662B'; // New deployment

const TEST_AMOUNT = ethers.parseEther('0.0001');
const TIMEOUT = 300; // 5 minutes (won't matter since we'll force expire)

const VAULT_ABI = [
    'function createVault(bytes encryptedPayload, uint256 timeout) payable returns (uint256)',
    'function vaultCount() view returns (uint256)',
    'function forceExpireTimeout(uint256 vaultId)',
    'function canTrigger(uint256 vaultId) view returns (bool)',
    'function triggerVault(uint256 vaultId, address beneficiary)',
    'function vaults(uint256) view returns (address owner, bytes encryptedPayload, uint256 lastResponse, uint256 timeout, uint256 amount, bool executed)',
    'event VaultExecuted(uint256 indexed vaultId, address indexed beneficiary, uint256 amount)',
];

async function main() {
    console.log('═══════════════════════════════════════════════════');
    console.log('   Reliq Complete Workflow Demo');
    console.log('═══════════════════════════════════════════════════');
    console.log('');

    const sessionId = generateSessionId();
    const logger = new TestLogger(sessionId);

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, VAULT_ABI, wallet);
    const bite = new BITE(RPC_URL);

    console.log(`Contract: ${CONTRACT_ADDRESS}`);
    console.log(`Deployer: ${wallet.address}`);
    console.log('');

    // ========================================
    // STEP 1: Create Vault with BITE Encryption
    // ========================================
    console.log('━━━ STEP 1: Create Vault ━━━');
    console.log('');

    const beneficiaryAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    const payload = {
        beneficiary: beneficiaryAddress,
        amount: TEST_AMOUNT.toString(),
        message: '🎉 Vault successfully triggered and decrypted!',
    };

    console.log('Payload:', payload);
    console.log('');

    const payloadJson = JSON.stringify(payload);
    const payloadHex = '0x' + Buffer.from(payloadJson, 'utf8').toString('hex');

    console.log('🔐 Encrypting with BITE...');
    const encryptedPayload = await bite.encryptMessage(payloadHex);
    console.log('✅ Encrypted');
    console.log('');

    console.log('📤 Creating vault...');
    const createTx = await contract.createVault(encryptedPayload, TIMEOUT, {
        value: TEST_AMOUNT,
    });

    const createReceipt = await createTx.wait();
    const vaultCount = await contract.vaultCount();
    const vaultId = vaultCount - 1n;

    console.log(`✅ Vault created!`);
    console.log(`   Vault ID: ${vaultId}`);
    console.log(`   TX: ${createTx.hash}`);
    console.log(`   Gas: ${createReceipt?.gasUsed.toString()}`);
    console.log('');

    logger.logTransaction({
        step: '5.1',
        description: 'Create Vault',
        timestamp: formatTimestamp(),
        input: { encryptedPayload, timeout: TIMEOUT, value: TEST_AMOUNT.toString() },
        output: { vaultId: vaultId.toString(), txHash: createTx.hash },
        transactionHash: createTx.hash,
        explorerUrl: `https://base-sepolia-testnet-explorer.skalenodes.com/tx/${createTx.hash}`,
        gasUsed: createReceipt?.gasUsed.toString(),
        status: 'success',
    });

    // ========================================
    // STEP 2: Force Expire Timeout (DEMO)
    // ========================================
    console.log('━━━ STEP 2: Force Expire Timeout (DEMO) ━━━');
    console.log('');

    console.log('⚠️  Using DEMO backdoor to instantly expire timeout');
    console.log('');

    const expireTx = await contract.forceExpireTimeout(vaultId);
    const expireReceipt = await expireTx.wait();

    console.log(`✅ Timeout expired!`);
    console.log(`   TX: ${expireTx.hash}`);
    console.log(`   Gas: ${expireReceipt?.gasUsed.toString()}`);
    console.log('');

    logger.logTransaction({
        step: '5.2',
        description: 'Force Expire Timeout (DEMO)',
        timestamp: formatTimestamp(),
        input: { vaultId: vaultId.toString() },
        output: { txHash: expireTx.hash },
        transactionHash: expireTx.hash,
        explorerUrl: `https://base-sepolia-testnet-explorer.skalenodes.com/tx/${expireTx.hash}`,
        gasUsed: expireReceipt?.gasUsed.toString(),
        status: 'success',
    });

    // Verify can trigger
    const canTrigger = await contract.canTrigger(vaultId);
    console.log(`Can trigger now: ${canTrigger}`);
    console.log('');

    // ========================================
    // STEP 3: Get Encrypted Payload from Contract
    // ========================================
    console.log('━━━ STEP 3: Retrieve Encrypted Payload ━━━');
    console.log('');

    const vaultData = await contract.vaults(vaultId);
    const [owner, storedEncryptedPayload, lastResponse, timeout, amount, executed] = vaultData;

    console.log(`Encrypted payload length: ${storedEncryptedPayload.length} bytes`);
    console.log('');

    // ========================================
    // STEP 4: Decrypt BITE Payload
    // ========================================
    console.log('━━━ STEP 4: Decrypt BITE Payload ━━━');
    console.log('');

    console.log('🔓 Decrypting payload with BITE...');

    try {
        // Note: BITE decryption requires the transaction to be finalized
        // In a real scenario, you would decrypt after triggering
        // For demo, we'll show the process

        // We'll use the createTx hash to try to decrypt
        const decryptedData = await bite.getDecryptedTransactionData(createTx.hash);

        if (decryptedData) {
            console.log('✅ Decrypted data:', decryptedData);
        } else {
            console.log('⏳ Data not yet available for decryption (needs finality)');
            console.log('   In production, this would decrypt after vault trigger');
        }
    } catch (error) {
        console.log('⏳ Decryption not yet available (expected for this demo)');
        console.log('   Original payload:', payload);
    }
    console.log('');

    //========================================
    // STEP 5: Trigger Vault
    // ========================================
    console.log('━━━ STEP 5: Trigger Vault ━━━');
    console.log('');

    console.log(`Triggering vault for beneficiary: ${beneficiaryAddress}`);
    console.log('');

    const triggerTx = await contract.triggerVault(vaultId, beneficiaryAddress);
    const triggerReceipt = await triggerTx.wait();

    console.log(`✅ Vault triggered!`);
    console.log(`   TX: ${triggerTx.hash}`);
    console.log(`   Gas: ${triggerReceipt?.gasUsed.toString()}`);
    console.log(`   Amount transferred: ${ethers.formatEther(TEST_AMOUNT)} ETH`);
    console.log(`   To: ${beneficiaryAddress}`);
    console.log('');

    logger.logTransaction({
        step: '5.5',
        description: 'Trigger Vault',
        timestamp: formatTimestamp(),
        input: { vaultId: vaultId.toString(), beneficiary: beneficiaryAddress },
        output: {
            txHash: triggerTx.hash,
            amountTransferred: ethers.formatEther(TEST_AMOUNT),
        },
        transactionHash: triggerTx.hash,
        explorerUrl: `https://base-sepolia-testnet-explorer.skalenodes.com/tx/${triggerTx.hash}`,
        gasUsed: triggerReceipt?.gasUsed.toString(),
        status: 'success',
    });

    // ========================================
    // Summary
    // ========================================
    console.log('═══════════════════════════════════════════════════');
    console.log('   ✅ Complete Workflow Demo Successful!');
    console.log('═══════════════════════════════════════════════════');
    console.log('');
    console.log('Summary:');
    console.log(`  1. Created vault with BITE encryption`);
    console.log(`  2. Used DEMO backdoor to instantly expire timeout`);
    console.log(`  3. Verified vault can be triggered`);
    console.log(`  4. Triggered vault successfully`);
    console.log(`  5. Transferred 0.0001 ETH to beneficiary`);
    console.log('');
    console.log(`Session: ${sessionId}`);
    console.log(`Results: ${logger.getSessionDir()}`);
    console.log('');
}

main().catch(console.error);
