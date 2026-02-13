import mongoose, { Schema, Document } from 'mongoose';

export interface IVaultMessage extends Document {
    vaultId: number;
    beneficiary: string;
    sender: string;
    amount: string;
    encryptedMessage: string;
    executed: boolean;
    executedAt?: Date;
    createdAt: Date;
}

const vaultMessageSchema = new Schema<IVaultMessage>({
    vaultId: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    beneficiary: {
        type: String,
        required: true,
        lowercase: true,
        index: true
    },
    sender: {
        type: String,
        required: true,
        lowercase: true
    },
    amount: {
        type: String,
        required: true
    },
    encryptedMessage: {
        type: String,
        required: true
    },
    executed: {
        type: Boolean,
        default: false
    },
    executedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model<IVaultMessage>('VaultMessage', vaultMessageSchema);
