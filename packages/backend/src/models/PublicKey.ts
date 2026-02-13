import mongoose, { Schema, Document } from 'mongoose';

export interface IPublicKey extends Document {
    address: string;
    publicKey: string;
    signature?: string;
    createdAt: Date;
    updatedAt: Date;
}

const publicKeySchema = new Schema<IPublicKey>({
    address: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
    },
    publicKey: {
        type: String,
        required: true
    },
    signature: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

publicKeySchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export default mongoose.model<IPublicKey>('PublicKey', publicKeySchema);
