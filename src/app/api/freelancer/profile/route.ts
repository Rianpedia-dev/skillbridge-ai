import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { freelancerProfile } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/freelancer/profile — Get current user's freelancer profile
export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const profile = await db.query.freelancerProfile.findFirst({
            where: eq(freelancerProfile.userId, session.user.id),
            with: {
                user: {
                    columns: { id: true, name: true, email: true, image: true },
                },
            },
        });

        if (!profile) {
            return NextResponse.json(
                { error: "Profil freelancer tidak ditemukan" },
                { status: 404 }
            );
        }

        return NextResponse.json({ profile });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json(
            { error: "Gagal memuat profil" },
            { status: 500 }
        );
    }
}

// POST /api/freelancer/profile — Create or update freelancer profile
export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { title, bio, location, skills, portfolioUrls, hourlyRate } = body;

        if (!title) {
            return NextResponse.json(
                { error: "Title wajib diisi" },
                { status: 400 }
            );
        }

        // Check if profile exists
        const existingProfile = await db.query.freelancerProfile.findFirst({
            where: eq(freelancerProfile.userId, session.user.id),
        });

        if (existingProfile) {
            // Update existing profile
            const [updated] = await db
                .update(freelancerProfile)
                .set({
                    title,
                    bio: bio || null,
                    location: location || null,
                    skills: skills || [],
                    portfolioUrls: portfolioUrls || [],
                    hourlyRate: hourlyRate ? parseInt(hourlyRate) : null,
                    updatedAt: new Date(),
                })
                .where(eq(freelancerProfile.userId, session.user.id))
                .returning();

            return NextResponse.json({ profile: updated });
        } else {
            // Create new profile
            const [newProfile] = await db
                .insert(freelancerProfile)
                .values({
                    userId: session.user.id,
                    title,
                    bio: bio || null,
                    location: location || null,
                    skills: skills || [],
                    portfolioUrls: portfolioUrls || [],
                    hourlyRate: hourlyRate ? parseInt(hourlyRate) : null,
                })
                .returning();

            return NextResponse.json({ profile: newProfile }, { status: 201 });
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json(
            { error: "Gagal menyimpan profil" },
            { status: 500 }
        );
    }
}
