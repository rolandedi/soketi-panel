import Redis from "ioredis";

let cachedRedis: Redis | null = null;

function getRedis(): Redis {
  if (!cachedRedis) {
    const url = process.env.REDIS_URL || "redis://127.0.0.1:6379";
    cachedRedis = new Redis(url, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
    });
  }
  return cachedRedis;
}

export async function kvGet(key: string): Promise<string | null> {
  try {
    return await getRedis().get(key);
  } catch {
    return null;
  }
}

export async function kvSet(
  key: string,
  value: string,
  ttlSeconds?: number,
): Promise<void> {
  try {
    if (ttlSeconds) {
      await getRedis().setex(key, ttlSeconds, value);
    } else {
      await getRedis().set(key, value);
    }
  } catch {
    // Redis unavailable — fail silently
  }
}

export async function kvKeys(pattern: string): Promise<string[]> {
  try {
    return await getRedis().keys(pattern);
  } catch {
    return [];
  }
}
