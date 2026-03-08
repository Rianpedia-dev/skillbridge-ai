CREATE TYPE "public"."balance_transaction_type" AS ENUM('earning', 'withdrawal', 'refund');--> statement-breakpoint
CREATE TYPE "public"."payout_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
ALTER TYPE "public"."user_role" ADD VALUE 'admin';--> statement-breakpoint
CREATE TABLE "balance_transaction" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"order_id" text,
	"type" "balance_transaction_type" NOT NULL,
	"amount" integer NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "freelancer_balance" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"balance" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "freelancer_balance_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "payout" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"amount" integer NOT NULL,
	"status" "payout_status" DEFAULT 'pending' NOT NULL,
	"bank_name" text,
	"bank_account_number" text,
	"bank_account_name" text,
	"note" text,
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "mayar_transaction_id" text;--> statement-breakpoint
ALTER TABLE "balance_transaction" ADD CONSTRAINT "balance_transaction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "balance_transaction" ADD CONSTRAINT "balance_transaction_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "freelancer_balance" ADD CONSTRAINT "freelancer_balance_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payout" ADD CONSTRAINT "payout_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;