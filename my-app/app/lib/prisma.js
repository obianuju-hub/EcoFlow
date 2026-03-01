import { PrismaClient } from "@prisma/client";

const globalForPrisma = global;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Disconnect on hot reload in development
if (process.env.NODE_ENV !== "production") {
  if (module.hot) {
    module.hot.dispose(async () => {
      await prisma.$disconnect();
    });
  }
}

export default prisma;
