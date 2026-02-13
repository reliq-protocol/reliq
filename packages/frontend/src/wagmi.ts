import { http, createConfig } from 'wagmi'
import { injected } from 'wagmi/connectors'

// BITE V2 Sandbox 2 configuration
export const skaleChaosSepolia = {
    id: 103698795,
    name: 'BITE V2 Sandbox 2',
    nativeCurrency: {
        name: 'sFUEL',
        symbol: 'sFUEL',
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: ['https://base-sepolia-testnet.skalenodes.com/v1/bite-v2-sandbox'],
        },
    },
    blockExplorers: {
        default: {
            name: 'SKALE Explorer',
            url: 'https://base-sepolia-testnet-explorer.skalenodes.com:10032',
        },
    },
    testnet: true,
} as const

export const config = createConfig({
    chains: [skaleChaosSepolia],
    connectors: [
        injected({ target: 'metaMask' }),
    ],
    transports: {
        [skaleChaosSepolia.id]: http(),
    },
})
