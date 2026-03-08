"use client";

import { useState } from "react";
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
} from "lucide-react";

export default function PriceEstimatorPage() {
    const [isEstimating, setIsEstimating] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const handleEstimate = () => {
        setIsEstimating(true);
        setShowResult(false);
        setTimeout(() => {
            setIsEstimating(false);
            setShowResult(true);
        }, 2000);
    };

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
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Kategori Layanan</Label>
                                <Select>
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
                                <Select>
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
                                <Select>
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
                                        Membandingkan dengan data ribuan proyek serupa untuk memberikan estimasi akurat.
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {showResult && (
                            <>
                                {/* Main estimate */}
                                <Card className="border-border/50 overflow-hidden">
                                    <div className="gradient-bg p-6 text-white text-center">
                                        <p className="text-sm opacity-80 mb-1">Estimasi Harga Proyek</p>
                                        <h2 className="text-3xl md:text-4xl font-bold">
                                            Rp1.500.000 — Rp3.000.000
                                        </h2>
                                        <p className="text-sm opacity-70 mt-2">Berdasarkan analisis 247 proyek serupa</p>
                                    </div>
                                    <CardContent className="p-5 space-y-4">
                                        <div className="grid grid-cols-3 gap-3 text-center">
                                            <div>
                                                <div className="flex items-center justify-center gap-1 text-green-500 mb-1">
                                                    <TrendingDown className="h-3.5 w-3.5" />
                                                    <span className="text-xs font-medium">Minimum</span>
                                                </div>
                                                <p className="font-bold text-sm">Rp1.500.000</p>
                                            </div>
                                            <div>
                                                <div className="flex items-center justify-center gap-1 text-primary mb-1">
                                                    <BarChart3 className="h-3.5 w-3.5" />
                                                    <span className="text-xs font-medium">Rata-rata</span>
                                                </div>
                                                <p className="font-bold text-sm">Rp2.200.000</p>
                                            </div>
                                            <div>
                                                <div className="flex items-center justify-center gap-1 text-orange-500 mb-1">
                                                    <TrendingUp className="h-3.5 w-3.5" />
                                                    <span className="text-xs font-medium">Maksimum</span>
                                                </div>
                                                <p className="font-bold text-sm">Rp3.000.000</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Breakdown */}
                                <Card className="border-border/50">
                                    <CardContent className="p-5 space-y-3">
                                        <h3 className="font-semibold text-sm flex items-center gap-2">
                                            <Info className="h-4 w-4 text-primary" />
                                            Breakdown Estimasi
                                        </h3>
                                        {[
                                            { label: "Desain & Wireframe", range: "Rp300.000 — Rp600.000" },
                                            { label: "Frontend Development", range: "Rp500.000 — Rp1.000.000" },
                                            { label: "Backend & Integrasi", range: "Rp400.000 — Rp800.000" },
                                            { label: "Testing & Deployment", range: "Rp200.000 — Rp400.000" },
                                            { label: "Revisi & Maintenance", range: "Rp100.000 — Rp200.000" },
                                        ].map((item) => (
                                            <div key={item.label} className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">{item.label}</span>
                                                <span className="font-medium">{item.range}</span>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

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
                                                <Button size="sm" className="gap-2 gradient-bg text-white border-0 hover:opacity-90">
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
