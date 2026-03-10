import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { service } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { error: "ID layanan wajib disertakan" },
                { status: 400 }
            );
        }

        const targetService = await db.query.service.findFirst({
            where: eq(service.id, id),
            with: {
                category: true,
                provider: {
                    columns: {
                        id: true,
                        name: true,
                        image: true,
                    },
                    with: {
                        freelancerProfile: true,
                    }
                },
            },
        });

        if (!targetService) {
            return NextResponse.json(
                { error: "Layanan tidak ditemukan" },
                { status: 404 }
            );
        }

        return NextResponse.json({ service: targetService });
    } catch (error) {
        console.error("Error fetching service detail:", error);
        return NextResponse.json(
            { error: "Gagal memuat detail layanan" },
            { status: 500 }
        );
    }
}

// PUT /api/services/[id] — Update a service
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Verify ownership
        const targetService = await db.query.service.findFirst({
            where: eq(service.id, id),
        });

        if (!targetService) {
            return NextResponse.json(
                { error: "Layanan tidak ditemukan" },
                { status: 404 }
            );
        }

        if (targetService.providerId !== session.user.id) {
            return NextResponse.json(
                { error: "Anda tidak berhak mengubah layanan ini" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { title, description, price, categoryId, isOnSite, location, image } = body;

        const updateData: Record<string, any> = { updatedAt: new Date() };
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = parseInt(price);
        if (categoryId !== undefined) updateData.categoryId = categoryId || null;
        if (isOnSite !== undefined) updateData.isOnSite = isOnSite;
        if (location !== undefined) updateData.location = location || null;
        if (image !== undefined) updateData.image = image || null;

        const [updatedService] = await db
            .update(service)
            .set(updateData)
            .where(eq(service.id, id))
            .returning();

        return NextResponse.json({ service: updatedService });
    } catch (error) {
        console.error("Error updating service:", error);
        return NextResponse.json(
            { error: "Gagal memperbarui layanan" },
            { status: 500 }
        );
    }
}

// DELETE /api/services/[id] — Delete a service
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Verify ownership
        const targetService = await db.query.service.findFirst({
            where: eq(service.id, id),
        });

        if (!targetService) {
            return NextResponse.json(
                { error: "Layanan tidak ditemukan" },
                { status: 404 }
            );
        }

        if (targetService.providerId !== session.user.id) {
            return NextResponse.json(
                { error: "Anda tidak berhak menghapus layanan ini" },
                { status: 403 }
            );
        }

        await db.delete(service).where(eq(service.id, id));

        return NextResponse.json({ message: "Layanan berhasil dihapus" });
    } catch (error) {
        console.error("Error deleting service:", error);
        return NextResponse.json(
            { error: "Gagal menghapus layanan" },
            { status: 500 }
        );
    }
}
