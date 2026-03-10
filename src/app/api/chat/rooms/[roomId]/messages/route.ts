import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { chatMessage, chatRoom } from "@/lib/db/schema";
import { asc, eq, and, or } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ roomId: string }> }
) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roomId } = await params;

    try {
        // Verify user is part of the room
        const room = await db.query.chatRoom.findFirst({
            where: and(
                eq(chatRoom.id, roomId),
                or(
                    eq(chatRoom.participantOneId, session.user.id),
                    eq(chatRoom.participantTwoId, session.user.id)
                )
            ),
        });

        if (!room) {
            return NextResponse.json({ error: "Room not found or access denied" }, { status: 404 });
        }

        const messages = await db.query.chatMessage.findMany({
            where: eq(chatMessage.roomId, roomId),
            orderBy: [asc(chatMessage.createdAt)],
            with: {
                sender: true,
            },
        });

        return NextResponse.json({ messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ roomId: string }> }
) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roomId } = await params;

    try {
        const { content } = await req.json();

        if (!content) {
            return NextResponse.json({ error: "Message content is required" }, { status: 400 });
        }

        // Verify user is part of the room
        const room = await db.query.chatRoom.findFirst({
            where: and(
                eq(chatRoom.id, roomId),
                or(
                    eq(chatRoom.participantOneId, session.user.id),
                    eq(chatRoom.participantTwoId, session.user.id)
                )
            ),
        });

        if (!room) {
            return NextResponse.json({ error: "Room not found or access denied" }, { status: 404 });
        }

        const [newMessage] = await db
            .insert(chatMessage)
            .values({
                roomId,
                senderId: session.user.id,
                content,
            })
            .returning();

        // Update room's updatedAt timestamp
        await db
            .update(chatRoom)
            .set({ updatedAt: new Date() })
            .where(eq(chatRoom.id, roomId));

        return NextResponse.json({ message: newMessage });
    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
}
