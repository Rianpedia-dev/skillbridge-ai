"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ServiceCard } from "@/components/service-card";
import {
    Search,
    SlidersHorizontal,
    Palette,
    Code,
    Video,
    Camera,
    GraduationCap,
    Wrench,
    X,
} from "lucide-react";

const categories = [
    { value: "all", label: "Semua Kategori", icon: SlidersHorizontal },
    { value: "design", label: "Design", icon: Palette },
    { value: "programming", label: "Programming", icon: Code },
    { value: "tutor", label: "Tutor & Pendidikan", icon: GraduationCap },
    { value: "home-service", label: "Home Service & Pertukangan", icon: Wrench },
    { value: "event", label: "Event & Fotografi", icon: Camera },
    { value: "otomotif", label: "Otomotif & Servis", icon: Wrench },
];



export default function MarketplacePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("recommended");
    const [services, setServices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                if (selectedCategory !== "all") params.append("category", selectedCategory);
                if (searchQuery) params.append("search", searchQuery);
                if (sortBy !== "recommended") params.append("sort", sortBy);

                const response = await fetch(`/api/services?${params.toString()}`);
                const data = await response.json();
                setServices(data.services || []);
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchServices, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery, selectedCategory, sortBy]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="min-h-screen py-8">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/3 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="container mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        <span className="gradient-text">Marketplace</span> Jasa
                    </h1>
                    <p className="text-muted-foreground">
                        Temukan layanan profesional dari freelancer terpercaya di Indonesia.
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-3 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari layanan... (contoh: desain logo, website)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-11"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            </button>
                        )}
                    </div>
                    <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v ?? "all")}>
                        <SelectTrigger className="w-full md:w-52 h-11">
                            <SelectValue placeholder="Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                    <span className="flex items-center gap-2">
                                        <cat.icon className="h-4 w-4" />
                                        {cat.label}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={(v) => setSortBy(v ?? "recommended")}>
                        <SelectTrigger className="w-full md:w-44 h-11">
                            <SelectValue placeholder="Urutkan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recommended">Rekomendasi AI</SelectItem>
                            <SelectItem value="rating">Rating Tertinggi</SelectItem>
                            <SelectItem value="price-low">Harga Terendah</SelectItem>
                            <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                            <SelectItem value="newest">Terbaru</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Category chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {categories.map((cat) => (
                        <Badge
                            key={cat.value}
                            variant={selectedCategory === cat.value ? "default" : "secondary"}
                            className={`cursor-pointer transition-all ${selectedCategory === cat.value
                                ? "gradient-bg text-white border-0"
                                : "hover:bg-primary/10"
                                }`}
                            onClick={() => setSelectedCategory(cat.value)}
                        >
                            <cat.icon className="h-3.5 w-3.5 mr-1" />
                            {cat.label}
                        </Badge>
                    ))}
                </div>

                {/* Results info */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-muted-foreground">
                        Menampilkan <span className="font-medium text-foreground">{services.length}</span> layanan
                    </p>
                </div>

                {/* Services Grid */}
                {isLoading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Card key={i} className="h-72 animate-pulse bg-muted border-border/50" />
                        ))}
                    </div>
                ) : services.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <ServiceCard
                                key={service.id}
                                id={service.id}
                                title={service.title}
                                description={service.description}
                                price={formatPrice(service.price)}
                                category={service.category?.name || "Lainnya"}
                                rating={service.rating || 0}
                                reviewCount={service.reviewCount || 0}
                                providerName={service.provider?.name || "Freelancer"}
                                providerInitials={service.provider?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "F"}
                                isOnSite={service.isOnSite}
                                location={service.location}
                            />
                        ))}
                    </div>
                ) : (
                    <Card className="border-border/50">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
                            <h3 className="font-semibold text-lg mb-1">Tidak ada layanan ditemukan</h3>
                            <p className="text-sm text-muted-foreground text-center max-w-sm">
                                Coba ubah kata kunci pencarian atau filter kategori Anda.
                            </p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory("all");
                                }}
                            >
                                Reset Filter
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
