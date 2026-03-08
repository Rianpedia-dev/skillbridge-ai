import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { service } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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
