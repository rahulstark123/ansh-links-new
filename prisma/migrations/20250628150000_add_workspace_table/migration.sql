-- Create Workspace table
CREATE TABLE IF NOT EXISTS "Workspace" (
  "wid" SERIAL PRIMARY KEY,
  "userId" TEXT UNIQUE,
  "trialEndsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "subscriptionStatus" TEXT NOT NULL DEFAULT 'trial',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Backfill workspaces from existing profiles
INSERT INTO "Workspace" ("wid", "trialEndsAt", "subscriptionStatus", "createdAt", "updatedAt")
SELECT "wid", "trialEndsAt", "subscriptionStatus", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Profile"
ON CONFLICT ("wid") DO NOTHING;

-- Keep workspace id sequence aligned after manual inserts
SELECT setval(
  pg_get_serial_sequence('"Workspace"', 'wid'),
  COALESCE((SELECT MAX("wid") FROM "Workspace"), 1),
  (SELECT MAX("wid") IS NOT NULL FROM "Workspace")
);

-- Add wid to child tables and backfill from profile
ALTER TABLE "Link" ADD COLUMN IF NOT EXISTS "wid" INTEGER;
UPDATE "Link" l SET "wid" = p."wid" FROM "Profile" p WHERE l."profileId" = p."id" AND l."wid" IS NULL;
ALTER TABLE "Link" ALTER COLUMN "wid" SET NOT NULL;

ALTER TABLE "SocialLink" ADD COLUMN IF NOT EXISTS "wid" INTEGER;
UPDATE "SocialLink" l SET "wid" = p."wid" FROM "Profile" p WHERE l."profileId" = p."id" AND l."wid" IS NULL;
ALTER TABLE "SocialLink" ALTER COLUMN "wid" SET NOT NULL;

ALTER TABLE "DigitalCard" ADD COLUMN IF NOT EXISTS "wid" INTEGER;
UPDATE "DigitalCard" l SET "wid" = p."wid" FROM "Profile" p WHERE l."profileId" = p."id" AND l."wid" IS NULL;
ALTER TABLE "DigitalCard" ALTER COLUMN "wid" SET NOT NULL;

ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "wid" INTEGER;
UPDATE "Product" l SET "wid" = p."wid" FROM "Profile" p WHERE l."profileId" = p."id" AND l."wid" IS NULL;
ALTER TABLE "Product" ALTER COLUMN "wid" SET NOT NULL;

ALTER TABLE "Integration" ADD COLUMN IF NOT EXISTS "wid" INTEGER;
UPDATE "Integration" l SET "wid" = p."wid" FROM "Profile" p WHERE l."profileId" = p."id" AND l."wid" IS NULL;
ALTER TABLE "Integration" ALTER COLUMN "wid" SET NOT NULL;

-- Profile.wid should reference Workspace instead of auto-incrementing locally
ALTER TABLE "Profile" ALTER COLUMN "wid" DROP DEFAULT;

-- Move subscription fields to workspace only
ALTER TABLE "Profile" DROP COLUMN IF EXISTS "trialEndsAt";
ALTER TABLE "Profile" DROP COLUMN IF EXISTS "subscriptionStatus";

-- Foreign keys
ALTER TABLE "Profile"
  ADD CONSTRAINT "Profile_wid_fkey"
  FOREIGN KEY ("wid") REFERENCES "Workspace"("wid") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Link"
  ADD CONSTRAINT "Link_wid_fkey"
  FOREIGN KEY ("wid") REFERENCES "Workspace"("wid") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SocialLink"
  ADD CONSTRAINT "SocialLink_wid_fkey"
  FOREIGN KEY ("wid") REFERENCES "Workspace"("wid") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DigitalCard"
  ADD CONSTRAINT "DigitalCard_wid_fkey"
  FOREIGN KEY ("wid") REFERENCES "Workspace"("wid") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Product"
  ADD CONSTRAINT "Product_wid_fkey"
  FOREIGN KEY ("wid") REFERENCES "Workspace"("wid") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Integration"
  ADD CONSTRAINT "Integration_wid_fkey"
  FOREIGN KEY ("wid") REFERENCES "Workspace"("wid") ON DELETE CASCADE ON UPDATE CASCADE;

-- Indexes for wid-based filtering
CREATE INDEX IF NOT EXISTS "Link_wid_idx" ON "Link"("wid");
CREATE INDEX IF NOT EXISTS "SocialLink_wid_idx" ON "SocialLink"("wid");
CREATE INDEX IF NOT EXISTS "DigitalCard_wid_idx" ON "DigitalCard"("wid");
CREATE INDEX IF NOT EXISTS "Product_wid_idx" ON "Product"("wid");
CREATE INDEX IF NOT EXISTS "Integration_wid_idx" ON "Integration"("wid");
