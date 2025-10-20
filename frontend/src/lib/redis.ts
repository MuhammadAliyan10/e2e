import { Redis } from "ioredis";
import { logError, logger } from "./logger";

class RedisClient {
  private client: Redis | null = null;
  private isAvailableFlag: boolean = false;
  private connectionAttempted: boolean = false;

  constructor() {
    this.connect();
  }

  private connect() {
    if (this.connectionAttempted) return;
    this.connectionAttempted = true;

    try {
      const redisUrl = process.env.REDIS_URL;

      if (!redisUrl) {
        logger.warn({
          type: "redis_disabled",
          message: "REDIS_URL not configured, running without cache",
        });
        return;
      }

      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) {
            logger.warn({
              type: "redis_connection_failed",
              message: "Max retries reached, disabling Redis",
            });
            return null; // Stop retrying
          }
          return Math.min(times * 50, 2000);
        },
        lazyConnect: true,
        enableOfflineQueue: false,
      });

      this.client.on("connect", () => {
        this.isAvailableFlag = true;
        logger.info({
          type: "redis_connected",
          message: "Redis connection established",
        });
      });

      this.client.on("error", (error) => {
        this.isAvailableFlag = false;
        // Only log if not ECONNREFUSED (common in dev)
        if ((error as any).code !== "ECONNREFUSED") {
          logError(error, { type: "redis_error" });
        }
      });

      this.client.on("close", () => {
        this.isAvailableFlag = false;
        logger.info({
          type: "redis_disconnected",
          message: "Redis connection closed",
        });
      });

      // Attempt connection
      this.client.connect().catch((error) => {
        if ((error as any).code !== "ECONNREFUSED") {
          logger.warn({
            type: "redis_connection_failed",
            message: "Could not connect to Redis, running without cache",
          });
        }
        this.isAvailableFlag = false;
      });
    } catch (error) {
      logError(error, { type: "redis_initialization_failed" });
      this.client = null;
      this.isAvailableFlag = false;
    }
  }

  isAvailable(): boolean {
    return this.isAvailableFlag && this.client !== null;
  }

  async get(key: string): Promise<string | null> {
    if (!this.isAvailable()) return null;
    try {
      return await this.client!.get(key);
    } catch (error) {
      logError(error, { type: "redis_get_failed", key });
      return null;
    }
  }

  async set(
    key: string,
    value: string,
    mode?: string,
    duration?: number
  ): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      if (mode === "EX" && duration) {
        await this.client!.set(key, value, "EX", duration);
      } else {
        await this.client!.set(key, value);
      }
    } catch (error) {
      logError(error, { type: "redis_set_failed", key });
    }
  }

  async del(key: string | string[]): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      if (Array.isArray(key)) {
        if (key.length > 0) {
          await this.client!.del(...key);
        }
      } else {
        await this.client!.del(key);
      }
    } catch (error) {
      logError(error, { type: "redis_del_failed", key });
    }
  }

  async flushall(): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      await this.client!.flushall();
    } catch (error) {
      logError(error, { type: "redis_flushall_failed" });
    }
  }

  async quit(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      this.isAvailableFlag = false;
    }
  }
}

export const redis = new RedisClient();
