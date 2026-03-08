"use client";

import Link from "next/link";
import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/ui/star-rating";
import { ReviewCard } from "@/components/review-card";
import {
    ArrowLeft,
    Clock,
    RefreshCw,
    CheckCircle,
    ShieldCheck,
    MessageSquare,
    Heart,
    Share2,
    MapPin,
    Star,
    Loader2,
} from "lucide-react";



export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [service, setService] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await fetch(`/api/services/${id}`);
                const data = await response.json();
                setService(data.service);
            } catch (error) {
                console.error("Error fetching service:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchService();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h2 className="text-xl font-bold mb-2">Layanan tidak ditemukan</h2>
                <Link href="/marketplace">
                    <Button variant="outline">Kembali ke Marketplace</Button>
                </Link>
            </div>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const providerInitials = service.provider?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "F";

    // Simulate packages if not in DB (actually they aren't in schema yet, so use dynamic calculation)
    const packages = [
        {
            name: "Standard",
            price: formatPrice(service.price),
            description: "Paket lengkap sesuai deskripsi layanan",
            features: ["Sesuai deskripsi", "Revisi tersedia", "File source lengkap"],
            delivery: "Sesuai kesepakatan",
            popular: true,
        }
    ];

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4 md:px-6">
                {/* Back */}
                <Link
                    href="/marketplace"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Marketplace
                </Link>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Service info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Banner */}
                        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden gradient-bg">
                            {service.image ? (
                                <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-6xl font-bold text-white/15 uppercase">{service.title.charAt(0)}</span>
                                </div>
                            )}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm">
                                    <Heart className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <Badge className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm">
                                {service.category?.name || "Lainnya"}
                            </Badge>
                        </div>

                        {/* Title & Info */}
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">{service.title}</h1>
                            <div className="flex flex-wrap items-center gap-4 mt-3">
                                <div className="flex items-center gap-1.5">
                                    <StarRating rating={service.rating || 0} size="sm" />
                                    <span className="font-semibold text-sm">{service.rating || 0}</span>
                                    <span className="text-sm text-muted-foreground">({service.reviewCount || 0})</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    {service.provider?.freelancerProfile?.completedProjects || 0} pesanan selesai
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    Respon Cepat
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Description */}
                        <div>
                            <h2 className="text-lg font-semibold mb-3">Tentang Layanan</h2>
                            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                {service.description}
                            </div>
                        </div>

                        <Separator />

                        {/* Provider mini card */}
                        <Card className="border-border/50">
                            <CardContent className="p-5">
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-14 w-14">
                                        {service.provider?.image ? (
                                            <img src={service.provider.image} alt={service.provider.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <AvatarFallback className="gradient-bg text-white text-lg">
                                                {providerInitials}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Link
                                                    href={`/freelancer/${service.provider?.id}`}
                                                    className="font-semibold hover:text-primary transition-colors"
                                                >
                                                    {service.provider?.name}
                                                </Link>
                                                <p className="text-sm text-muted-foreground">{service.provider?.freelancerProfile?.title || "Freelancer"}</p>
                                            </div>
                                            <Button variant="outline" size="sm" className="gap-2">
                                                <MessageSquare className="h-3.5 w-3.5" />
                                                Chat
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {service.provider?.freelancerProfile?.location || "Indonesia"}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                                {service.rating || 0}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <CheckCircle className="h-3.5 w-3.5" />
                                                {service.provider?.freelancerProfile?.completedProjects || 0} proyek
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Separator />

                        {/* Reviews */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">
                                Review ({service.reviewCount || 0})
                            </h2>
                            <p className="text-sm text-muted-foreground italic">
                                Belum ada review untuk layanan ini.
                            </p>
                        </div>
                    </div>

                    {/* Right: Pricing */}
                    <div className="space-y-4">
                        {packages.map((pkg) => (
                            <Card
                                key={pkg.name}
                                className={`border-border/50 transition-all ${pkg.popular ? "ring-2 ring-primary shadow-lg shadow-primary/10" : ""
                                    }`}
                            >
                                {pkg.popular && (
                                    <div className="gradient-bg text-white text-center text-xs font-medium py-1.5 rounded-t-lg">
                                        ⭐ Paket Utama
                                    </div>
                                )}
                                <CardHeader className="pb-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
                                        <CardTitle className="text-lg">{pkg.name}</CardTitle>
                                        <span className="text-xl font-bold gradient-text">{pkg.price}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{pkg.description}</p>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5" />
                                            {pkg.delivery}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <RefreshCw className="h-3.5 w-3.5" />
                                            Revisi tersedia
                                        </span>
                                    </div>
                                    <ul className="space-y-2">
                                        {pkg.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-2 text-sm">
                                                <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link href={`/order?serviceId=${service.id}`}>
                                        <Button
                                            className={`w-full gap-2 mt-2 ${pkg.popular ? "gradient-bg text-white border-0 hover:opacity-90" : ""
                                                }`}
                                            variant={pkg.popular ? "default" : "outline"}
                                        >
                                            <ShieldCheck className="h-4 w-4" />
                                            Pesan Sekarang
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Security info */}
                        <Card className="border-border/50 bg-primary/5">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-sm">Pembayaran Aman</h4>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Dana Anda ditahan oleh platform sampai pekerjaan selesai (Escrow System).
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
