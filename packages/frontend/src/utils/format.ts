/**
 * Truncates an Ethereum address to show the first 4 and last 4 characters.
 * @param address The address to truncate
 * @returns The truncated address (e.g. 0x1234...5678)
 */
export const truncateAddress = (address: string | undefined): string => {
    if (!address) return '';
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
