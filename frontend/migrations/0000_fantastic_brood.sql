CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"favorite_prospects" jsonb[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
