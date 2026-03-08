CREATE TYPE "public"."order_status" AS ENUM('pending', 'accepted', 'in_progress', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('unpaid', 'escrow', 'released', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('customer', 'freelancer');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "freelancer_profile" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"bio" text,
	"location" text,
	"skills" text[],
	"portfolio_urls" text[],
	"hourly_rate" integer,
	"is_available" boolean DEFAULT true NOT NULL,
	"completed_projects" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "freelancer_profile_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "order" (
	"id" text PRIMARY KEY NOT NULL,
	"order_number" text NOT NULL,
	"service_id" text NOT NULL,
	"customer_id" text NOT NULL,
	"freelancer_id" text NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"payment_status" "payment_status" DEFAULT 'unpaid' NOT NULL,
	"total_price" integer NOT NULL,
	"requirements" text,
	"delivery_date" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "order_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "review" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"reviewer_id" text NOT NULL,
	"freelancer_id" text NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "review_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
CREATE TABLE "service" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"price" integer NOT NULL,
	"category_id" text,
	"provider_id" text NOT NULL,
	"is_on_site" boolean DEFAULT false NOT NULL,
	"location" text,
	"image" text,
	"rating" real DEFAULT 0,
	"review_count" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_category" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"icon" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "service_category_name_unique" UNIQUE("name"),
	CONSTRAINT "service_category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" "user_role" DEFAULT 'customer' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "freelancer_profile" ADD CONSTRAINT "freelancer_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_customer_id_user_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_freelancer_id_user_id_fk" FOREIGN KEY ("freelancer_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_reviewer_id_user_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_freelancer_id_user_id_fk" FOREIGN KEY ("freelancer_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service" ADD CONSTRAINT "service_category_id_service_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."service_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service" ADD CONSTRAINT "service_provider_id_user_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;