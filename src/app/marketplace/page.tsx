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
    Camera,
    GraduationCap,
    Wrench,
    X,
    Sparkles,
} from "lucide-react";

const categories = [
    { value: "all", label: "Semua", icon: SlidersHorizontal },
    { value: "design", label: "Design", icon: Palette },
    { value: "programming", label: "Programming", icon: Code },
    { value: "tutor", label: "Tutor", icon: GraduationCap },
    { value: "home-service", label: "Home Service", icon: Wrench },
    { value: "event", label: "Fotografi", icon: Camera },
    { value: "otomotif", label: "Otomotif", icon: Wrench },
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
        <div className="min-h-screen">
            {/* Search Header Banner */}
            <div className="promo-gradient py-6 md:py-10">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-2xl mx-auto text-center mb-4 md:mb-6">
                        <h1 className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2">
                            Temukan Layanan Profesional
                        </h1>
                        <p className="text-white/70 text-xs md:text-sm">
                            Ribuan freelancer siap membantu kebutuhan Anda
                        </p>
                    </div>
                    <div className="max-w-2xl mx-auto flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                            <Input
                                placeholder="Cari jasa, misalnya: desain logo, website..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 md:pl-11 h-10 md:h-12 bg-background border-0 text-sm md:text-base rounded-lg md:rounded-xl shadow-lg"
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
                        <Button className="h-10 md:h-12 px-4 md:px-6 bg-white text-primary hover:bg-white/90 font-semibold rounded-lg md:rounded-xl shadow-lg">
                            <Search className="h-4 w-4 md:mr-2" />
                            <span className="hidden md:inline">Cari</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-3 md:px-6 py-4 md:py-6">
                {/* Filter Bar */}
                <div className="flex flex-col gap-3 mb-4 md:mb-6">
                    {/* Category Chips - horizontal scroll */}
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-3 px-3 md:mx-0 md:px-0">
                        {categories.map((cat) => (
                            <Badge
                                key={cat.value}
                                variant={selectedCategory === cat.value ? "default" : "secondary"}
                                className={`cursor-pointer transition-all whitespace-nowrap shrink-0 text-xs md:text-sm py-1.5 px-3 ${selectedCategory === cat.value
                                    ? "gradient-bg text-white border-0"
                                    : "hover:bg-primary/10"
                                    }`}
                                onClick={() => setSelectedCategory(cat.value)}
                            >
                                <cat.icon className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" />
                                {cat.label}
                            </Badge>
                        ))}
                    </div>

                    {/* Sort + Count */}
                    <div className="flex items-center justify-between">
                        <p className="text-xs md:text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">{services.length}</span> layanan ditemukan
                        </p>
                        <Select value={sortBy} onValueChange={(v) => setSortBy(v ?? "recommended")}>
                            <SelectTrigger className="w-36 md:w-44 h-8 md:h-9 text-xs md:text-sm">
                                <SelectValue placeholder="Urutkan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="recommended">
                                    <span className="flex items-center gap-1.5">
                                        <Sparkles className="h-3.5 w-3.5" />
                                        Rekomendasi AI
                                    </span>
                                </SelectItem>
                                <SelectItem value="rating">Rating Tertinggi</SelectItem>
                                <SelectItem value="price-low">Harga Terendah</SelectItem>
                                <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                                <SelectItem value="newest">Terbaru</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Services Grid: 2 columns on mobile, 3 on md, 4 on lg */}
                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <Card key={i} className="overflow-hidden border-border/50">
                                <div className="aspect-[16/10] animate-pulse bg-muted" />
                                <CardContent className="p-3 space-y-2">
                                    <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                                    <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                                    <div className="h-3 bg-muted animate-pulse rounded w-1/3" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : services.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
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
                                image={service.image}
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
