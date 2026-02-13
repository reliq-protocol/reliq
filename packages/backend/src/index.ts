import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import vaultRoutes from './routes/vault.js';
import heartbeatRoutes from './routes/heartbeat.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ============ Middleware ============
app.use(cors());
app.use(express.json());

// ============ Database Connection ============
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/relic';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// ============ Routes ============
app.use('/api/auth', authRoutes);
app.use('/api/vault', vaultRoutes);
app.use('/api/heartbeat', heartbeatRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============ Start Server ============
app.listen(PORT, () => {
    console.log(`🚀 Reliq backend server running on http://localhost:${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 MongoDB: ${MONGODB_URI}`);

    // TODO: Start background monitors when implemented
    // startHeartbeatMonitor();
    // startCTXMonitor();
});

export default app;
