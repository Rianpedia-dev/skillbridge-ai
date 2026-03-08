"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "@/components/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Users,
    Briefcase,
    ShoppingBag,
    Wallet,
    ArrowUpRight,
    TrendingUp,
    ShieldAlert,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/admin/stats");
                if (res.ok) {
                    const statsData = await res.json();
                    setData(statsData);
                }
            } catch (error) {
                console.error("Failed to fetch admin stats:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
                <p className="text-muted-foreground mt-2">
                    Monitoring and managing the SkillBridge AI ecosystem.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    icon={Users}
                    title="Total Users"
                    value={data?.stats?.users?.toString() || "0"}
                />
                <StatsCard
                    icon={Briefcase}
                    title="Active Services"
                    value={data?.stats?.services?.toString() || "0"}
                />
                <StatsCard
                    icon={ShoppingBag}
                    title="Total Orders"
                    value={data?.stats?.orders?.toString() || "0"}
                />
                <StatsCard
                    icon={Wallet}
                    title="Total Revenue"
                    value={formatCurrency(data?.stats?.revenue || 0)}
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Transactions */}
                <Card className="lg:col-span-2 border-border/50 shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl">Latest Platform Activity</CardTitle>
                        <Button variant="outline" size="sm" className="gap-1 border-primary/20 text-primary hover:bg-primary/5">
                            View Reports <ArrowUpRight className="h-3.5 w-3.5" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {data?.latestOrders?.length === 0 ? (
                                <p className="text-center text-muted-foreground py-12">No recent activity detected.</p>
                            ) : (
                                data?.latestOrders?.map((order: any) => (
                                    <div key={order.id} className="flex items-center gap-4 group">
                                        <Avatar className="h-10 w-10 border border-primary/20 p-1 group-hover:scale-105 transition-transform">
                                            <AvatarFallback className="gradient-bg text-white text-[10px] font-bold">
                                                ORD
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                                                {order.service?.title || "Unknown Service"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                <span className="text-primary font-medium">@{order.customer?.name}</span> ordered from <span className="font-medium">@{order.freelancer?.name}</span>
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold">{formatCurrency(Number(order.totalPrice))}</p>
                                            <Badge variant="outline" className="text-[10px] py-0 border-border/50">
                                                {order.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* System Health / Status */}
                <div className="space-y-6">
                    <Card className="border-border/50 bg-gradient-to-br from-primary/10 to-transparent">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-md flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                Platform Growth
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-black">+12.5%</p>
                            <p className="text-xs text-muted-foreground mt-1 text-primary italic font-medium">New users this week</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-md flex items-center gap-2 text-yellow-500">
                                <ShieldAlert className="h-5 w-5" />
                                Action Required
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-yellow-500/10 rounded-lg text-xs border border-yellow-500/20 text-yellow-700">
                                4 services pending manual review.
                            </div>
                            <div className="p-3 bg-blue-500/10 rounded-lg text-xs border border-blue-500/20 text-blue-700">
                                2 withdrawal requests waiting approval.
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
