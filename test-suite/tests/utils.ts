/**
 * Utility functions for test suite
 * Handles logging, file operations, and common tasks
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadEnv() {
    // Try loading from test-suite root (one level up from tests/)
    const envPath = path.resolve(__dirname, '../.env');
    dotenv.config({ path: envPath });
}

export interface TransactionLog {
    step: string;
    description: string;
    timestamp: string;
    input: any;
    output: any;
    transactionHash?: string;
    explorerUrl?: string;
    gasUsed?: string;
    status?: 'success' | 'failed';
}

export class TestLogger {
    private sessionDir: string;

    constructor(sessionId: string) {
        // Resolve path relative to this file (in tests/) 
        // Go up one level to test-suite/
        const suiteRoot = path.join(__dirname, '..');

        // Handle if sessionId already has "session_" prefix
        const cleanSessionId = sessionId.startsWith('session_') ? sessionId : `session_${sessionId}`;

        this.sessionDir = path.join(suiteRoot, 'test-results', cleanSessionId);
        fs.mkdirSync(this.sessionDir, { recursive: true });
        console.log(`📁 Test session: ${this.sessionDir}`);
    }

    /**
     * Log a transaction with all details
     */
    logTransaction(log: TransactionLog): void {
        const { step, description, timestamp, input, output, transactionHash, explorerUrl, gasUsed } = log;

        // Create step log file
        const logFile = path.join(this.sessionDir, `step_${step}.log`);

        const content = `
==================================
Step ${step}: ${description}
Timestamp: ${timestamp}
==================================

${transactionHash ? `Transaction Hash: ${transactionHash}` : ''}
${explorerUrl ? `Explorer: ${explorerUrl}` : ''}
${gasUsed ? `Gas Used: ${gasUsed}` : ''}

--- Input ---
${JSON.stringify(input, null, 2)}

--- Output ---
${JSON.stringify(output, null, 2)}

`.trim();

        fs.writeFileSync(logFile, content);

        // Also save as JSON for programmatic access
        const jsonFile = path.join(this.sessionDir, `step_${step}.json`);
        fs.writeFileSync(jsonFile, JSON.stringify(log, null, 2));

        console.log(`✅ Step ${step}: ${description}`);
        if (transactionHash) {
            console.log(`   TX: ${transactionHash}`);
        }
        console.log(`   Log: ${logFile}`);
    }

    /**
     * Save any data to session directory
     */
    saveData(filename: string, data: any): void {
        const filePath = path.join(this.sessionDir, filename);
        const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
        fs.writeFileSync(filePath, content);
    }

    /**
     * Get session directory path
     */
    getSessionDir(): string {
        return this.sessionDir;
    }
}

export function formatTimestamp(): string {
    return new Date().toISOString();
}

export function generateSessionId(): string {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-').split('T').join('_').slice(0, -5);
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
