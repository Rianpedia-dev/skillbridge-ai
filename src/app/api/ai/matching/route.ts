import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { reasoningModel } from "@/lib/ai";
import { db } from "@/lib/db";
import { service, freelancerProfile } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

// POST /api/ai/matching — AI Smart Matching
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { query } = body;

        if (!query) {
            return NextResponse.json(
                { error: "Deskripsi kebutuhan wajib diisi" },
                { status: 400 }
            );
        }

        // Fetch available services and freelancers from DB
        const availableServices = await db.query.service.findMany({
            where: eq(service.isActive, true),
            orderBy: [desc(service.rating)],
            limit: 20,
            with: {
                category: true,
                provider: {
                    columns: { id: true, name: true, image: true },
                },
            },
        });

        const freelancerProfiles = await db.query.freelancerProfile.findMany({
            where: eq(freelancerProfile.isAvailable, true),
            limit: 20,
            with: {
                user: {
                    columns: { id: true, name: true, image: true },
                },
            },
        });

        // Build context for AI
        const servicesContext = availableServices.map((s) => ({
            id: s.id,
            title: s.title,
            description: s.description,
            price: s.price,
            rating: s.rating,
            reviewCount: s.reviewCount,
            providerName: s.provider.name,
            category: s.category?.name || "Uncategorized",
            location: s.location,
        }));

        const freelancersContext = freelancerProfiles.map((f) => ({
            userId: f.userId,
            name: f.user.name,
            title: f.title,
            skills: f.skills,
            location: f.location,
            completedProjects: f.completedProjects,
            hourlyRate: f.hourlyRate,
        }));

        const { text } = await generateText({
            model: reasoningModel,
            system: `Kamu adalah AI assistant untuk platform marketplace jasa SkillBridge AI. 
Tugasmu adalah mencocokkan kebutuhan user dengan freelancer dan layanan yang paling relevan.
Berikan rekomendasi dalam Bahasa Indonesia.
SELALU balas dalam format JSON array dengan struktur:
[
  {
    "serviceId": "id layanan",
    "freelancerName": "nama",
    "matchScore": 95,
    "reason": "alasan mengapa cocok",
    "estimatedPrice": "range harga"
  }
]
Berikan maksimal 3 rekomendasi teratas. Urutkan dari match score tertinggi.
Jika tidak ada yang cocok, kembalikan array kosong [].`,
            prompt: `Kebutuhan user: "${query}"

Data layanan tersedia:
${JSON.stringify(servicesContext, null, 2)}

Data freelancer tersedia:
${JSON.stringify(freelancersContext, null, 2)}

Berikan rekomendasi freelancer/layanan yang paling cocok:`,
        });

        // Parse AI response
        let recommendations;
        try {
            // Extract JSON from response (handle markdown code blocks)
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            recommendations = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
        } catch {
            recommendations = [];
        }

        return NextResponse.json({
            query,
            recommendations,
            rawResponse: text,
        });
    } catch (error) {
        console.error("Error in AI matching:", error);
        return NextResponse.json(
            { error: "Gagal melakukan AI matching" },
            { status: 500 }
        );
    }
}
