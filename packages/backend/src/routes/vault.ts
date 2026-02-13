import express, { Request, Response } from 'express';
import VaultMessage from '../models/VaultMessage.js';
import { authenticateJWT, AuthRequest } from './auth.js';

const router = express.Router();

// ============ Get Vault Messages for Beneficiary ============
router.get('/messages', authenticateJWT, async (req: Request, res: Response) => {
    try {
        const beneficiaryAddress = (req as any).user!.address;

        const messages = await VaultMessage.find({
            beneficiary: beneficiaryAddress,
            executed: true
        }).sort({ executedAt: -1 });

        res.json({ messages });

    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// ============ Get Specific Vault Message ============
router.get('/message/:vaultId', async (req: Request, res: Response) => {
    try {
        const vaultId = parseInt(String(req.params.vaultId));

        const message = await VaultMessage.findOne({ vaultId });

        if (!message) {
            return res.status(404).json({ error: 'Vault message not found' });
        }

        res.json({
            vaultId: message.vaultId,
            beneficiary: message.beneficiary,
            sender: message.sender,
            amount: message.amount,
            encryptedMessage: message.encryptedMessage,
            executedAt: message.executedAt
        });

    } catch (error) {
        console.error('Get message error:', error);
        res.status(500).json({ error: 'Failed to fetch message' });
    }
});

// ============ Store Vault Message (Internal - called by CTX monitor) ============
router.post('/message', async (req: Request, res: Response) => {
    try {
        const { vaultId, beneficiary, sender, amount, encryptedMessage } = req.body;

        await VaultMessage.findOneAndUpdate(
            { vaultId },
            {
                vaultId,
                beneficiary: beneficiary.toLowerCase(),
                sender: sender.toLowerCase(),
                amount,
                encryptedMessage,
                executed: true,
                executedAt: new Date()
            },
            { upsert: true, new: true }
        );

        console.log(`✅ Vault message stored for vaultId ${vaultId}`);
        res.json({ success: true });

    } catch (error) {
        console.error('Store message error:', error);
        res.status(500).json({ error: 'Failed to store message' });
    }
});

export default router;
