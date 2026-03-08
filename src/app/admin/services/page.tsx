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
import { Loader2, Search, MoreVertical, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminServicesPage() {
    const [services, setServices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchServices() {
            try {
                const res = await fetch("/api/admin/services");
                if (res.ok) {
                    const data = await res.json();
                    setServices(data);
                }
            } catch (error) {
                console.error("Failed to fetch admin services:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchServices();
    }, []);

    const filteredServices = services.filter(service =>
        service.title?.toLowerCase().includes(search.toLowerCase()) ||
        service.provider?.name?.toLowerCase().includes(search.toLowerCase())
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
                    <h1 className="text-3xl font-bold tracking-tight">Service Management</h1>
                    <p className="text-muted-foreground mt-2">
                        Audit and manage all services listed on SkillBridge AI.
                    </p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search services..."
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
                                    <TableHead>Service Title</TableHead>
                                    <TableHead>Provider</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredServices.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                            No services found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredServices.map((service) => (
                                        <TableRow key={service.id} className="group hover:bg-primary/[0.02] border-border/20 transition-colors">
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-sm truncate max-w-[200px] group-hover:text-primary transition-colors">
                                                        {service.title}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground uppercase font-medium">#{service.id.substring(0, 8)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6 border border-border">
                                                        <AvatarFallback className="text-[8px] font-bold">
                                                            {service.provider?.name?.substring(0, 2)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-xs font-medium">{service.provider?.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground border-border/50">
                                                    {service.category?.name || "Uncategorized"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm font-bold">
                                                {formatCurrency(service.price)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={cn("text-[10px] font-bold h-5", service.isActive ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600")}>
                                                    {service.isActive ? "ACTIVE" : "INACTIVE"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                        <MoreVertical className="h-4 w-4" />
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
