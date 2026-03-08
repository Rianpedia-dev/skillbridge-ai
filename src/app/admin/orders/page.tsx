"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Search, MoreVertical, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await fetch("/api/admin/orders");
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error("Failed to fetch admin orders:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(order =>
        order.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
        order.service?.title?.toLowerCase().includes(search.toLowerCase()) ||
        order.customer?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
                    <p className="text-muted-foreground mt-2">
                        Monitor all transactions and order statuses across the platform.
                    </p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search orders..."
                        className="pl-10 border-border/50 bg-card/50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Card className="border-border/50 shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex h-64 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-border/50">
                                    <TableHead>Order #</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Freelancer</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                            No orders found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <TableRow key={order.id} className="group hover:bg-primary/[0.02] border-border/20 transition-colors">
                                            <TableCell className="font-mono text-[10px] font-bold text-primary">
                                                {order.orderNumber}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-sm group-hover:text-primary transition-colors truncate max-w-[150px]">
                                                        {order.service?.title}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {new Date(order.createdAt).toLocaleDateString("id-ID")}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-5 w-5 border border-border">
                                                        <AvatarFallback className="text-[7px] font-black uppercase">
                                                            {order.customer?.name?.substring(0, 2)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-xs">{order.customer?.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-5 w-5 border border-border">
                                                        <AvatarFallback className="text-[7px] font-black uppercase">
                                                            {order.freelancer?.name?.substring(0, 2)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-xs">{order.freelancer?.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm font-bold">
                                                {formatCurrency(Number(order.totalPrice))}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={cn(
                                                        "text-[9px] font-bold h-4 px-1.5",
                                                        order.status === "completed" ? "bg-green-500/10 text-green-600" :
                                                            order.status === "pending" ? "bg-blue-500/10 text-blue-600" :
                                                                "bg-yellow-500/10 text-yellow-600"
                                                    )}
                                                >
                                                    {order.status.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary">
                                                        <FileText className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary">
                                                        <MoreVertical className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
