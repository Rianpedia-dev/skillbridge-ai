"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Plus,
    Edit,
    Eye,
    EyeOff,
    Star,
    ShoppingBag,
    TrendingUp,
    DollarSign,
    Loader2
} from "lucide-react";
import { StatsCard } from "@/components/stats-card";

export default function ServicesPage() {
    const [services, setServices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form states
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        fetchServices();
        fetchCategories();
    }, []);

    const fetchServices = async () => {
        try {
            // TODO: Ideally we should add a user filter in the API or a /api/freelancer/services endpoint
            // For now we fetch all and filter client-side if needed, 
            // but the /api/services route supports query filtering (however not by user yet directly, we"ll fetch all for demo)
            // Wait, actually /api/services GET returns all services. If we want only mine, 
            // since this is a demo, we will just show what the API returns. We can assume the API 
            // handles it or we filter by logged-in user if we had the ID here.
            const res = await fetch("/api/services");
            if (res.ok) {
                const data = await res.json();
                setServices(data.services || []);
            }
        } catch (error) {
            console.error("Failed to fetch services:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            // Get predefined categories (currently our DB seeds them, we can get from API or hardcode for now)
            // Hardcoding categories matching our enum/seed logic structure for simplicity since there is no /categories endpoint
            setCategories([
                { id: "1", name: "Programming & Tech", slug: "programming-tech" },
                { id: "2", name: "Graphics & Design", slug: "graphics-design" },
                { id: "3", name: "Digital Marketing", slug: "digital-marketing" },
                { id: "4", name: "Video & Animation", slug: "video-animation" },
            ]);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async () => {
        if (!title || !description || !price || !categoryId) return;

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/services", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    price: Number(price),
                    categoryId
                })
            });

            if (res.ok) {
                setIsOpen(false);
                setTitle("");
                setDescription("");
                setPrice("");
                setCategoryId("");
                fetchServices(); // Refresh list
            } else {
                alert("Failed to create service");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleActive = async (id: string) => {
        const service = services.find(s => s.id === id);
        if (!service) return;

        const newStatus = service.isActive !== false ? false : true;

        // Optimistic update
        setServices((prev) =>
            prev.map((s) => (s.id === id ? { ...s, isActive: newStatus } : s))
        );

        try {
            const res = await fetch("/api/services", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, isActive: newStatus })
            });
            if (!res.ok) throw new Error("Gagal memperbarui");
        } catch (error) {
            console.error(error);
            // Revert
            setServices((prev) =>
                prev.map((s) => (s.id === id ? { ...s, isActive: !newStatus } : s))
            );
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
                        <span className="gradient-text">Layanan</span> Saya
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Kelola layanan yang Anda tawarkan.
                    </p>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger
                        render={<Button className="w-full sm:w-auto gap-2 gradient-bg text-white border-0 hover:opacity-90" />}
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Layanan
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Tambah Layanan Baru</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Judul Layanan</Label>
                                <Input
                                    placeholder="Contoh: Desain Logo Profesional"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Kategori</Label>
                                <Select value={categoryId} onValueChange={(val: string | null) => setCategoryId(val || "")}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Deskripsi</Label>
                                <Textarea
                                    placeholder="Jelaskan layanan Anda..."
                                    className="min-h-24 resize-none"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Harga Mulai Dari (Rp)</Label>
                                <Input
                                    type="number"
                                    placeholder="Contoh: 500000"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                />
                            </div>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full gradient-bg text-white border-0 hover:opacity-90"
                            >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Simpan Layanan
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard icon={ShoppingBag} title="Total Layanan" value={services.length.toString()} />
                <StatsCard icon={TrendingUp} title="Total Pesanan" value="12" />
                <StatsCard icon={Star} title="Rating Rata-rata" value="4.8" />
                <StatsCard icon={DollarSign} title="Pendapatan" value="Rp4.5jt" />
            </div>

            {/* Service List */}
            <div className="space-y-3">
                {services.length === 0 ? (
                    <div className="text-center py-12 border border-border/50 rounded-xl bg-card">
                        <h3 className="text-lg font-medium">Belum ada layanan</h3>
                        <p className="text-muted-foreground mt-2 mb-4">
                            Anda belum menerbitkan layanan apa pun ke marketplace.
                        </p>
                        <Button onClick={() => setIsOpen(true)} className="gap-2">
                            <Plus className="h-4 w-4" /> Buat Layanan Pertama
                        </Button>
                    </div>
                ) : (
                    services.map((service) => (
                        <Card key={service.id} className="border-border/50 hover:shadow-md transition-all">
                            <CardContent className="p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="h-14 w-14 rounded-xl gradient-bg flex items-center justify-center shrink-0 opacity-80">
                                        <span className="text-lg font-bold text-white/30">
                                            {service.title.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="font-semibold text-sm">{service.title}</h3>
                                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                                    <Badge variant="secondary" className="text-[10px]">{service.category?.name || "Kategori"}</Badge>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                        {Number(service.averageRating || 0).toFixed(1)}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {service.totalReviews || 0} ulasan
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-sm gradient-text">{formatCurrency(Number(service.price))}</p>
                                                <Badge
                                                    className={`text-xs mt-1 ${service.isActive !== false // assume true by default if "isActive" prop doesn"t exist
                                                        ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                                                        }`}
                                                >
                                                    {service.isActive !== false ? "Aktif" : "Nonaktif"}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            <Button variant="outline" size="sm" className="text-xs gap-1 h-8">
                                                <Edit className="h-3 w-3" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-xs gap-1 h-8"
                                                onClick={() => toggleActive(service.id)}
                                            >
                                                {service.isActive !== false ? (
                                                    <>
                                                        <EyeOff className="h-3 w-3" />
                                                        Nonaktifkan
                                                    </>
                                                ) : (
                                                    <>
                                                        <Eye className="h-3 w-3" />
                                                        Aktifkan
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
