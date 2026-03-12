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
import { Loader2, Search, MoreVertical, FileText, CheckCircle, Clock, XCircle, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    
    // Modal states
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchOrders = async () => {
        setIsLoading(true);
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
    };

    useEffect(() => {
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

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                // Optimistic update
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            } else {
                alert("Gagal mengupdate status order.");
            }
        } catch (error) {
            console.error("Update error:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteOrder = async (orderId: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus pesanan ini secara permanen?")) return;
        
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setOrders(prev => prev.filter(o => o.id !== orderId));
            } else {
                alert("Gagal menghapus order.");
            }
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setIsUpdating(false);
            if (selectedOrder?.id === orderId) setIsDetailsOpen(false);
        }
    };

    const openDetails = (order: any) => {
        setSelectedOrder(order);
        setIsDetailsOpen(true);
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
                        <div className="overflow-x-auto w-full">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-border/50">
                                        <TableHead className="whitespace-nowrap">Order #</TableHead>
                                        <TableHead>Service</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Freelancer</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
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
                                                <TableCell className="min-w-[150px]">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-sm group-hover:text-primary transition-colors truncate max-w-[150px]">
                                                            {order.service?.title}
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                            {new Date(order.createdAt).toLocaleDateString("id-ID")}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="min-w-[120px]">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-5 w-5 border border-border">
                                                            <AvatarFallback className="text-[7px] font-black uppercase">
                                                                {order.customer?.name?.substring(0, 2)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-xs whitespace-nowrap">{order.customer?.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="min-w-[120px]">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-5 w-5 border border-border">
                                                            <AvatarFallback className="text-[7px] font-black uppercase">
                                                                {order.freelancer?.name?.substring(0, 2)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-xs whitespace-nowrap">{order.freelancer?.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm font-bold whitespace-nowrap">
                                                    {formatCurrency(Number(order.totalPrice))}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={cn(
                                                            "text-[9px] font-bold h-4 px-1.5 whitespace-nowrap",
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
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-7 w-7 text-muted-foreground hover:text-primary"
                                                            onClick={() => openDetails(order)}
                                                        >
                                                            <FileText className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-7 w-7 text-muted-foreground hover:text-primary" disabled={isUpdating}>
                                                                {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MoreVertical className="h-3.5 w-3.5" />}
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-48">
                                                                <DropdownMenuGroup>
                                                                    <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "completed")}>
                                                                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                                                        Mark as Completed
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "pending")}>
                                                                        <Clock className="h-4 w-4 mr-2 text-blue-500" />
                                                                        Mark as Pending
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "cancelled")}>
                                                                        <XCircle className="h-4 w-4 mr-2 text-yellow-500" />
                                                                        Mark as Cancelled
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuGroup>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem 
                                                                    onClick={() => handleDeleteOrder(order.id)}
                                                                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10 focus:text-red-600 focus:bg-red-500/10"
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Hapus Pesanan
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Order Details Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-[600px] border-border/50 bg-card/95 backdrop-blur-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <span>Detail Pesanan</span>
                            <Badge variant="outline" className="font-mono text-xs text-primary bg-primary/5">
                                {selectedOrder?.orderNumber}
                            </Badge>
                        </DialogTitle>
                        <DialogDescription>
                            Dibuat pada {selectedOrder && new Date(selectedOrder.createdAt).toLocaleString("id-ID")}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="grid gap-6 py-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-secondary/30">
                                <div className="h-12 w-16 bg-muted rounded overflow-hidden relative shrink-0">
                                    {selectedOrder.service?.image ? (
                                        <img src={selectedOrder.service.image} alt="Service" className="object-cover w-full h-full" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground">
                                            {selectedOrder.service?.title?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm truncate">{selectedOrder.service?.title}</h4>
                                    <p className="text-xl font-bold gradient-text">{formatCurrency(Number(selectedOrder.totalPrice))}</p>
                                </div>
                                <div className="shrink-0 text-right">
                                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                                    <Badge
                                        className={cn(
                                            "text-[10px] font-bold h-5 uppercase",
                                            selectedOrder.status === "completed" ? "bg-green-500/10 text-green-600" :
                                                selectedOrder.status === "pending" ? "bg-blue-500/10 text-blue-600" :
                                                    "bg-yellow-500/10 text-yellow-600"
                                        )}
                                    >
                                        {selectedOrder.status}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h5 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Customer</h5>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="text-xs">
                                                {selectedOrder.customer?.name?.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">{selectedOrder.customer?.name}</p>
                                            <p className="text-[10px] text-muted-foreground">{selectedOrder.customer?.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h5 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Freelancer</h5>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="text-xs">
                                                {selectedOrder.freelancer?.name?.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">{selectedOrder.freelancer?.name}</p>
                                            <p className="text-[10px] text-muted-foreground">{selectedOrder.freelancer?.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h5 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Requirements / Catatan Pembeli</h5>
                                <div className="p-3 bg-secondary/20 rounded-lg border border-border/30 text-sm whitespace-pre-wrap leading-relaxed">
                                    {selectedOrder.requirements || <span className="text-muted-foreground italic">Tidak ada persyaratan khusus</span>}
                                </div>
                            </div>

                            <div>
                                <h5 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Payment Status</h5>
                                <Badge variant="outline" className={cn("text-xs", 
                                    selectedOrder.paymentStatus === "released" ? "border-green-500 text-green-500" : 
                                    selectedOrder.paymentStatus === "escrow" ? "border-blue-500 text-blue-500" : "border-yellow-500 text-yellow-500"
                                )}>
                                    {selectedOrder.paymentStatus?.toUpperCase() || "PENDING"}
                                </Badge>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
