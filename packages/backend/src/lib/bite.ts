/**
 * BITE SDK Wrapper
 * Provides encryption and decryption functionality using SKALE's BITE Protocol
 * 
 * Based on: https://docs.skale.space/developers/bite-protocol/typescript-sdk.md
 */

import { BITE } from '@skalenetwork/bite';

const BITE_RPC_URL = process.env.BITE_RPC_URL || process.env.RPC_URL || 'https://testnet.skalenodes.com/v1/juicy-low-small-testnet';

// Initialize BITE instance
export const bite = new BITE(BITE_RPC_URL);

/**
 * Encrypt a transaction for BITE
 * @param tx Transaction object with `to` and `data` fields
 * @returns Encrypted transaction ready for submission
 */
export async function encryptTransaction(tx: { to: string; data: string; gasLimit?: number }) {
    // Set default gasLimit if not provided (BITE SDK requirement)
    const txWithGas = {
        ...tx,
        gasLimit: String(tx.gasLimit || 300000) // Convert to string as required by BITE
    };

    return await bite.encryptTransaction(txWithGas);
}

/**
 * Encrypt a message using BITE threshold encryption
 * @param message Hex-encoded message to encrypt
 * @returns Encrypted hex string in RLP format
 */
export async function encryptMessage(message: string): Promise<string> {
    return await bite.encryptMessage(message);
}

/**
 * Get decrypted transaction data from a transaction hash
 * @param transactionHash Transaction hash to decrypt
 * @returns Object with original `data` and `to` fields
 */
export async function getDecryptedTransactionData(transactionHash: string) {
    return await bite.getDecryptedTransactionData(transactionHash);
}

/**
 * Get current BITE committee information
 * @returns Array of committee info (1-2 objects during rotation)
 */
export async function getCommitteesInfo() {
    return await bite.getCommitteesInfo();
}

export default {
    bite,
    encryptTransaction,
    encryptMessage,
    getDecryptedTransactionData,
    getCommitteesInfo
};
