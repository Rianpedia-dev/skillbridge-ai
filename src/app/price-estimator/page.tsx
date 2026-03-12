"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Calculator,
    Sparkles,
    TrendingUp,
    TrendingDown,
    Clock,
    Info,
    BarChart3,
    ArrowRight,
    AlertCircle,
} from "lucide-react";

interface PriceEstimate {
    minPrice: number;
    maxPrice: number;
    currency: string;
    breakdown: { item: string; estimate: string }[];
    estimatedDuration: string;
    notes: string;
}

export default function PriceEstimatorPage() {
    const router = useRouter();
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [complexity, setComplexity] = useState("");
    const [deadline, setDeadline] = useState("");
    const [isEstimating, setIsEstimating] = useState(false);
    const [estimate, setEstimate] = useState<PriceEstimate | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [error, setError] = useState("");

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleEstimate = async () => {
        if (!description.trim()) {
            setError("Deskripsi proyek wajib diisi.");
            return;
        }

        setError("");
        setIsEstimating(true);
        setShowResult(false);
        setEstimate(null);

        try {
            let fullDescription = description;
            if (complexity) fullDescription += ` | Kompleksitas: ${complexity}`;
            if (deadline) fullDescription += ` | Deadline: ${deadline} hari`;

            const response = await fetch("/api/ai/price-estimate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    description: fullDescription,
                    category: category || undefined,
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Gagal melakukan estimasi harga");
            }

            const data = await response.json();
            setEstimate(data.estimate);
            setShowResult(true);
        } catch (err: any) {
            setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setIsEstimating(false);
        }
    };

    const avgPrice = estimate ? Math.round((estimate.minPrice + estimate.maxPrice) / 2) : 0;

    return (
        <div className="min-h-screen py-8">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute bottom-20 right-1/3 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
            </div>

            <div className="container mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="text-center mb-10">
                    <Badge variant="secondary" className="mb-4 gap-2">
                        <Calculator className="h-3.5 w-3.5 text-primary" />
                        AI Powered
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">
                        <span className="gradient-text">AI Price Estimator</span>
                    </h1>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                        Jelaskan kebutuhan proyek Anda dan AI akan memberikan estimasi harga berdasarkan data ribuan proyek serupa.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Form */}
                    <Card className="border-border/50">
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label>Deskripsi Proyek</Label>
                                <Textarea
                                    placeholder="Contoh: Membuat website company profile untuk bisnis kuliner dengan 5 halaman, fitur menu online, dan Google Maps..."
                                    className="min-h-40 resize-none"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Kategori Layanan</Label>
                                <Select value={category} onValueChange={(v) => setCategory(v ?? "")}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="design">Design</SelectItem>
                                        <SelectItem value="programming">Programming</SelectItem>
                                        <SelectItem value="video">Video Editing</SelectItem>
                                        <SelectItem value="photo">Photography</SelectItem>
                                        <SelectItem value="tutor">Tutor</SelectItem>
                                        <SelectItem value="repair">Repair Service</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Tingkat Kompleksitas</Label>
                                <Select value={complexity} onValueChange={(v) => setComplexity(v ?? "")}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kompleksitas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="simple">Sederhana</SelectItem>
                                        <SelectItem value="medium">Menengah</SelectItem>
                                        <SelectItem value="complex">Kompleks</SelectItem>
                                        <SelectItem value="enterprise">Enterprise</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Deadline</Label>
                                <Select value={deadline} onValueChange={(v) => setDeadline(v ?? "")}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Perkiraan waktu" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="3">3 hari</SelectItem>
                                        <SelectItem value="7">1 minggu</SelectItem>
                                        <SelectItem value="14">2 minggu</SelectItem>
                                        <SelectItem value="30">1 bulan</SelectItem>
                                        <SelectItem value="60">2 bulan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <Button
                                onClick={handleEstimate}
                                disabled={isEstimating}
                                className="w-full gap-2 gradient-bg text-white border-0 h-11 hover:opacity-90"
                            >
                                {isEstimating ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        AI sedang menghitung...
                                    </>
                                ) : (
                                    <>
                                        <Calculator className="h-4 w-4" />
                                        Estimasi Harga
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Result */}
                    <div className="space-y-4">
                        {!showResult && !isEstimating && (
                            <Card className="border-border/50 h-full flex items-center justify-center">
                                <CardContent className="text-center py-16">
                                    <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                        <BarChart3 className="h-8 w-8 text-primary/50" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">Hasil Estimasi</h3>
                                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                        Isi form di samping untuk mendapatkan estimasi harga proyek dari AI.
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {isEstimating && (
                            <Card className="border-border/50 h-full flex items-center justify-center">
                                <CardContent className="text-center py-16">
                                    <div className="mx-auto h-16 w-16 rounded-2xl gradient-bg flex items-center justify-center mb-4 animate-pulse-glow">
                                        <Sparkles className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">AI sedang menganalisis...</h3>
                                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                        Membandingkan dengan data proyek serupa untuk memberikan estimasi akurat.
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {showResult && estimate && (
                            <>
                                {/* Main estimate */}
                                <Card className="border-border/50 overflow-hidden">
                                    <div className="gradient-bg p-6 text-white text-center">
                                        <p className="text-sm opacity-80 mb-1">Estimasi Harga Proyek</p>
                                        <h2 className="text-3xl md:text-4xl font-bold">
                                            {formatPrice(estimate.minPrice)} — {formatPrice(estimate.maxPrice)}
                                        </h2>
                                        {estimate.estimatedDuration && (
                                            <p className="text-sm opacity-70 mt-2 flex items-center justify-center gap-1">
                                                <Clock className="h-3.5 w-3.5" />
                                                Estimasi waktu: {estimate.estimatedDuration}
                                            </p>
                                        )}
                                    </div>
                                    <CardContent className="p-5 space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-3 text-center">
                                            <div className="bg-muted/50 p-3 rounded-lg sm:bg-transparent sm:p-0">
                                                <div className="flex items-center justify-center gap-1 text-green-500 mb-1">
                                                    <TrendingDown className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                                                    <span className="text-sm sm:text-xs font-medium">Minimum</span>
                                                </div>
                                                <p className="font-bold text-lg sm:text-sm">{formatPrice(estimate.minPrice)}</p>
                                            </div>
                                            <div className="bg-primary/5 p-3 rounded-lg sm:bg-transparent sm:p-0 ring-1 ring-primary/20 sm:ring-0">
                                                <div className="flex items-center justify-center gap-1 text-primary mb-1">
                                                    <BarChart3 className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                                                    <span className="text-sm sm:text-xs font-medium">Rata-rata</span>
                                                </div>
                                                <p className="font-bold text-lg sm:text-sm">{formatPrice(avgPrice)}</p>
                                            </div>
                                            <div className="bg-muted/50 p-3 rounded-lg sm:bg-transparent sm:p-0">
                                                <div className="flex items-center justify-center gap-1 text-orange-500 mb-1">
                                                    <TrendingUp className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                                                    <span className="text-sm sm:text-xs font-medium">Maksimum</span>
                                                </div>
                                                <p className="font-bold text-lg sm:text-sm">{formatPrice(estimate.maxPrice)}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Breakdown */}
                                {estimate.breakdown && estimate.breakdown.length > 0 && (
                                    <Card className="border-border/50">
                                        <CardContent className="p-5 space-y-3">
                                            <h3 className="font-semibold text-sm flex items-center gap-2">
                                                <Info className="h-4 w-4 text-primary" />
                                                Breakdown Estimasi
                                            </h3>
                                            {estimate.breakdown.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">{item.item}</span>
                                                    <span className="font-medium">{item.estimate}</span>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Notes */}
                                {estimate.notes && (
                                    <Card className="border-border/50 bg-muted/30">
                                        <CardContent className="p-5">
                                            <p className="text-sm text-muted-foreground flex items-start gap-2">
                                                <Info className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                                                {estimate.notes}
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* CTA */}
                                <Card className="border-border/50 bg-primary/5">
                                    <CardContent className="p-5">
                                        <div className="flex items-start gap-3">
                                            <div className="h-10 w-10 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                                                <Sparkles className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-sm mb-1">Cari freelancer sekarang?</h4>
                                                <p className="text-xs text-muted-foreground mb-3">
                                                    Gunakan AI Smart Matching untuk menemukan freelancer terbaik sesuai budget Anda.
                                                </p>
                                                <Button
                                                    size="sm"
                                                    className="gap-2 gradient-bg text-white border-0 hover:opacity-90"
                                                    onClick={() => router.push("/ai-matching")}
                                                >
                                                    Cari Freelancer
                                                    <ArrowRight className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
