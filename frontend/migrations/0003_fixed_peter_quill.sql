ALTER TABLE "users" ALTER COLUMN "favorite_prospects" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "favorite_prospects" SET DEFAULT '{}'::text[];