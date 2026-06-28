-- Synced with prisma/migrations/20250628150000_add_workspace_table/migration.sql
-- Workspace table: wid is the primary tenant identifier (1, 2, 3, ...)

CREATE TABLE IF NOT EXISTS "Workspace" (
  "wid" SERIAL PRIMARY KEY,
  "userId" TEXT UNIQUE,
  "trialEndsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "subscriptionStatus" TEXT NOT NULL DEFAULT 'trial',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
