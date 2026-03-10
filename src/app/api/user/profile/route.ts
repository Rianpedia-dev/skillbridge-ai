import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// PATCH /api/user/profile — Update current user's general profile
export async function PATCH(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, image } = body;

        // Ensure there is something to update
        if (name === undefined && image === undefined) {
            return NextResponse.json(
                { error: "Tidak ada data untuk diperbarui" },
                { status: 400 }
            );
        }

        const updateData: Record<string, any> = { updatedAt: new Date() };
        if (name !== undefined) updateData.name = name;
        if (image !== undefined) updateData.image = image;

        const [updatedUser] = await db
            .update(user)
            .set(updateData)
            .where(eq(user.id, session.user.id))
            .returning();

        if (!updatedUser) {
            return NextResponse.json(
                { error: "Pengguna tidak ditemukan" },
                { status: 404 }
            );
        }

        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        console.error("Error updating user profile:", error);
        return NextResponse.json(
            { error: "Gagal menyimpan detail profil" },
            { status: 500 }
        );
    }
}
