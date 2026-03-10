import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serviceCategory } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

// GET /api/categories — List all service categories
export async function GET() {
    try {
        const categories = await db.query.serviceCategory.findMany({
            orderBy: [asc(serviceCategory.name)],
        });

        return NextResponse.json({ categories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { error: "Gagal memuat kategori" },
            { status: 500 }
        );
    }
}
