let redis;
try {
  redis = require('redis');
} catch (error) {
  console.warn('Redis not installed, using in-memory cache fallback');
}

class CacheService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.memoryCache = new Map(); // Fallback in-memory cache
    this.useMemoryCache = false;
    this.connect();
  }

  async connect() {
    if (!redis) {
      console.log('📦 Using in-memory cache (Redis not available)');
      this.useMemoryCache = true;
      this.isConnected = true;
      return;
    }

    try {
      this.client = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      });

      this.client.on('error', (err) => {
        console.warn('Redis error, falling back to memory cache:', err.message);
        this.isConnected = false;
        this.useMemoryCache = true;
      });

      this.client.on('connect', () => {
        console.log('📦 Redis connected');
        this.isConnected = true;
        this.useMemoryCache = false;
      });

      await this.client.connect();
    } catch (error) {
      console.warn('Redis connection failed, using memory cache:', error.message);
      this.isConnected = false;
      this.useMemoryCache = true;
    }
  }

  async get(key) {
    if (this.useMemoryCache) {
      const cached = this.memoryCache.get(key);
      if (cached && cached.expiry > Date.now()) {
        return cached.value;
      }
      if (cached) {
        this.memoryCache.delete(key); // Remove expired
      }
      return null;
    }

    if (!this.isConnected) return null;
    
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    if (this.useMemoryCache) {
      this.memoryCache.set(key, {
        value,
        expiry: Date.now() + (ttl * 1000)
      });
      
      // Clean up memory cache periodically
      if (this.memoryCache.size > 1000) {
        this.cleanMemoryCache();
      }
      return true;
    }

    if (!this.isConnected) return false;
    
    try {
      if (ttl) {
        await this.client.setEx(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
      return true;
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  }

  async setex(key, ttl, value) {
    return this.set(key, value, ttl);
  }

  async del(key) {
    if (this.useMemoryCache) {
      this.memoryCache.delete(key);
      return true;
    }

    if (!this.isConnected) return false;
    
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Redis del error:', error);
      return false;
    }
  }

  async flush() {
    if (this.useMemoryCache) {
      this.memoryCache.clear();
      return true;
    }

    if (!this.isConnected) return false;
    
    try {
      await this.client.flushAll();
      return true;
    } catch (error) {
      console.error('Redis flush error:', error);
      return false;
    }
  }

  cleanMemoryCache() {
    const now = Date.now();
    for (const [key, value] of this.memoryCache.entries()) {
      if (value.expiry <= now) {
        this.memoryCache.delete(key);
      }
    }
  }

  async quit() {
    if (this.client && !this.useMemoryCache) {
      try {
        await this.client.quit();
      } catch (error) {
        console.error('Error closing Redis connection:', error);
      }
    }
    if (this.useMemoryCache) {
      this.memoryCache.clear();
    }
  }
}

module.exports = new CacheService();
