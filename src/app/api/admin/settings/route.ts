import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET: Fetch all site settings (public for landing page)
export async function GET() {
    try {
        const settings = await db.select().from(siteSettings);
        return NextResponse.json(settings);
    } catch (error) {
        console.error("Site settings fetch error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// POST: Create a new site setting
export async function POST(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await request.json();
        const { key, value, label, type } = body;

        if (!key || !value) {
            return NextResponse.json(
                { error: "Key dan value wajib diisi" },
                { status: 400 }
            );
        }

        const [setting] = await db
            .insert(siteSettings)
            .values({
                key,
                value,
                label: label || key,
                type: type || "text",
            })
            .onConflictDoUpdate({
                target: siteSettings.key,
                set: {
                    value,
                    label: label || key,
                    type: type || "text",
                    updatedAt: new Date(),
                },
            })
            .returning();

        return NextResponse.json(setting);
    } catch (error) {
        console.error("Site setting create error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// DELETE: Delete a site setting by key
export async function DELETE(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get("key");

        if (!key) {
            return NextResponse.json(
                { error: "Key parameter wajib diisi" },
                { status: 400 }
            );
        }

        const [deleted] = await db
            .delete(siteSettings)
            .where(eq(siteSettings.key, key))
            .returning();

        if (!deleted) {
            return new NextResponse("Setting not found", { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Setting berhasil dihapus" });
    } catch (error) {
        console.error("Site setting delete error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
