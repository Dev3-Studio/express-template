const blockData: { [chainId: number]: { number: number, hash: string, sequenceNumber: bigint } } = {};

interface SetBlockData {
    chainId: number;
    blockNumber: number;
    blockHash: string;
    sequenceNumber: bigint;
}

export function setBlockData(options: SetBlockData) {
    const { chainId, blockNumber, blockHash, sequenceNumber } = options;
    const currentData = blockData[chainId];
    if (!currentData) {
        blockData[chainId] = { number: blockNumber, hash: blockHash, sequenceNumber };
        return;
    }
    
    if (blockNumber > currentData.number) {
        blockData[chainId] = { number: blockNumber, hash: blockHash, sequenceNumber };
    }
    
    if (blockNumber === currentData.number && sequenceNumber > currentData.sequenceNumber) {
        blockData[chainId] = { number: blockNumber, hash: blockHash, sequenceNumber };
    }
}

export function getBlockNumber(chainId: number): number | undefined {
    return blockData[chainId]?.number;
}

export function getBlockHash(chainId: number): string | undefined {
    return blockData[chainId]?.hash;
}