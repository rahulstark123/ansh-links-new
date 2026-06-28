-- TrafficEvent table for analytics and traffic logs (synced with Prisma)

CREATE TABLE IF NOT EXISTS "TrafficEvent" (
  "id" TEXT NOT NULL,
  "wid" INTEGER NOT NULL,
  "profileId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "details" TEXT,
  "linkId" TEXT,
  "ipAddress" TEXT,
  "country" TEXT,
  "countryCode" TEXT,
  "referrer" TEXT,
  "browser" TEXT,
  "device" TEXT,
  "userAgent" TEXT,
  "sessionId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TrafficEvent_pkey" PRIMARY KEY ("id")
);
