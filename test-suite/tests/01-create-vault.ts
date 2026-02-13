/**
 * Step 1: Create Vault with BITE Encryption
 * 
 * This script:
 * 1. Creates a vault payload with beneficiary info and message
 * 2. Encrypts the payload using BITE SDK
 * 3. Submits the encrypted vault to the contract
 * 4. Logs all transaction details
 */

import { ethers } from 'ethers';
import { BITE } from '@skalenetwork/bite';
import { TestLogger, formatTimestamp, generateSessionId, loadEnv } from './utils'; loadEnv();


const RPC_URL = process.env.RPC_URL!;
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY!;
const CONTRACT_ADDRESS = '0x1F24BB1C838E169a383Eabc52302394c24FC1538';

// Test parameters (SMALL amount!)
const TEST_AMOUNT = ethers.parseEther('0.0001'); // 0.0001 ETH
const TIMEOUT = 300; // 5 minutes for testing

// Contract ABI
const VAULT_ABI = [
    'function createVault(bytes encryptedTx, bytes encryptedCondition) payable returns (uint256)',
    'function vaultCount() view returns (uint256)',
];

async function main() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Step 1: Create Vault with BITE Encryption');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    const sessionId = process.argv[2] || generateSessionId();
    const logger = new TestLogger(sessionId);

    // Setup
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, VAULT_ABI, wallet);
    const bite = new BITE("https://base-sepolia-testnet.skalenodes.com/v1/bite-v2-sandbox");

    console.log(`Deployer: ${wallet.address}`);
    console.log(`Contract: ${CONTRACT_ADDRESS}`);
    console.log(`Amount: ${ethers.formatEther(TEST_AMOUNT)} ETH`);
    console.log('');

    // Create vault payload
    const beneficiaryAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    const payload = {
        beneficiary: beneficiaryAddress,
        amount: TEST_AMOUNT.toString(),
        message: 'This is a test vault. If you receive this, the vault was successfully triggered!',
    };

    console.log('Vault payload:', payload);
    console.log('');

    // Convert payload to hex
    const payloadJson = JSON.stringify(payload);
    const payloadHex = '0x' + Buffer.from(payloadJson, 'utf8').toString('hex');

    console.log('Payload (hex):', payloadHex);
    console.log('');

    // Encrypt using BITE
    console.log('🔐 Encrypting payload with BITE...');
    const encryptedPayload = await bite.encryptMessage(payloadHex);
    console.log('Encrypted payload:', encryptedPayload.slice(0, 66) + '...');
    console.log('');

    // Get vault count before
    const vaultCountBefore = await contract.vaultCount();
    console.log(`Vault count before: ${vaultCountBefore}`);
    console.log('');

    // Prepare input log
    const input = {
        function: 'createVault(bytes,bytes)',
        parameters: {
            encryptedTx: encryptedPayload,
            encryptedCondition: encryptedPayload,
            value: (TEST_AMOUNT + ethers.parseEther('0.06')).toString(),
        },
        rawPayload: payload,
        payloadHex: payloadHex,
    };

    // Submit transaction
    console.log('📤 Submitting transaction...');
    const tx = await contract.createVault(encryptedPayload, encryptedPayload, {
        value: TEST_AMOUNT + ethers.parseEther('0.06'),
        gasLimit: 1000000
    });

    console.log(`Transaction hash: ${tx.hash}`);
    console.log('Waiting for confirmation...');
    console.log('');

    const receipt = await tx.wait();

    console.log('✅ Transaction confirmed!');
    console.log(`Block: ${receipt?.blockNumber}`);
    console.log(`Gas used: ${receipt?.gasUsed.toString()}`);
    console.log('');

    // Get new vault ID
    const vaultCountAfter = await contract.vaultCount();
    const vaultId = vaultCountAfter - 1n;

    console.log(`Created vault ID: ${vaultId}`);
    console.log(`Total vaults: ${vaultCountAfter}`);
    console.log('');

    // Prepare output log
    const output = {
        vaultId: vaultId.toString(),
        totalVaults: vaultCountAfter.toString(),
        blockNumber: receipt?.blockNumber,
        gasUsed: receipt?.gasUsed.toString(),
        status: receipt?.status === 1 ? 'success' : 'failed',
    };

    // Log transaction
    logger.logTransaction({
        step: '1',
        description: 'Create Vault with BITE Encryption',
        timestamp: formatTimestamp(),
        input,
        output,
        transactionHash: tx.hash,
        explorerUrl: `https://base-sepolia-testnet-explorer.skalenodes.com:10032/tx/${tx.hash}`,
        gasUsed: receipt?.gasUsed.toString(),
        status: receipt?.status === 1 ? 'success' : 'failed',
    });

    // Save vault ID for next steps
    logger.saveData('vault_id.txt', vaultId.toString());
    logger.saveData('session_id.txt', sessionId);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Step 1 Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main().catch(console.error);
