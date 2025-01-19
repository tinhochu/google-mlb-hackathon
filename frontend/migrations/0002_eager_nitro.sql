ALTER TABLE "users" ALTER COLUMN "favorite_prospects" SET DATA TYPE varchar[];--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "favorite_prospects" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "favorite_prospects" SET NOT NULL;