/**
 * BITE Utility Functions for Frontend
 * Client-side encryption utilities using BITE SDK
 */

import { BITE } from '@skalenetwork/bite';

// Initialize BITE with SKALE RPC endpoint
const RPC_URL = import.meta.env.VITE_RPC_URL || 'https://testnet.skalenodes.com/v1/juicy-low-small-testnet';
export const bite = new BITE(RPC_URL);

/**
 * Encrypt vault payload for BITE CTX
 * @param payload Vault data to encrypt: { beneficiary, amount, encryptedMessage }
 * @returns Encrypted payload ready for smart contract submission
 */
export async function encryptVaultPayload(payload: {
    beneficiary: string;
    amount: string;
    encryptedMessage: string;
}): Promise<string> {
    // Convert payload to hex string
    const payloadJson = JSON.stringify(payload);
    const payloadHex = '0x' + Buffer.from(payloadJson, 'utf8').toString('hex');

    // Encrypt using BITE
    return await bite.encryptMessage(payloadHex);
}

/**
 * Get BITE committees information
 * Useful for monitoring committee rotations
 */
export async function getBiteCommittees() {
    return await bite.getCommitteesInfo();
}

export default {
    bite,
    encryptVaultPayload,
    getBiteCommittees
};
