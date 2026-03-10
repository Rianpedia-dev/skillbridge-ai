"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StarRating } from "@/components/ui/star-rating";
import { ServiceCard } from "@/components/service-card";
import { ReviewCard } from "@/components/review-card";
import {
    ArrowLeft,
    MapPin,
    Calendar,
    Clock,
    CheckCircle,
    Star,
    MessageSquare,
    Briefcase,
    Award,
    Globe,
    ExternalLink,
    Loader2
} from "lucide-react";

const freelancer = {
    name: "Rina Anggraini",
    initials: "RA",
    title: "Senior Graphic Designer",
    bio: "Saya adalah seorang Graphic Designer & Brand Strategist dengan 5+ tahun pengalaman. Spesialisasi saya adalah Logo Design, Brand Identity, dan UI/UX Design. Saya percaya setiap brand memiliki cerita unik yang perlu divisualisasikan dengan tepat.",
    location: "Jakarta, Indonesia",
    memberSince: "Januari 2023",
    languages: ["Indonesia", "English"],
    responseTime: "Dalam 1 jam",
    skills: ["Logo Design", "Brand Identity", "UI/UX Design", "Illustration", "Typography", "Figma", "Adobe Illustrator", "Photoshop"],
    stats: {
        completedProjects: 342,
        rating: 4.9,
        reviewCount: 128,
        repeatClients: 72,
        onTimeDelivery: 98,
    },
};

const services = [
    {
        id: "1",
        title: "Desain Logo Profesional & Brand Identity",
        description: "Logo modern dan unik untuk bisnis Anda dengan 3 konsep desain dan unlimited revisi.",
        price: "Rp500.000",
        category: "Design",
        rating: 4.9,
        reviewCount: 128,
        providerName: "Rina Anggraini",
        providerInitials: "RA",
    },
    {
        id: "7",
        title: "Desain UI/UX Aplikasi Mobile",
        description: "Desain antarmuka modern dan user-friendly. Termasuk prototype Figma.",
        price: "Rp1.500.000",
        category: "Design",
        rating: 4.9,
        reviewCount: 78,
        providerName: "Rina Anggraini",
        providerInitials: "RA",
    },
];

const reviews = [
    {
        name: "Andi Prasetyo",
        initials: "AP",
        rating: 5,
        date: "2 hari lalu",
        text: "Logo yang dibuat sangat keren dan sesuai dengan visi brand saya. Komunikasi lancar dan revisi cepat!",
        role: "Founder Startup",
    },
    {
        name: "Dewi Lestari",
        initials: "DL",
        rating: 5,
        date: "5 hari lalu",
        text: "UI/UX design yang dibuat sangat intuitif. User testing hasilnya sangat positif. Highly recommended!",
        role: "Product Manager",
    },
    {
        name: "Budi Santoso",
        initials: "BS",
        rating: 4,
        date: "2 minggu lalu",
        text: "Bagus secara keseluruhan, responsif dan profesional. Hanya sedikit lambat di awal tapi hasil akhirnya memuaskan.",
        role: "Pemilik UMKM",
    },
];

const portfolio = [
    { title: "Brand Identity — Kopi Nusantara", category: "Branding" },
    { title: "UI Design — HealthApp", category: "UI/UX" },
    { title: "Logo — TechStartup ID", category: "Logo" },
    { title: "Brand Guide — EcoStore", category: "Branding" },
    { title: "Mobile App UI — FoodDelivery", category: "UI/UX" },
    { title: "Logo Collection 2024", category: "Logo" },
];

