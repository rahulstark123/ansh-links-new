-- Traffic events table for analytics overview and traffic logs

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

ALTER TABLE "TrafficEvent"
  ADD CONSTRAINT "TrafficEvent_wid_fkey"
  FOREIGN KEY ("wid") REFERENCES "Workspace"("wid") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TrafficEvent"
  ADD CONSTRAINT "TrafficEvent_profileId_fkey"
  FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "TrafficEvent_wid_idx" ON "TrafficEvent"("wid");
CREATE INDEX IF NOT EXISTS "TrafficEvent_wid_createdAt_idx" ON "TrafficEvent"("wid", "createdAt");
CREATE INDEX IF NOT EXISTS "TrafficEvent_wid_action_idx" ON "TrafficEvent"("wid", "action");
CREATE INDEX IF NOT EXISTS "TrafficEvent_sessionId_idx" ON "TrafficEvent"("sessionId");
