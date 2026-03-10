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
import {
    Loader2,
    Search,
    MoreVertical,
    ExternalLink,
    Power,
    PowerOff,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminServicesPage() {
    const [services, setServices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [toggleService, setToggleService] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    async function fetchServices() {
        try {
            setIsLoading(true);
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

    const filteredServices = services.filter(service =>
        service.title?.toLowerCase().includes(search.toLowerCase()) ||
        service.provider?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
    };

    async function handleToggleActive() {
        if (!toggleService) return;
        setIsSaving(true);
        try {
            const res = await fetch(`/api/admin/services/${toggleService.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !toggleService.isActive }),
            });
            if (res.ok) {
                await fetchServices();
                setToggleService(null);
            }
        } catch (error) {
            console.error("Failed to toggle service:", error);
        } finally {
            setIsSaving(false);
        }
    }

    const activeCount = services.filter(s => s.isActive).length;
    const inactiveCount = services.filter(s => !s.isActive).length;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manajemen Jasa</h1>
                    <p className="text-muted-foreground mt-2">Audit dan kelola semua jasa yang terdaftar di SkillBridge AI.</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Cari jasa..." className="pl-10 border-border/50 bg-card/50" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <Card className="border-border/50 bg-card/50"><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{services.length}</p><p className="text-xs text-muted-foreground">Total Jasa</p></CardContent></Card>
                <Card className="border-border/50 bg-card/50"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-500">{activeCount}</p><p className="text-xs text-muted-foreground">Aktif</p></CardContent></Card>
                <Card className="border-border/50 bg-card/50"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-red-500">{inactiveCount}</p><p className="text-xs text-muted-foreground">Nonaktif</p></CardContent></Card>
            </div>

            <Card className="border-border/50 shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                    ) : (
                        <div className="overflow-x-auto w-full">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-border/50">
                                        <TableHead className="whitespace-nowrap">Judul Jasa</TableHead>
                                        <TableHead>Penyedia</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Harga</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right whitespace-nowrap">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredServices.length === 0 ? (
                                        <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">Tidak ada jasa ditemukan.</TableCell></TableRow>
                                    ) : (
                                        filteredServices.map((svc) => (
                                            <TableRow key={svc.id} className="group hover:bg-primary/[0.02] border-border/20 transition-colors">
                                                <TableCell className="min-w-[200px]">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-sm truncate max-w-[200px] group-hover:text-primary transition-colors">{svc.title}</span>
                                                        <span className="text-[10px] text-muted-foreground uppercase font-medium">#{svc.id.substring(0, 8)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="min-w-[150px]">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-6 w-6 border border-border"><AvatarFallback className="text-[8px] font-bold">{svc.provider?.name?.substring(0, 2)}</AvatarFallback></Avatar>
                                                        <span className="text-xs font-medium whitespace-nowrap">{svc.provider?.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground border-border/50 whitespace-nowrap">{svc.category?.name || "Tanpa Kategori"}</Badge>
                                                </TableCell>
                                                <TableCell className="text-sm font-bold whitespace-nowrap">{formatCurrency(svc.price)}</TableCell>
                                                <TableCell>
                                                    <Badge className={cn("text-[10px] font-bold h-5 cursor-pointer hover:opacity-80 transition-opacity", svc.isActive ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600")} onClick={() => setToggleService(svc)}>
                                                        {svc.isActive ? "AKTIF" : "NONAKTIF"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" />}>
                                                            <MoreVertical className="h-4 w-4" />
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuItem onClick={() => window.open(`/marketplace/${svc.id}`, '_blank')} className="gap-2">
                                                                <ExternalLink className="h-3.5 w-3.5" /> Lihat di Marketplace
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => setToggleService(svc)} className="gap-2">
                                                                {svc.isActive ? (<><PowerOff className="h-3.5 w-3.5 text-red-500" /><span className="text-red-600">Nonaktifkan Jasa</span></>) : (<><Power className="h-3.5 w-3.5 text-green-500" /><span className="text-green-600">Aktifkan Jasa</span></>)}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
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

            {/* Toggle Confirmation Dialog */}
            <AlertDialog open={!!toggleService} onOpenChange={(open: boolean) => { if (!open) setToggleService(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{toggleService?.isActive ? "Nonaktifkan Jasa?" : "Aktifkan Jasa?"}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {toggleService?.isActive
                                ? `Apakah Anda yakin ingin menonaktifkan jasa "${toggleService?.title}"? Jasa ini tidak akan muncul di marketplace.`
                                : `Apakah Anda yakin ingin mengaktifkan kembali jasa "${toggleService?.title}"? Jasa ini akan muncul di marketplace.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleToggleActive} className={toggleService?.isActive ? "bg-red-600 hover:bg-red-700 text-white" : "gradient-bg text-white"}>
                            {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            {toggleService?.isActive ? "Nonaktifkan" : "Aktifkan"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
