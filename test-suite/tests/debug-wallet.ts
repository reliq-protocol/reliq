import { ethers } from 'ethers';


const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

console.log('Testing wallet creation...');
console.log('RPC_URL:', RPC_URL?.substring(0, 40));
console.log('PRIVATE_KEY length:', PRIVATE_KEY?.length);
console.log('PRIVATE_KEY sample:', PRIVATE_KEY?.substring(0, 10));
console.log('');

try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    console.log('✅ Provider created');

    const wallet = new ethers.Wallet(PRIVATE_KEY!, provider);
    console.log('✅ Wallet created');
    console.log('Wallet address:', wallet.address);
} catch (error: any) {
    console.log('❌ Error:', error.message);
    console.log('Error code:', error.code);
    console.log('Full error:', error);
}
