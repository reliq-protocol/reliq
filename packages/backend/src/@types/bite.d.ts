// Type declarations for @skalenetwork/bite
declare module '@skalenetwork/bite' {
    export interface Transaction {
        to: string;
        data: string;
        gasLimit?: string | number;
    }

    export interface CommitteeInfo {
        commonBLSPublicKey: string;
        epochId: number;
    }

    export interface DecryptedTransactionData {
        to: string;
        data: string;
    }

    export class BITE {
        constructor(endpoint: string);
        encryptTransaction(tx: Transaction): Promise<Transaction>;
        encryptMessage(message: string): Promise<string>;
        getDecryptedTransactionData(transactionHash: string): Promise<DecryptedTransactionData>;
        getCommitteesInfo(): Promise<CommitteeInfo[]>;
    }
}
