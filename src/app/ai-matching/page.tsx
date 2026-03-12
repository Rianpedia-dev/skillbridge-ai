"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Sparkles,
    MapPin,
    Star,
    CheckCircle,
    ArrowRight,
    Zap,
    MessageSquare,
    AlertCircle,
} from "lucide-react";

interface Recommendation {
    serviceId?: string;
    freelancerName: string;
    matchScore: number;
    reason: string;
    estimatedPrice: string;
}

export default function AiMatchingPage() {
    const router = useRouter();
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [budget, setBudget] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<Recommendation[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async () => {
        if (!description.trim()) {
            setError("Deskripsi kebutuhan proyek wajib diisi.");
            return;
        }

        setError("");
        setIsSearching(true);
        setShowResults(false);
        setResults([]);

        try {
            let query = description;
            if (category) query += ` | Kategori: ${category}`;
            if (budget) query += ` | Budget: Rp${budget}`;

            const response = await fetch("/api/ai/matching", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Gagal melakukan AI matching");
            }

            const data = await response.json();
            setResults(data.recommendations || []);
            setShowResults(true);
        } catch (err: any) {
            setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setIsSearching(false);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="min-h-screen py-8">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute bottom-20 left-1/3 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
            </div>

            <div className="container mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="text-center mb-10">
                    <Badge variant="secondary" className="mb-4 gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        AI Powered
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">
                        <span className="gradient-text">AI Smart Matching</span>
                    </h1>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                        Jelaskan kebutuhan proyek Anda, dan AI kami akan merekomendasikan freelancer terbaik yang sesuai.
                    </p>
                </div>

                {/* Form */}
                <Card className="max-w-2xl mx-auto border-border/50 mb-10">
                    <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Label>Deskripsi Kebutuhan Proyek</Label>
                            <Textarea
                                placeholder="Contoh: Saya membutuhkan desainer untuk membuat logo dan brand identity untuk startup fintech..."
                                className="min-h-32 resize-none"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Kategori</Label>
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
                                <Label>Budget (Rp)</Label>
                                <Input
                                    type="text"
                                    placeholder="Contoh: 1.000.000"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <Button
                            onClick={handleSearch}
                            disabled={isSearching}
                            className="w-full gap-2 gradient-bg text-white border-0 h-11 hover:opacity-90"
                        >
                            {isSearching ? (
                                <>
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    AI sedang mencari...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4" />
                                    Cari Freelancer Terbaik
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Loading state */}
                {isSearching && (
                    <div className="max-w-2xl mx-auto space-y-4">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-8 rounded-full gradient-bg flex items-center justify-center animate-pulse">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <p className="font-medium text-sm">AI sedang menganalisis...</p>
                                <p className="text-xs text-muted-foreground">Mencocokkan kebutuhan dengan freelancer di database</p>
                            </div>
                        </div>
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="border-border/50">
                                <CardContent className="p-5">
                                    <div className="flex gap-4">
                                        <Skeleton className="h-14 w-14 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-1/3" />
                                            <Skeleton className="h-3 w-1/4" />
                                            <Skeleton className="h-3 w-2/3" />
                                        </div>
                                        <Skeleton className="h-10 w-24" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Results */}
                {showResults && (
                    <div className="max-w-2xl mx-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-8 rounded-full gradient-bg flex items-center justify-center">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                {results.length > 0 ? (
                                    <>
                                        <p className="font-medium text-sm">AI telah menemukan {results.length} rekomendasi terbaik</p>
                                        <p className="text-xs text-muted-foreground">Diurutkan berdasarkan skor kecocokan</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-medium text-sm">Tidak ada rekomendasi ditemukan</p>
                                        <p className="text-xs text-muted-foreground">Coba ubah deskripsi kebutuhan Anda</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {results.length === 0 && (
                            <Card className="border-border/50">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                                        <Sparkles className="h-8 w-8 text-muted-foreground/50" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-1">Tidak ada yang cocok</h3>
                                    <p className="text-sm text-muted-foreground text-center max-w-sm">
                                        AI tidak menemukan freelancer yang cocok. Coba jelaskan kebutuhan Anda lebih detail atau ubah kategori.
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        <div className="space-y-4">
                            {results.map((result, index) => (
                                <Card
                                    key={index}
                                    className={`border-border/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 ${index === 0 ? "ring-2 ring-primary/50" : ""
                                        }`}
                                >
                                    <CardContent className="p-5">
                                        <div className="flex items-start gap-4">
                                            <div className="relative">
                                                <Avatar className="h-14 w-14">
                                                    <AvatarFallback className="gradient-bg text-white">
                                                        {getInitials(result.freelancerName)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {index === 0 && (
                                                    <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full gradient-bg flex items-center justify-center border-2 border-background">
                                                        <Zap className="h-3 w-3 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-semibold">{result.freelancerName}</h3>
                                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{result.reason}</p>
                                                    </div>
                                                    <Badge
                                                        className={`shrink-0 ml-2 ${result.matchScore >= 90
                                                                ? "gradient-bg text-white border-0"
                                                                : "bg-primary/10 text-primary"
                                                            }`}
                                                    >
                                                        {result.matchScore}% Match
                                                    </Badge>
                                                </div>

                                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Estimasi Harga</p>
                                                        <p className="font-bold text-primary">{result.estimatedPrice}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {result.serviceId && (
                                                            <Button
                                                                size="sm"
                                                                className="gap-1 gradient-bg text-white border-0 hover:opacity-90"
                                                                onClick={() => router.push(`/marketplace/${result.serviceId}`)}
                                                            >
                                                                Lihat Detail
                                                                <ArrowRight className="h-3.5 w-3.5" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
