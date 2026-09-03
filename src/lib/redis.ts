import Redis from "ioredis";

let redis: Redis | null = null;

function getRedisClient(): Redis {
  if (!redis) {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      enableReadyCheck: true,
      lazyConnect: true,
    });

    redis.on("error", (err) => {
      console.error("Redis error:", err);
    });

    redis.on("connect", () => {
      console.log("Redis connected");
    });
  }

  return redis;
}

// ─── Cache Helpers ──────────────────────────────────────────────────────

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const client = getRedisClient();
    const data = await client.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (error) {
    console.error("Cache get error:", error);
    return null;
  }
}

export async function setCache<T>(
  key: string,
  value: T,
  ttl: number = 3600
): Promise<void> {
  try {
    const client = getRedisClient();
    await client.set(key, JSON.stringify(value), "EX", ttl);
  } catch (error) {
    console.error("Cache set error:", error);
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    const client = getRedisClient();
    await client.del(key);
  } catch (error) {
    console.error("Cache delete error:", error);
  }
}

export async function deleteCachePattern(pattern: string): Promise<void> {
  try {
    const client = getRedisClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
    }
  } catch (error) {
    console.error("Cache pattern delete error:", error);
  }
}

export async function incrementCache(key: string, ttl?: number): Promise<number> {
  try {
    const client = getRedisClient();
    const value = await client.incr(key);
    if (ttl && value === 1) {
      await client.expire(key, ttl);
    }
    return value;
  } catch (error) {
    console.error("Cache increment error:", error);
    return 0;
  }
}

// ─── Rate Limiting ──────────────────────────────────────────────────────

export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  try {
    const client = getRedisClient();
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const windowKey = `${key}:${Math.floor(now / windowMs)}`;

    const pipeline = client.pipeline();
    pipeline.incr(windowKey);
    pipeline.expire(windowKey, windowSeconds);
    pipeline.ttl(windowKey);

    const results = await pipeline.exec();
    const count = (results?.[0]?.[1] as number) || 0;
    const ttl = (results?.[2]?.[1] as number) || windowSeconds;

    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      resetAt: now + ttl * 1000,
    };
  } catch (error) {
    console.error("Rate limit error:", error);
    return { allowed: true, remaining: limit, resetAt: Date.now() + windowSeconds * 1000 };
  }
}

// ─── Session Management ─────────────────────────────────────────────────

export async function setSession(
  sessionId: string,
  data: Record<string, any>,
  ttl: number = 86400
): Promise<void> {
  await setCache(`session:${sessionId}`, data, ttl);
}

export async function getSessionData<T>(
  sessionId: string
): Promise<T | null> {
  return getCache<T>(`session:${sessionId}`);
}

export async function deleteSession(sessionId: string): Promise<void> {
  await deleteCache(`session:${sessionId}`);
}

// ─── Cart Caching ───────────────────────────────────────────────────────

export async function cacheCart(
  cartId: string,
  data: any,
  ttl: number = 3600
): Promise<void> {
  await setCache(`cart:${cartId}`, data, ttl);
}

export async function getCachedCart(cartId: string): Promise<any | null> {
  return getCache(`cart:${cartId}`);
}

export async function invalidateCart(cartId: string): Promise<void> {
  await deleteCache(`cart:${cartId}`);
}

// ─── Product Caching ────────────────────────────────────────────────────

export async function cacheProduct(
  productId: string,
  data: any,
  ttl: number = 1800
): Promise<void> {
  await setCache(`product:${productId}`, data, ttl);
}

export async function getCachedProduct(productId: string): Promise<any | null> {
  return getCache(`product:${productId}`);
}

export async function invalidateProduct(productId: string): Promise<void> {
  await deleteCache(`product:${productId}`);
  await deleteCachePattern(`products:*`);
}

export async function invalidateProductList(): Promise<void> {
  await deleteCachePattern(`products:*`);
}

// ─── Search Caching ─────────────────────────────────────────────────────

export async function cacheSearchResults(
  query: string,
  filters: string,
  results: any,
  ttl: number = 300
): Promise<void> {
  const key = `search:${query}:${filters}`;
  await setCache(key, results, ttl);
}

export async function getCachedSearchResults(
  query: string,
  filters: string
): Promise<any | null> {
  const key = `search:${query}:${filters}`;
  return getCache(key);
}

// ─── Analytics Caching ──────────────────────────────────────────────────

export async function cacheAnalytics(
  type: string,
  data: any,
  ttl: number = 300
): Promise<void> {
  await setCache(`analytics:${type}`, data, ttl);
}

export async function getCachedAnalytics(type: string): Promise<any | null> {
  return getCache(`analytics:${type}`);
}

// ─── Queue Management ───────────────────────────────────────────────────

export async function addToQueue(
  queueName: string,
  data: any
): Promise<void> {
  try {
    const client = getRedisClient();
    await client.lpush(`queue:${queueName}`, JSON.stringify(data));
  } catch (error) {
    console.error("Queue add error:", error);
  }
}

export async function processQueue(
  queueName: string,
  handler: (data: any) => Promise<void>,
  maxRetries: number = 3
): Promise<void> {
  try {
    const client = getRedisClient();
    const data = await client.rpop(`queue:${queueName}`);

    if (!data) return;

    const item = JSON.parse(data);

    try {
      await handler(item);
    } catch (error) {
      if ((item.retries || 0) < maxRetries) {
        item.retries = (item.retries || 0) + 1;
        await client.lpush(`queue:${queueName}:retry`, JSON.stringify(item));
      } else {
        await client.lpush(`queue:${queueName}:failed`, JSON.stringify(item));
      }
    }
  } catch (error) {
    console.error("Queue process error:", error);
  }
}

export async function getQueueLength(queueName: string): Promise<number> {
  try {
    const client = getRedisClient();
    return await client.llen(`queue:${queueName}`);
  } catch (error) {
    console.error("Queue length error:", error);
    return 0;
  }
}

// ─── Health Check ───────────────────────────────────────────────────────

export async function checkRedisHealth(): Promise<boolean> {
  try {
    const client = getRedisClient();
    const result = await client.ping();
    return result === "PONG";
  } catch (error) {
    console.error("Redis health check failed:", error);
    return false;
  }
}

// ─── Cleanup ────────────────────────────────────────────────────────────

export async function disconnectRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}
