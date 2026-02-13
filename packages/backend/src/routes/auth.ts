import express, { Request, Response, NextFunction } from 'express';
import { SiweMessage } from 'siwe';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import PublicKey from '../models/PublicKey.js';
import Invitation from '../models/Invitation.js';

const router = express.Router();

interface NonceData {
    nonce: string;
    expires: number;
}

// Temporary nonce storage (use Redis in production)
const nonces = new Map<string, NonceData>();

const JWT_SECRET = process.env.JWT_SECRET || 'relic-secret-key-change-in-production';
const JWT_EXPIRY = '7d';

// Extend Express Request type
export interface AuthRequest extends Request {
    user?: { address: string };
}

// ============ GET Nonce ============
router.get('/nonce', (req: Request, res: Response) => {
    const nonce = randomBytes(16).toString('hex');
    nonces.set(nonce, {
        nonce,
        expires: Date.now() + 5 * 60 * 1000  // 5 minutes
    });

    res.json({ nonce });
});

// ============ SIWE Login ============
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { message, signature } = req.body;

        if (!message || !signature) {
            return res.status(400).json({ error: 'Missing message or signature' });
        }

        // Parse and verify SIWE message
        const siweMessage = new SiweMessage(message);
        const fields = await siweMessage.verify({ signature });

        // Verify nonce
        const nonceData = nonces.get(fields.data.nonce);
        if (!nonceData || nonceData.expires < Date.now()) {
            return res.status(400).json({ error: 'Invalid or expired nonce' });
        }
        nonces.delete(fields.data.nonce);

        // Generate JWT
        const token = jwt.sign(
            { address: fields.data.address.toLowerCase() },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY }
        );

        // Check if user has registered public key
        const publicKeyRecord = await PublicKey.findOne({
            address: fields.data.address.toLowerCase()
        });

        res.json({
            token,
            address: fields.data.address,
            hasPublicKey: !!publicKeyRecord
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({ error: 'Invalid signature or message' });
    }
});

// ============// ============ JWT Middleware ============
export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { address: string };
        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid or expired token' });
    }
}

// ============ Register Public Key ============
router.post('/register-key', authenticateJWT, async (req: Request, res: Response) => {
    try {
        const { publicKey, signature } = req.body;
        const address = (req as AuthRequest).user!.address;

        if (!publicKey) {
            return res.status(400).json({ error: 'Missing publicKey' });
        }

        // Upsert public key
        await PublicKey.findOneAndUpdate(
            { address },
            {
                address,
                publicKey,
                signature: signature || undefined,
                updatedAt: new Date()
            },
            { upsert: true, new: true }
        );

        console.log(`✅ Public key registered for ${address}`);
        res.json({ success: true });

    } catch (error) {
        console.error('Register key error:', error);
        res.status(500).json({ error: 'Failed to register public key' });
    }
});

// ============ Get Public Key (Public Endpoint) ============
router.get('/publickey/:address', async (req: Request, res: Response) => {
    try {
        const address = String(req.params.address).toLowerCase();
        const record = await PublicKey.findOne({ address });

        if (!record) {
            return res.status(404).json({ error: 'Public key not found' });
        }

        res.json({
            publicKey: record.publicKey,
            address: record.address
        });

    } catch (error) {
        console.error('Get public key error:', error);
        res.status(500).json({ error: 'Failed to fetch public key' });
    }
});

// ============ Send Invitation ============
router.post('/invite', async (req: Request, res: Response) => {
    try {
        const { beneficiaryAddress, creatorAddress } = req.body;

        if (!beneficiaryAddress) {
            return res.status(400).json({ error: 'Missing beneficiaryAddress' });
        }

        // Generate invitation token
        const token = randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        await Invitation.create({
            beneficiaryAddress: beneficiaryAddress.toLowerCase(),
            token,
            creatorAddress: creatorAddress?.toLowerCase(),
            expiresAt
        });

        const inviteUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/register?invite=${token}`;

        console.log(`📧 Invitation created for ${beneficiaryAddress}`);
        console.log(`Invite URL: ${inviteUrl}`);

        res.json({
            success: true,
            inviteUrl,
            expiresAt
        });

    } catch (error) {
        console.error('Invite error:', error);
        res.status(500).json({ error: 'Failed to create invitation' });
    }
});

// ============ Verify Invitation ============
router.get('/invite/:token', async (req: Request, res: Response) => {
    try {
        const invitation = await Invitation.findOne({
            token: req.params.token,
            used: false,
            expiresAt: { $gt: new Date() }
        });

        if (!invitation) {
            return res.status(404).json({ error: 'Invalid or expired invitation' });
        }

        res.json({
            beneficiaryAddress: invitation.beneficiaryAddress,
            createdAt: invitation.createdAt,
            expiresAt: invitation.expiresAt
        });

    } catch (error) {
        console.error('Verify invite error:', error);
        res.status(500).json({ error: 'Failed to verify invitation' });
    }
});

export default router;
