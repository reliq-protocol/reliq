/**
 * Run All Tests - Complete Protocol Test Suite
 * 
 * Executes all test steps in sequence and generates comprehensive report
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { generateSessionId } from './utils';

const execAsync = promisify(exec);

const SESSION_ID = generateSessionId();

console.log('╔════════════════════════════════════════╗');
console.log('║  Reliq Protocol Complete Test Suite   ║');
console.log('╚════════════════════════════════════════╝');
console.log('');
console.log(`Session ID: ${SESSION_ID}`);
console.log('');

async function runStep(step: string, description: string, scriptPath: string, args: string[] = []) {
    console.log(`\n${'═'.repeat(50)}`);
    console.log(`Running ${step}: ${description}`);
    console.log(`${'═'.repeat(50)}\n`);

    try {
        const { stdout, stderr } = await execAsync(`npx tsx ${scriptPath} ${args.join(' ')}`);
        console.log(stdout);
        if (stderr && !stderr.includes('ExperimentalWarning')) {
            console.error(stderr);
        }
        return true;
    } catch (error: any) {
        console.error(`Error in ${step}: ${error.message}`);
        return false;
    }
}

async function main() {
    const results: { step: string; success: boolean }[] = [];

    // Step 1: Create Vault
    const step1Success = await runStep(
        'Step 1',
        'Create Vault with BITE Encryption',
        'tests/01-create-vault.ts',
        [SESSION_ID]
    );
    results.push({ step: 'Step 1', success: step1Success });

    if (!step1Success) {
        console.error('\n❌ Step 1 failed. Stopping test suite.');
        return;
    }

    // Step 2: Check Vault
    const step2Success = await runStep(
        'Step 2',
        'Check Vault Details',
        'tests/02-check-vault.ts',
        [SESSION_ID]
    );
    results.push({ step: 'Step 2', success: step2Success });

    // Step 3: Heartbeat
    const step3Success = await runStep(
        'Step 3',
        'Send Heartbeat Response',
        'tests/03-heartbeat.ts',
        [SESSION_ID]
    );
    results.push({ step: 'Step 3', success: step3Success });

    // Step 4: Check Trigger (will likely not trigger since we just sent heartbeat)
    const step4Success = await runStep(
        'Step 4',
        'Check Trigger Vault',
        'tests/04-trigger-vault.ts',
        [SESSION_ID]
    );
    results.push({ step: 'Step 4', success: step4Success });

    // Step 5: Complete Workflow Demo
    const step5Success = await runStep(
        'Step 5',
        'Complete Workflow Demo',
        'tests/05-complete-workflow-demo.ts',
        [SESSION_ID]
    );
    results.push({ step: 'Step 5', success: step5Success });

    // Print summary
    console.log('\n\n');
    console.log('╔════════════════════════════════════════╗');
    console.log('║         Test Suite Summary             ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('');
    console.log(`Session ID: ${SESSION_ID}`);
    console.log(`Results Directory: test-results/session_${SESSION_ID}`);
    console.log('');
    console.log('Results:');
    results.forEach(({ step, success }) => {
        console.log(`  ${success ? '✅' : '❌'} ${step}: ${success ? 'PASSED' : 'FAILED'}`);
    });
    console.log('');

    const allPassed = results.every(r => r.success);
    if (allPassed) {
        console.log('🎉 All tests completed successfully!');
    } else {
        console.log('⚠️  Some tests failed. Check logs for details.');
    }
}

main().catch(console.error);
