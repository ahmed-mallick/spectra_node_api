const { LRUCache } = require('lru-cache');
const cacheConfig = require('../public/config/cacheConfig');

class CacheManager {
    constructor() {
        this.caches = new Map();
    }

    /**
     * Get or create cache instance
     * @param {string} cacheType - Type of cache from cacheConfig
     * @returns {LRUCache} Cache instance
     */
    getCache(cacheType) {
        if (!this.caches.has(cacheType)) {
            const config = cacheConfig[cacheType] || cacheConfig.default;
            const cache = new LRUCache({
                max: config.max,
                ttl: config.ttl
            });
            this.caches.set(cacheType, cache);
        }
        return this.caches.get(cacheType);
    }

    get(cacheType, key) {
        return this.getCache(cacheType).get(key);
    }

  
    set(cacheType, key, value) {
        this.getCache(cacheType).set(key, value);
    }

    delete(cacheType, key) {
        return this.getCache(cacheType).delete(key);
    }
}

module.exports = new CacheManager();