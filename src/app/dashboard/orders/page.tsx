"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Clock,
    Eye,
    MessageSquare,
    Star,
    Loader2,
    ShieldCheck,
    Wallet,
    CheckCircle2,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function OrdersPage() {
    const { data: session } = useSession();
    const isFreelancer = session?.user?.role === "freelancer";

    const [filter, setFilter] = useState("all");
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [releasingId, setReleasingId] = useState<string | null>(null);

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

    const filteredOrders =
        filter === "all" ? orders : orders.filter((o) => o.status === filter);

    const updateOrderStatus = async (id: string, newStatus: string) => {
        try {
            // Optimistic update
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));

            const res = await fetch("/api/orders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus })
            });

            if (!res.ok) {
                // Revert if failed
                setOrders(prev => prev.map(o => o.id === id ? { ...o, status: orders.find(x => x.id === id)?.status } : o));
                const data = await res.json();
                alert(data.error || "Gagal memperbarui status");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const releaseFunds = async (orderId: string) => {
        if (!confirm("Apakah Anda yakin pekerjaan sudah selesai? Dana akan dilepaskan ke freelancer.")) {
            return;
        }

        setReleasingId(orderId);
        try {
            const res = await fetch(`/api/orders/${orderId}/release`, {
                method: "POST",
            });

            const data = await res.json();

            if (res.ok) {
                // Update order locally
                setOrders(prev => prev.map(o =>
                    o.id === orderId
                        ? { ...o, paymentStatus: "released" }
                        : o
                ));
                alert(`Dana berhasil dilepaskan! Freelancer menerima Rp ${data.earning?.toLocaleString("id-ID")}`);
            } else {
                alert(data.error || "Gagal melepas dana");
            }
        } catch (error) {
            console.error("Release fund error:", error);
            alert("Terjadi kesalahan saat melepas dana");
        } finally {
            setReleasingId(null);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">
                        <span className="gradient-text">Pesanan</span> Saya
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Kelola semua pesanan Anda di sini.
                    </p>
                </div>
                <Select value={filter} onValueChange={(v) => setFilter(v ?? "all")}>
                    <SelectTrigger className="w-full sm:w-44">
                        <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua ({orders.length})</SelectItem>
                        <SelectItem value="pending">Menunggu ({orders.filter(o => o.status === "pending").length})</SelectItem>
                        <SelectItem value="accepted">Diterima ({orders.filter(o => o.status === "accepted").length})</SelectItem>
                        <SelectItem value="in_progress">Dalam Proses ({orders.filter(o => o.status === "in_progress").length})</SelectItem>
                        <SelectItem value="completed">Selesai ({orders.filter(o => o.status === "completed").length})</SelectItem>
                        <SelectItem value="cancelled">Dibatalkan</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-3">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-12 border border-border/50 rounded-xl bg-card">
                        <h3 className="text-lg font-medium">Belum ada pesanan</h3>
                        <p className="text-muted-foreground mt-2">
                            {filter === "all"
                                ? "Anda belum memiliki riwayat transaksi apa pun."
                                : `Tidak ada pesanan dengan status ${filter.replace("_", " ")}`}
                        </p>
                    </div>
                ) : (
                    filteredOrders.map((order) => {
                        const orderName = order.service?.title || "Layanan Dipesan";
                        const counterpartyName = isFreelancer ? order.customer?.name : order.freelancer?.name;
                        const initials = counterpartyName ? counterpartyName.substring(0, 2).toUpperCase() : "?";

                        let statusColor = "bg-muted text-muted-foreground";
                        let statusLabel = order.status;

                        switch (order.status) {
                            case "pending":
                                statusColor = "bg-blue-500/10 text-blue-500";
                                statusLabel = "Menunggu Pembayaran";
                                break;
                            case "accepted":
                                statusColor = "bg-indigo-500/10 text-indigo-500";
                                statusLabel = "Diterima";
                                break;
                            case "in_progress":
                                statusColor = "bg-yellow-500/10 text-yellow-500";
                                statusLabel = "Dalam Pengerjaan";
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

                        // Payment status badge
                        let paymentBadge = null;
                        switch (order.paymentStatus) {
                            case "escrow":
                                paymentBadge = (
                                    <Badge className="bg-primary/10 text-primary text-xs gap-1">
                                        <ShieldCheck className="h-3 w-3" />
                                        Escrow
                                    </Badge>
                                );
                                break;
                            case "released":
                                paymentBadge = (
                                    <Badge className="bg-green-500/10 text-green-500 text-xs gap-1">
                                        <Wallet className="h-3 w-3" />
                                        Dana Dilepas
                                    </Badge>
                                );
                                break;
                            case "refunded":
                                paymentBadge = (
                                    <Badge className="bg-orange-500/10 text-orange-500 text-xs gap-1">
                                        Refund
                                    </Badge>
                                );
                                break;
                        }

                        const createdDate = new Date(order.createdAt);
                        const deadlineDate = new Date(createdDate.getTime() + (7 * 24 * 60 * 60 * 1000));

                        return (
                            <Card key={order.id} className="border-border/50 hover:shadow-md transition-all">
                                <CardContent className="p-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <Avatar className="h-12 w-12 shrink-0">
                                            <AvatarFallback className="gradient-bg text-white">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h3 className="font-semibold text-sm truncate">{orderName}</h3>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {counterpartyName || "User"} • #{order.orderNumber || order.id.substring(0, 8).toUpperCase()}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <Badge className={`${statusColor} text-xs shrink-0`}>
                                                        {statusLabel}
                                                    </Badge>
                                                    {paymentBadge}
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                                                <span>Dibuat: {createdDate.toLocaleDateString("id-ID")}</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    Target: {deadlineDate.toLocaleDateString("id-ID")}
                                                </span>
                                                <span className="font-semibold text-foreground">{formatCurrency(Number(order.totalPrice))}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                <Button variant="outline" size="sm" className="text-xs gap-1 h-8">
                                                    <Eye className="h-3 w-3" />
                                                    Detail
                                                </Button>
                                                <Button variant="outline" size="sm" className="text-xs gap-1 h-8">
                                                    <MessageSquare className="h-3 w-3" />
                                                    Chat
                                                </Button>

                                                {/* Customer: Review button when completed & released */}
                                                {order.status === "completed" && order.paymentStatus === "released" && !isFreelancer && (
                                                    <Button variant="outline" size="sm" className="text-xs gap-1 h-8 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/10">
                                                        <Star className="h-3 w-3" />
                                                        Beri Review
                                                    </Button>
                                                )}

                                                {/* Customer: Release fund button when completed & escrow */}
                                                {!isFreelancer && order.status === "completed" && order.paymentStatus === "escrow" && (
                                                    <Button
                                                        onClick={() => releaseFunds(order.id)}
                                                        disabled={releasingId === order.id}
                                                        size="sm"
                                                        className="text-xs gap-1 h-8 gradient-bg text-white border-0 hover:opacity-90"
                                                    >
                                                        {releasingId === order.id ? (
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        ) : (
                                                            <CheckCircle2 className="h-3 w-3" />
                                                        )}
                                                        Konfirmasi & Rilis Dana
                                                    </Button>
                                                )}

                                                {/* Freelancer: Accept order */}
                                                {isFreelancer && order.status === "accepted" && order.paymentStatus === "escrow" && (
                                                    <Button onClick={() => updateOrderStatus(order.id, "in_progress")} size="sm" className="text-xs h-8 bg-yellow-500 hover:bg-yellow-600 text-white border-0">
                                                        Mulai Kerjakan
                                                    </Button>
                                                )}

                                                {/* Freelancer: Start working */}
                                                {isFreelancer && order.status === "in_progress" && (
                                                    <Button onClick={() => updateOrderStatus(order.id, "completed")} size="sm" className="text-xs h-8 gradient-bg text-white border-0 hover:opacity-90">
                                                        Selesaikan
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
