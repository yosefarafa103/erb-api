import redis from "../redis.config.js";

export const cacheAside = async ({ key, ttl = 60 * 5, fetcher }) => {
  try {
    const cached = await redis.get(key);

    if (cached) {
      return {
        data: cached,
        source: "cache",
      };
    }

    const data = await fetcher();

    await redis.set(key, data, {
      ex: ttl,
    });

    return {
      data,
      source: "db",
    };
  } catch (err) {
    const data = await fetcher();

    return {
      data,
      source: "db-fallback",
    };
  }
};
