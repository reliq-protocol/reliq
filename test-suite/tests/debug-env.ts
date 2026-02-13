

console.log('=== ENV Debug ===');
console.log('Config result:', result.error ? `Error: ${result.error}` : 'Success');
console.log('Parsed keys:', Object.keys(result.parsed || {}));
console.log('');

console.log('RPC_URL:', process.env.RPC_URL?.substring(0, 50));
console.log('DEPLOYER_PRIVATE_KEY exists:', !!process.env.DEPLOYER_PRIVATE_KEY);
console.log('DEPLOYER_PRIVATE_KEY type:', typeof process.env.DEPLOYER_PRIVATE_KEY);
console.log('DEPLOYER_PRIVATE_KEY length:', process.env.DEPLOYER_PRIVATE_KEY?.length);
console.log('DEPLOYER_PRIVATE_KEY value:', process.env.DEPLOYER_PRIVATE_KEY);
console.log('');

// Test if it starts with 0x
const key = process.env.DEPLOYER_PRIVATE_KEY;
if (key) {
    console.log('Starts with 0x?', key.startsWith('0x'));
    console.log('First 10 chars:', key.substring(0, 10));
    console.log('Has whitespace?', /\s/.test(key));
    console.log('Actual length:', key.length);
}
