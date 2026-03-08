"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
    ArrowLeft,
    ArrowRight,
    Calendar,
    Paperclip,
    ShieldCheck,
    Star,
    Clock,
    CheckCircle,
    Loader2,
} from "lucide-react";

function OrderForm() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const router = useRouter();
    const serviceId = searchParams.get("serviceId");

    const [service, setService] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [requirements, setRequirements] = useState("");
    const [error, setError] = useState("");

    // If session is checked and user is not logged in, redirect
    useEffect(() => {
        if (session === null) {
            router.push("/login?callbackUrl=/order?serviceId=" + serviceId);
        }
    }, [session, router, serviceId]);

    useEffect(() => {
        if (!serviceId) {
            router.push("/marketplace");
            return;
        }

        const fetchService = async () => {
            try {
                const response = await fetch(`/api/services/${serviceId}`);
                const data = await response.json();
                if (data.service) {
                    setService(data.service);
                } else {
                    setError("Layanan tidak ditemukan");
                }
            } catch (err) {
                console.error("Error fetching service:", err);
                setError("Gagal memuat data layanan");
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [serviceId, router]);

    const handleOrder = async () => {
        if (!requirements.trim()) {
            setError("Harap isi deskripsi proyek Anda");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    serviceId,
                    requirements,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.paymentLink) {
                    window.location.href = data.paymentLink;
                } else {
                    router.push(`/payment?orderId=${data.order.id}`);
                }
            } else {
                setError(data.error || "Gagal membuat pesanan");
            }
        } catch (err) {
            console.error("Order error:", err);
            setError("Terjadi kesalahan teknis saat membuat pesanan");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error && !service) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-bold mb-4">{error}</h2>
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

    const serviceFee = (service.price * 0.1);
    const totalPrice = service.price + serviceFee;

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Form */}
            <div className="lg:col-span-2 space-y-6">
                {/* Service summary */}
                <Card className="border-border/50">
                    <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                            <div className="h-16 w-16 rounded-xl gradient-bg flex items-center justify-center shrink-0 overflow-hidden">
                                {service.image ? (
                                    <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl font-bold text-white/30 uppercase">{service.title.charAt(0)}</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <Badge variant="secondary" className="text-xs mb-1">{service.category?.name || "Lainnya"}</Badge>
                                <h3 className="font-semibold">{service.title}</h3>
                                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Avatar className="h-5 w-5">
                                            <AvatarFallback className="text-[8px] gradient-bg text-white">
                                                {service.provider?.name?.split(" ").map((n: string) => n[0]).join("") || "F"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span>{service.provider?.name}</span>
                                    </div>
                                    <span className="flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        {service.rating || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Package selection (Simplified for now as schema only reflects base price) */}
                <Card className="border-border/50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Paket Layanan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 rounded-xl border border-primary bg-primary/5 ring-2 ring-primary/20 flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-sm">Paket Standar</h4>
                                <p className="text-xs text-muted-foreground">Sesuai deskripsi layanan yang ditawarkan</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-primary">{formatPrice(service.price)}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                                    <Clock className="h-3 w-3" />
                                    Estimasi 3-7 hari
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Project details */}
                <Card className="border-border/50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Detail Proyek</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Deskripsi Proyek *</Label>
                            <Textarea
                                placeholder="Jelaskan secara detail apa yang Anda butuhkan untuk proyek ini..."
                                className="min-h-32 resize-none"
                                value={requirements}
                                onChange={(e) => setRequirements(e.target.value)}
                            />
                        </div>
                        {error && <p className="text-sm text-destructive font-medium">{error}</p>}
                        <div className="space-y-2">
                            <Label>Deadline (opsional)</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="date" className="pl-10 h-11" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Lampiran (opsional)</Label>
                            <div className="border-2 border-dashed border-border/50 rounded-xl p-6 text-center cursor-pointer hover:border-primary/30 transition-colors">
                                <Paperclip className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">
                                    Drag & drop file atau <span className="text-primary">browse</span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    PDF, JPG, PNG — Max 10MB
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right: Summary */}
            <div className="space-y-4">
                <Card className="border-border/50 sticky top-20">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Ringkasan Pesanan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Harga paket</span>
                                <span>{formatPrice(service.price)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Biaya layanan (10%)</span>
                                <span>{formatPrice(serviceFee)}</span>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span className="gradient-text text-lg">{formatPrice(totalPrice)}</span>
                        </div>

                        <div className="space-y-2 text-xs text-muted-foreground">
                            <div className="flex items-start gap-2">
                                <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                                Pekerjaan profesional sesuai deskripsi
                            </div>
                            <div className="flex items-start gap-2">
                                <Clock className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                                Estimasi pengerjaan cepat
                            </div>
                            <div className="flex items-start gap-2">
                                <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                                Proteksi escrow payment
                            </div>
                        </div>

                        <Button
                            className="w-full gap-2 gradient-bg text-white border-0 h-11 hover:opacity-90 mt-4"
                            onClick={handleOrder}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    Buat Pesanan Sekarang
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function OrderPage() {
    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4 md:px-6">
                <Link
                    href="/marketplace"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Marketplace
                </Link>

                <h1 className="text-2xl md:text-3xl font-bold mb-8">
                    <span className="gradient-text">Pesan</span> Layanan
                </h1>

                <Suspense fallback={
                    <div className="min-h-[400px] flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                }>
                    <OrderForm />
                </Suspense>
            </div>
        </div>
    );
}
