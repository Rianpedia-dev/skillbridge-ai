"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    CheckCircle,
    PartyPopper,
    ArrowRight,
    ShieldCheck,
    Loader2
} from "lucide-react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    return (
        <Card className="w-full max-w-md border-border/50 text-center">
            <CardContent className="p-8">
                <div className="mx-auto h-20 w-20 rounded-full gradient-bg flex items-center justify-center mb-6 animate-pulse-glow">
                    <PartyPopper className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Pembayaran Berhasil! 🎉</h2>
                <p className="text-muted-foreground mb-6">
                    Terima kasih! Pembayaran Anda telah diterima. Freelancer akan segera memulai pengerjaan proyek Anda.
                </p>

                <Card className="border-border/50 bg-primary/5 mb-6">
                    <CardContent className="p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">ID Pesanan</span>
                            <span className="font-medium">#{orderId?.slice(0, 8) || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Status Pembayaran</span>
                            <Badge className="bg-green-500/10 text-green-500 text-xs text-nowrap">Escrow Aktif</Badge>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 mb-6 text-left">
                    <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                        Dana Anda ditahan aman oleh platform (escrow). Freelancer baru akan menerima pembayaran setelah Anda mengonfirmasi pekerjaan selesai.
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <Link href="/dashboard/orders">
                        <Button className="w-full gap-2 gradient-bg text-white border-0 hover:opacity-90">
                            Lihat Dashboard Pesanan
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="/marketplace">
                        <Button variant="outline" className="w-full">
                            Kembali ke Marketplace
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <Suspense fallback={
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Memproses data pesanan...</p>
                </div>
            }>
                <SuccessContent />
            </Suspense>
        </div>
    );
}
