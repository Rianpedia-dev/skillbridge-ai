CREATE TABLE "chat_message" (
	"id" text PRIMARY KEY NOT NULL,
	"room_id" text NOT NULL,
	"sender_id" text NOT NULL,
	"content" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_room" (
	"id" text PRIMARY KEY NOT NULL,
	"participant_one_id" text NOT NULL,
	"participant_two_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_room_id_chat_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."chat_room"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_room" ADD CONSTRAINT "chat_room_participant_one_id_user_id_fk" FOREIGN KEY ("participant_one_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_room" ADD CONSTRAINT "chat_room_participant_two_id_user_id_fk" FOREIGN KEY ("participant_two_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;