export default function FreelancerProfilePage({ params }: { params: { id: string } }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isConnecting, setIsConnecting] = useState(false);

    const handleContact = async () => {
        if (!session) {
            router.push(`/login?callbackUrl=/freelancer/${params.id}`);
            return;
        }

        setIsConnecting(true);
        try {
            const res = await fetch("/api/chat/rooms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetUserId: params.id }),
            });
            const data = await res.json();
            if (data.room) {
                router.push(`/dashboard/chat?room=${data.room.id}`);
            }
        } catch (error) {
            console.error("Failed to connect with freelancer:", error);
        } finally {
            setIsConnecting(false);
        }
    };
    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4 md:px-6">
                <Link
                    href="/marketplace"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali
                </Link>

                {/* Cover & Profile */}
                <div className="relative mb-8">
                    <div className="h-32 md:h-48 rounded-2xl gradient-bg overflow-hidden">
                        <div className="absolute inset-0">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
                        </div>
                    </div>
                    <div className="absolute bottom-0 translate-y-1/2 left-6 md:left-10 flex items-end gap-4">
                        <Avatar className="h-24 w-24 md:h-28 md:w-28 border-4 border-background">
                            <AvatarFallback className="gradient-bg text-white text-2xl md:text-3xl">
                                {freelancer.initials}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <div className="mt-16 md:mt-18">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left: Main content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Name & Actions */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold">{freelancer.name}</h1>
                                    <p className="text-muted-foreground">{freelancer.title}</p>
                                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-3.5 w-3.5" />
                                            {freelancer.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            Bergabung {freelancer.memberSince}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5" />
                                            {freelancer.responseTime}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    className="gradient-bg text-white border-0 gap-2 hover:opacity-90"
                                    onClick={handleContact}
                                    disabled={isConnecting}
                                >
                                    {isConnecting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <MessageSquare className="h-4 w-4" />
                                    )}
                                    Hubungi
                                </Button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {[
                                    { label: "Proyek Selesai", value: freelancer.stats.completedProjects.toString() },
                                    {
                                        label: "Rating",
                                        value: freelancer.stats.rating.toString(),
                                        extra: (
                                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 inline ml-1" />
                                        ),
                                    },
                                    { label: "Review", value: freelancer.stats.reviewCount.toString() },
                                    { label: "Repeat Client", value: `${freelancer.stats.repeatClients}%` },
                                    { label: "Tepat Waktu", value: `${freelancer.stats.onTimeDelivery}%` },
                                ].map((stat) => (
                                    <Card key={stat.label} className="border-border/50">
                                        <CardContent className="p-3 text-center">
                                            <p className="text-lg font-bold gradient-text">
                                                {stat.value}
                                                {stat.extra}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Tabs */}
                            <Tabs defaultValue="services" className="w-full">
                                <TabsList className="grid grid-cols-3 w-full">
                                    <TabsTrigger value="services">Layanan</TabsTrigger>
                                    <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                                    <TabsTrigger value="reviews">Review</TabsTrigger>
                                </TabsList>

                                <TabsContent value="services" className="mt-6">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {services.map((service) => (
                                            <ServiceCard key={service.id} {...service} />
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="portfolio" className="mt-6">
                                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {portfolio.map((item) => (
                                            <Card key={item.title} className="group overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300 cursor-pointer">
                                                <div className="h-40 gradient-bg opacity-70 flex items-center justify-center">
                                                    <span className="text-white/20 text-2xl font-bold">{item.title.charAt(0)}</span>
                                                </div>
                                                <CardContent className="p-3">
                                                    <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                                                    <Badge variant="secondary" className="mt-1 text-xs">{item.category}</Badge>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="reviews" className="mt-6 space-y-4">
                                    {reviews.map((review) => (
                                        <ReviewCard key={review.name} {...review} />
                                    ))}
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Right: Sidebar */}
                        <div className="space-y-4">
                            {/* About */}
                            <Card className="border-border/50">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">Tentang</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {freelancer.bio}
                                    </p>
                                    <Separator />
                                    <div>
                                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                            <Award className="h-4 w-4 text-primary" />
                                            Skills
                                        </h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {freelancer.skills.map((skill) => (
                                                <Badge key={skill} variant="secondary" className="text-xs">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <Separator />
                                    <div>
                                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                            <Globe className="h-4 w-4 text-primary" />
                                            Bahasa
                                        </h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {freelancer.languages.map((lang) => (
                                                <Badge key={lang} variant="secondary" className="text-xs">
                                                    {lang}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Verification */}
                            <Card className="border-border/50 bg-primary/5">
                                <CardContent className="p-4 space-y-3">
                                    <h4 className="font-semibold text-sm flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        Verifikasi
                                    </h4>
                                    {["Email terverifikasi", "Identitas terverifikasi", "Nomor telepon terverifikasi"].map(
                                        (item) => (
                                            <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                                                {item}
                                            </div>
                                        )
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
