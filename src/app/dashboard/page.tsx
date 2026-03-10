"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { StatsCard } from "@/components/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    ShoppingBag,
    Clock,
    CheckCircle,
    Wallet,
    ArrowRight,
    Star,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

export default function DashboardPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const isAdmin = session?.user?.role?.toLowerCase() === "admin";

    // Redirect admin to specialized admin dashboard if they land here
    useEffect(() => {
        if (isAdmin) {
            router.replace("/admin");
        }
    }, [isAdmin, router]);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await fetch("/api/orders");
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data.orders || []);
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchOrders();
    }, []);

    if (isPending || isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!session) {
        router.push("/login");
        return null;
    }

    const userName = session?.user?.name || "User";


    // Stats calculations
    const totalOrders = orders.length;
    const inProgressOrders = orders.filter(o => o.status === "in_progress").length;
    const completedOrders = orders.filter(o => o.status === "completed").length;

    // Total spent (for customer) or earned (for freelancer)
    const isFreelancer = session?.user?.role === "freelancer";
    const totalAmount = orders.reduce((sum, order) => sum + Number(order.totalPrice), 0);

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(amount);
    };

    const recentOrders = orders.slice(0, 3); // Get top 3 latest orders

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                    Selamat Datang, <span className="gradient-text">{userName.split(' ')[0]}</span> 👋
                </h1>
                <p className="text-muted-foreground mt-1">
                    Berikut ringkasan aktivitas akun Anda.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    icon={ShoppingBag}
                    title="Total Pesanan"
                    value={totalOrders.toString()}
                />
                <StatsCard
                    icon={Clock}
                    title="Dalam Proses"
                    value={inProgressOrders.toString()}
                />
                <StatsCard
                    icon={CheckCircle}
                    title="Selesai"
                    value={completedOrders.toString()}
                />
                <StatsCard
                    icon={Wallet}
                    title={isFreelancer ? "Total Pendapatan" : "Total Pengeluaran"}
                    value={formatCurrency(totalAmount)}
                />
            </div>

            {/* Recent Orders */}
            <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-lg">Pesanan Terbaru</CardTitle>
                    <Link href="/dashboard/orders">
                        <Button variant="ghost" size="sm" className="gap-1 text-primary">
                            Lihat Semua
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentOrders.length === 0 ? (
                            <p className="text-sm text-center text-muted-foreground py-6">
                                Belum ada pesanan terbaru.
                            </p>
                        ) : (
                            recentOrders.map((order) => {
                                const orderName = order.service?.title || "Layanan Dipesan";
                                const counterpartyName = isFreelancer ? order.customer?.name : order.freelancer?.name;
                                const initials = counterpartyName ? counterpartyName.substring(0, 2).toUpperCase() : "?";

                                let statusColor = "bg-muted text-muted-foreground";
                                let statusLabel = order.status;

                                switch (order.status) {
                                    case "pending":
                                        statusColor = "bg-blue-500/10 text-blue-500";
                                        statusLabel = "Menunggu";
                                        break;
                                    case "in_progress":
                                        statusColor = "bg-yellow-500/10 text-yellow-500";
                                        statusLabel = "Diproses";
                                        break;
                                    case "completed":
                                        statusColor = "bg-green-500/10 text-green-500";
                                        statusLabel = "Selesai";
                                        break;
                                    case "cancelled":
                                        statusColor = "bg-red-500/10 text-red-500";
                                        statusLabel = "Dibatalkan";
                                        break;
                                }

                                return (
                                    <div
                                        key={order.id}
                                        className="flex items-center gap-4 p-3 rounded-xl border border-border/50 hover:bg-secondary/50 transition-colors"
                                    >
                                        <Avatar className="h-10 w-10 shrink-0">
                                            <AvatarFallback className="gradient-bg text-white text-sm">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm truncate">{orderName}</h4>
                                            <p className="text-xs text-muted-foreground">{counterpartyName || "User"}</p>
                                        </div>
                                        <div className="text-right hidden sm:block">
                                            <p className="font-semibold text-sm">{formatCurrency(Number(order.totalPrice))}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("id-ID")}</p>
                                        </div>
                                        <Badge className={`${statusColor} text-xs shrink-0`}>
                                            {statusLabel}
                                        </Badge>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 gap-4">
                <Card className="border-border/50 hover:shadow-md transition-all cursor-pointer group" onClick={() => window.location.href = "/"}>
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl gradient-bg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                            <ShoppingBag className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm">Cari Layanan Baru</h3>
                            <p className="text-xs text-muted-foreground">Jelajahi marketplace untuk menemukan freelancer</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
                    </CardContent>
                </Card>
                <Card className="border-border/50 hover:shadow-md transition-all cursor-pointer group" onClick={() => window.location.href = "/dashboard/orders"}>
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                            <Star className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm">Beri Review</h3>
                            <p className="text-xs text-muted-foreground">Cek pesanan selesai untuk direview</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
