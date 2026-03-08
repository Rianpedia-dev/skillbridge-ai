import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { reasoningModel } from "@/lib/ai";

// POST /api/ai/price-estimate — AI Price Estimator
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { description, category } = body;

        if (!description) {
            return NextResponse.json(
                { error: "Deskripsi proyek wajib diisi" },
                { status: 400 }
            );
        }

        const { text } = await generateText({
            model: reasoningModel,
            system: `Kamu adalah AI price estimator untuk platform marketplace jasa SkillBridge AI di Indonesia.
Tugasmu adalah memberikan estimasi harga untuk proyek berdasarkan deskripsi yang diberikan.
Gunakan standar harga pasar freelancer Indonesia.

SELALU balas dalam format JSON dengan struktur:
{
  "minPrice": 500000,
  "maxPrice": 1500000,
  "currency": "IDR",
  "breakdown": [
    { "item": "Desain utama", "estimate": "Rp500.000 - Rp800.000" },
    { "item": "Revisi", "estimate": "Rp100.000 - Rp300.000" }
  ],
  "estimatedDuration": "3-5 hari",
  "notes": "Harga bisa bervariasi tergantung kompleksitas"
}`,
            prompt: `Estimasikan harga untuk proyek berikut:

Deskripsi: "${description}"
${category ? `Kategori: ${category}` : ""}

Berikan estimasi harga dalam Rupiah (IDR):`,
        });

        // Parse AI response
        let estimate;
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            estimate = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        } catch {
            estimate = null;
        }

        if (!estimate) {
            return NextResponse.json({
                description,
                estimate: {
                    minPrice: 0,
                    maxPrice: 0,
                    currency: "IDR",
                    breakdown: [],
                    estimatedDuration: "Tidak dapat diestimasi",
                    notes: "AI tidak dapat memproses permintaan saat ini. Silakan coba lagi.",
                },
                rawResponse: text,
            });
        }

        return NextResponse.json({
            description,
            estimate,
            rawResponse: text,
        });
    } catch (error) {
        console.error("Error in price estimation:", error);
        return NextResponse.json(
            { error: "Gagal melakukan estimasi harga" },
            { status: 500 }
        );
    }
}
