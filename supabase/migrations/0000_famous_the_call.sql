CREATE TYPE "public"."message_role" AS ENUM('user', 'model');--> statement-breakpoint
CREATE TABLE "c5chat_message" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"role" "message_role" NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "c5chat_session" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "c5chat_message" ADD CONSTRAINT "c5chat_message_session_id_c5chat_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."c5chat_session"("id") ON DELETE cascade ON UPDATE no action;