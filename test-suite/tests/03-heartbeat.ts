/**
 * Step 3: Send Heartbeat Response
 * 
 * Generate EIP-712 signature and send heartbeat response via agent
 */

import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { TestLogger, formatTimestamp, loadEnv } from './utils'; loadEnv();


const RPC_URL = process.env.RPC_URL!;
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY!;
const CONTRACT_ADDRESS = '0x2277f5210daAaab3E26e565c96E5F9BeDb46662B';

const VAULT_ABI = [
    'function respondViaAgent(uint256 vaultId, uint256 timestamp, uint256 nonce, bytes signature)',
    'function DOMAIN_SEPARATOR() view returns (bytes32)',
    'function HEARTBEAT_TYPEHASH() view returns (bytes32)',
];

async function main() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Step 3: Send Heartbeat Response');
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

    // Generate heartbeat parameters
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = Math.floor(Math.random() * 1000000);

    console.log(`Timestamp: ${timestamp}`);
    console.log(`Nonce: ${nonce}`);
    console.log('');

    // Get EIP-712 parameters
    const domainSeparator = await contract.DOMAIN_SEPARATOR();
    const heartbeatTypehash = await contract.HEARTBEAT_TYPEHASH();

    console.log(`Domain Separator: ${domainSeparator}`);
    console.log(`Heartbeat TypeHash: ${heartbeatTypehash}`);
    console.log('');

    // Create struct hash
    const structHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
            ['bytes32', 'uint256', 'uint256', 'uint256'],
            [heartbeatTypehash, vaultId, timestamp, nonce]
        )
    );

    // Create digest
    const digest = ethers.keccak256(
        ethers.solidityPacked(
            ['string', 'bytes32', 'bytes32'],
            ['\x19\x01', domainSeparator, structHash]
        )
    );

    console.log(`Struct Hash: ${structHash}`);
    console.log(`Digest: ${digest}`);
    console.log('');

    // Get network/chainId
    const network = await provider.getNetwork();
    const chainId = network.chainId;
    console.log(`Chain ID: ${chainId}`);

    // Sign digest directly to ensure it matches
    const signatureObject = wallet.signingKey.sign(digest);
    const signature = signatureObject.serialized;

    console.log(`Signature: ${signature}`);
    console.log('');

    // Prepare input log
    const input = {
        function: 'respondViaAgent(uint256,uint256,uint256,bytes)',
        parameters: {
            vaultId: vaultId,
            timestamp: timestamp,
            nonce: nonce,
            signature: signature,
        },
        eip712: {
            domainSeparator,
            heartbeatTypehash,
            structHash,
            digest,
        },
    };

    // Submit transaction
    console.log('📤 Sending heartbeat transaction...');
    const tx = await contract.respondViaAgent(vaultId, timestamp, nonce, signature);

    console.log(`Transaction hash: ${tx.hash}`);
    console.log('Waiting for confirmation...');
    console.log('');

    const receipt = await tx.wait();

    console.log('✅ Heartbeat recorded!');
    console.log(`Block: ${receipt?.blockNumber}`);
    console.log(`Gas used: ${receipt?.gasUsed.toString()}`);
    console.log('');

    // Prepare output log
    const output = {
        blockNumber: receipt?.blockNumber,
        gasUsed: receipt?.gasUsed.toString(),
        status: receipt?.status === 1 ? 'success' : 'failed',
    };

    logger.logTransaction({
        step: '3',
        description: 'Send Heartbeat Response',
        timestamp: formatTimestamp(),
        input,
        output,
        transactionHash: tx.hash,
        explorerUrl: `https://base-sepolia-testnet-explorer.skalenodes.com/tx/${tx.hash}`,
        gasUsed: receipt?.gasUsed.toString(),
        status: receipt?.status === 1 ? 'success' : 'failed',
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Step 3 Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main().catch(console.error);
