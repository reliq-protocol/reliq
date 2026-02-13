import mongoose, { Schema, Document } from 'mongoose';

export interface IInvitation extends Document {
    beneficiaryAddress: string;
    token: string;
    creatorAddress?: string;
    used: boolean;
    createdAt: Date;
    expiresAt: Date;
}

const invitationSchema = new Schema<IInvitation>({
    beneficiaryAddress: {
        type: String,
        required: true,
        lowercase: true,
        index: true
    },
    token: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    creatorAddress: {
        type: String,
        lowercase: true
    },
    used: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true,
        index: true
    }
});

// Auto-delete expired invitations
invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IInvitation>('Invitation', invitationSchema);
