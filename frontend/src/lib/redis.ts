import { Redis } from "ioredis";
import { logger } from "./logger";

const getRedisUrl = (): string => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }

  const host = process.env.REDIS_HOST || "localhost";
  const port = process.env.REDIS_PORT || "6379";
  const password = process.env.REDIS_PASSWORD;

  return password
    ? `redis://:${password}@${host}:${port}`
    : `redis://${host}:${port}`;
};

class RedisClient {
  private client: Redis | null = null;
  private isConnected = false;
  private isRedisEnabled = process.env.REDIS_ENABLED !== "false";
  private hasLoggedFailure = false;

  constructor() {
    if (!this.isRedisEnabled) {
      logger.info({ type: "redis_disabled" });
      return;
    }

    try {
      this.client = new Redis(getRedisUrl(), {
        maxRetriesPerRequest: 3,
        enableOfflineQueue: false,
        lazyConnect: true,
        retryStrategy: (times) => {
          // Stop retrying after 3 attempts
          if (times > 3) {
            if (!this.hasLoggedFailure) {
              logger.warn({
                type: "redis_unavailable",
                message: "Redis unavailable, running without cache",
              });
              this.hasLoggedFailure = true;
            }
            return null; // Stop retrying
          }
          return Math.min(times * 100, 1000);
        },
        reconnectOnError: () => false, // Don't auto-reconnect
      });

      this.client.on("connect", () => {
        this.isConnected = true;
        this.hasLoggedFailure = false;
        logger.info({ type: "redis_connected" });
      });

      this.client.on("error", (err) => {
        this.isConnected = false;
        // Only log first error to avoid spam
        if (!this.hasLoggedFailure && err.message !== "Connection is closed.") {
          logger.error({
            type: "redis_connection_failed",
            error: err.message,
          });
          this.hasLoggedFailure = true;
        }
      });

      this.client.on("close", () => {
        this.isConnected = false;
      });

      // Attempt initial connection (non-blocking)
      this.client.connect().catch(() => {
        // Silently fail - will use database fallback
      });
    } catch (error) {
      logger.error({
        type: "redis_init_failed",
        error: (error as Error).message,
      });
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.client || !this.isConnected) {
      return null;
    }

    try {
      return await this.client.get(key);
    } catch {
      return null;
    }
  }

  async set(
    key: string,
    value: string,
    mode?: "EX",
    duration?: number
  ): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      return false;
    }

    try {
      if (mode === "EX" && duration) {
        await this.client.set(key, value, "EX", duration);
      } else {
        await this.client.set(key, value);
      }
      return true;
    } catch {
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      return false;
    }

    try {
      await this.client.del(key);
      return true;
    } catch {
      return false;
    }
  }

  isAvailable(): boolean {
    return this.isConnected && this.client !== null;
  }

  async quit(): Promise<void> {
    if (this.client && this.isConnected) {
      try {
        await this.client.quit();
      } catch {
        // Ignore quit errors
      }
      this.isConnected = false;
    }
  }
}

export const redis = new RedisClient();

// Graceful shutdown
if (process.env.NODE_ENV === "production") {
  const shutdown = async () => {
    await redis.quit();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
