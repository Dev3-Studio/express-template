import NodeCache from 'node-cache';

// Default settings
const DEFAULT_STALE_TTL = 10; // 10 seconds

// Cache factory configuration interface
export interface CacheConfig {
    staleTimeTTL?: number;
}

export class Cache {

    private staleTimeTTL: number;
    private blockCache: NodeCache;
    private timeCache: NodeCache;
    
    constructor(config: CacheConfig = {}) {
        // Extract configuration with defaults
        const {
            staleTimeTTL = DEFAULT_STALE_TTL,
        } = config;
        
        // Store configuration
        this.staleTimeTTL = staleTimeTTL;
        
        // Create caches
        this.blockCache = new NodeCache({ stdTTL: staleTimeTTL, useClones: false });
        this.timeCache = new NodeCache({ stdTTL: staleTimeTTL, useClones: false });
    }
    
    /**
     * Wrap an async function with time-based caching
     */
    // deno-lint-ignore no-explicit-any
    createTimeCachedFunction<T extends (...args: any[]) => Promise<any>>(
        fn: T,
        keyPrefix: string = '',
        ttl: number = this.staleTimeTTL,
    ): T {
        return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
            // Create a cache key from the function arguments
            const cacheKey = `${keyPrefix}:${JSON.stringify(args)}`;
            
            // Check if we have a cached promise
            const cachedResult = this.timeCache.get<Promise<ReturnType<T>>>(cacheKey);
            if (cachedResult) return cachedResult;
            
            // Execute the function and cache its promise
            const resultPromise = fn(...args);
            this.timeCache.set(cacheKey, resultPromise, ttl);
            
            try {
                return await resultPromise;
            } catch (error) {
                // Remove failed promises from cache
                this.timeCache.del(cacheKey);
                throw error;
            }
        }) as T;
    }
    
    /**
     * Clear all cached items
     */
    clearAllCaches(): void {
        this.blockCache.flushAll();
        this.timeCache.flushAll();
    }
    
    /**
     * Clear block cache
     */
    clearBlockCache(): void {
        this.blockCache.flushAll();
    }
    
    /**
     * Clear time cache
     */
    clearTimeCache(): void {
        this.timeCache.flushAll();
    }
    
    /**
     * Clear cached items with a specific key prefix
     */
    clearCachePrefix(prefix: string): void {
        this.blockCache.keys().forEach((key) => {
            if (key.startsWith(prefix)) this.blockCache.del(key);
        });
        this.timeCache.keys().forEach((key) => {
            if (key.startsWith(prefix)) this.timeCache.del(key);
        });
    }
}

export const cache = new Cache({});