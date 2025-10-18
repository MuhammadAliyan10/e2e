import { pino } from "pino";

const isDevelopment = process.env.NODE_ENV === "development";
const isServer = typeof window === "undefined";

// Determine if we're in a Node.js environment where pino-pretty can work
const canUsePretty = isServer && isDevelopment && !process.env.NEXT_RUNTIME;

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? "debug" : "info"),
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  browser: {
    asObject: true,
  },
  ...(canUsePretty && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  }),
});

export type LogContext = {
  type: string;
  [key: string]: unknown;
};

export const logError = (error: unknown, context?: LogContext): void => {
  const err = error as Error;
  logger.error({
    ...context,
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name,
    },
  });
};
