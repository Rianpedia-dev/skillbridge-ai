import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { chatRoom, chatMessage, user } from "@/lib/db/schema";
import { desc, or, eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const rooms = await db.query.chatRoom.findMany({
            where: or(
                eq(chatRoom.participantOneId, session.user.id),
                eq(chatRoom.participantTwoId, session.user.id)
            ),
            with: {
                participantOne: true,
                participantTwo: true,
                messages: {
                    limit: 1,
                    orderBy: [desc(chatMessage.createdAt)],
                },
            },
            orderBy: [desc(chatRoom.updatedAt)],
        });

        return NextResponse.json({ rooms });
    } catch (error) {
        console.error("Error fetching chat rooms:", error);
        return NextResponse.json({ error: "Failed to fetch chat rooms" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { targetUserId } = await req.json();

        if (!targetUserId) {
            return NextResponse.json({ error: "Target user ID is required" }, { status: 400 });
        }

        // Check if room already exists
        const existingRoom = await db.query.chatRoom.findFirst({
            where: or(
                and(
                    eq(chatRoom.participantOneId, session.user.id),
                    eq(chatRoom.participantTwoId, targetUserId)
                ),
                and(
                    eq(chatRoom.participantOneId, targetUserId),
                    eq(chatRoom.participantTwoId, session.user.id)
                )
            ),
        });

        if (existingRoom) {
            return NextResponse.json({ room: existingRoom });
        }

        // Create new room
        const [newRoom] = await db
            .insert(chatRoom)
            .values({
                participantOneId: session.user.id,
                participantTwoId: targetUserId,
            })
            .returning();

        return NextResponse.json({ room: newRoom });
    } catch (error) {
        console.error("Error creating chat room:", error);
        return NextResponse.json({ error: "Failed to create chat room" }, { status: 500 });
    }
}
