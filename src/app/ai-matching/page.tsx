"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { StarRating } from "@/components/ui/star-rating";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Sparkles,
    Search,
    MapPin,
    Star,
    CheckCircle,
    Clock,
    ArrowRight,
    Zap,
    MessageSquare,
} from "lucide-react";

const mockResults = [
    {
        name: "Rina Anggraini",
        initials: "RA",
        title: "Senior Graphic Designer",
        location: "Jakarta",
        rating: 4.9,
        reviews: 128,
        projects: 342,
        matchScore: 98,
        skills: ["Logo Design", "Brand Identity", "UI/UX"],
        price: "Rp500.000",
    },
    {
        name: "DevStudio ID",
        initials: "DS",
        title: "Full-Stack Developer",
        location: "Bandung",
        rating: 4.8,
        reviews: 95,
        projects: 215,
        matchScore: 92,
        skills: ["Next.js", "React", "Node.js"],
        price: "Rp2.000.000",
    },
    {
        name: "PixelPerfect",
        initials: "PP",
        title: "UI/UX Designer",
        location: "Surabaya",
        rating: 4.9,
        reviews: 78,
        projects: 167,
        matchScore: 87,
        skills: ["Figma", "Mobile Design", "Prototyping"],
        price: "Rp1.500.000",
    },
];

export default function AiMatchingPage() {
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = () => {
        setIsSearching(true);
        setShowResults(false);
        setTimeout(() => {
            setIsSearching(false);
            setShowResults(true);
        }, 2000);
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
                            />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Kategori</Label>
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
                                <Label>Budget (Rp)</Label>
                                <Input type="text" placeholder="Contoh: 1.000.000" />
                            </div>
                        </div>
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
                                <p className="text-xs text-muted-foreground">Mencocokkan kebutuhan dengan ribuan freelancer</p>
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
                                <p className="font-medium text-sm">AI telah menemukan {mockResults.length} rekomendasi terbaik</p>
                                <p className="text-xs text-muted-foreground">Diurutkan berdasarkan skor kecocokan</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {mockResults.map((result, index) => (
                                <Card
                                    key={result.name}
                                    className={`border-border/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 ${index === 0 ? "ring-2 ring-primary/50" : ""
                                        }`}
                                >
                                    <CardContent className="p-5">
                                        <div className="flex items-start gap-4">
                                            <div className="relative">
                                                <Avatar className="h-14 w-14">
                                                    <AvatarFallback className="gradient-bg text-white">
                                                        {result.initials}
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
                                                        <h3 className="font-semibold">{result.name}</h3>
                                                        <p className="text-sm text-muted-foreground">{result.title}</p>
                                                    </div>
                                                    <Badge
                                                        className={`${result.matchScore >= 95
                                                                ? "gradient-bg text-white border-0"
                                                                : "bg-primary/10 text-primary"
                                                            }`}
                                                    >
                                                        {result.matchScore}% Match
                                                    </Badge>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {result.location}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                        {result.rating} ({result.reviews})
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <CheckCircle className="h-3 w-3" />
                                                        {result.projects} proyek
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {result.skills.map((skill) => (
                                                        <Badge key={skill} variant="secondary" className="text-xs">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </div>

                                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Mulai dari</p>
                                                        <p className="font-bold text-primary">{result.price}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button variant="outline" size="sm" className="gap-1">
                                                            <MessageSquare className="h-3.5 w-3.5" />
                                                            Chat
                                                        </Button>
                                                        <Button size="sm" className="gap-1 gradient-bg text-white border-0 hover:opacity-90">
                                                            Lihat Profil
                                                            <ArrowRight className="h-3.5 w-3.5" />
                                                        </Button>
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
