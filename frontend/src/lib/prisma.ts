import { PrismaClient, Prisma } from "@prisma/client";
import { logger } from "./logger";

const prismaClientSingleton = () => {
  const logLevels: Prisma.LogLevel[] =
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"];

  return new PrismaClient({
    log: logLevels.map((level) => ({
      emit: "event",
      level,
    })),
    errorFormat: "minimal",
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

// Structured logging
prisma.$on("query" as never, (e: Prisma.QueryEvent) => {
  if (process.env.LOG_QUERIES === "true") {
    logger.debug({
      type: "prisma_query",
      query: e.query,
      params: e.params,
      duration: e.duration,
    });
  }
});

prisma.$on("error" as never, (e: Prisma.LogEvent) => {
  logger.error({
    type: "prisma_error",
    message: e.message,
    target: (e as any).target,
  });
});

// Graceful shutdown
if (process.env.NODE_ENV === "production") {
  process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}
