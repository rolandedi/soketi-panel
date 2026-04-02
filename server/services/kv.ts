import Redis from "ioredis";

let cachedRedis: Redis | null = null;

export function useRedis(): Redis {
  if (!cachedRedis) {
    const url = process.env.REDIS_URL || "redis://127.0.0.1:6379";

    cachedRedis = new Redis(url, {
      password: process.env.REDIS_PASSWORD,
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
    });
  }

  return cachedRedis;
}

export async function kvGet(key: string): Promise<string | null> {
  try {
    return await useRedis().get(key);
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
      await useRedis().setex(key, ttlSeconds, value);
    } else {
      await useRedis().set(key, value);
    }
  } catch {
    // Redis unavailable — fail silently
  }
}

export async function kvKeys(pattern: string): Promise<string[]> {
  try {
    return await useRedis().keys(pattern);
  } catch {
    return [];
  }
}

export async function kvMget(keys: string[]): Promise<(string | null)[]> {
  try {
    return await useRedis().mget(keys);
  } catch {
    return new Array(keys.length).fill(null);
  }
}
