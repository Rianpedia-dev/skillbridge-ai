import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { service, serviceCategory, user, freelancerProfile } from "@/lib/db/schema";
import { eq, ilike, and, desc, asc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/services — List services with filtering
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const search = searchParams.get("search");
        const sortBy = searchParams.get("sort") || "newest";
        const providerId = searchParams.get("providerId");

        const conditions = [];

        // If filtering by provider, show all including inactive (for dashboard)
        // Otherwise only show active services (for marketplace)
        if (providerId) {
            conditions.push(eq(service.providerId, providerId));
        } else {
            conditions.push(eq(service.isActive, true));
        }

        // Category filter — support slug-based filtering
        if (category) {
            // First try to find category by slug
            const categoryRecord = await db.query.serviceCategory.findFirst({
                where: eq(serviceCategory.slug, category),
            });
            if (categoryRecord) {
                conditions.push(eq(service.categoryId, categoryRecord.id));
            } else {
                // Fallback: try direct ID match
                conditions.push(eq(service.categoryId, category));
            }
        }

        if (search) {
            conditions.push(ilike(service.title, `%${search}%`));
        }

        // Sort mapping
        let orderBy;
        switch (sortBy) {
            case "price-low":
            case "price_asc":
                orderBy = asc(service.price);
                break;
            case "price-high":
            case "price_desc":
                orderBy = desc(service.price);
                break;
            case "rating":
                orderBy = desc(service.rating);
                break;
            default:
                orderBy = desc(service.createdAt);
        }

        const services = await db.query.service.findMany({
            where: conditions.length > 0 ? and(...conditions) : undefined,
            orderBy: [orderBy],
            with: {
                category: true,
                provider: {
                    columns: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });

        return NextResponse.json({ services });
    } catch (error) {
        console.error("Error fetching services:", error);
        return NextResponse.json(
            { error: "Gagal memuat layanan" },
            { status: 500 }
        );
    }
}

// POST /api/services — Create a new service (freelancer only)
export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const currentUser = session.user;

        // Check if user is freelancer
        if ((currentUser as { role?: string }).role !== "freelancer") {
            return NextResponse.json(
                { error: "Hanya freelancer yang bisa membuat layanan" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { title, description, price, categoryId, isOnSite, location, image } =
            body;

        if (!title || !description || !price) {
            return NextResponse.json(
                { error: "Title, description, dan price wajib diisi" },
                { status: 400 }
            );
        }

        const [newService] = await db
            .insert(service)
            .values({
                title,
                description,
                price: parseInt(price),
                categoryId: categoryId || null,
                providerId: currentUser.id,
                isOnSite: isOnSite || false,
                location: location || null,
                image: image || null,
            })
            .returning();

        return NextResponse.json({ service: newService }, { status: 201 });
    } catch (error) {
        console.error("Error creating service:", error);
        return NextResponse.json(
            { error: "Gagal membuat layanan" },
            { status: 500 }
        );
    }
}

// PATCH /api/services — Update a service (e.g. toggle active)
export async function PATCH(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { id, isActive } = body;

        if (!id || typeof isActive !== "boolean") {
            return NextResponse.json(
                { error: "ID layanan dan status aktif wajib disertakan" },
                { status: 400 }
            );
        }

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

        const [updatedService] = await db
            .update(service)
            .set({ isActive, updatedAt: new Date() })
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
