"use client";

import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
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
    Trash2,
    Eye,
    EyeOff,
    Star,
    ShoppingBag,
    TrendingUp,
    DollarSign,
    Loader2,
    MapPin,
} from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { useSession } from "@/lib/auth-client";

interface ServiceFormData {
    title: string;
    description: string;
    price: string;
    categoryId: string;
    isOnSite: boolean;
    location: string;
    image: string;
}

const emptyForm: ServiceFormData = {
    title: "",
    description: "",
    price: "",
    categoryId: "",
    isOnSite: false,
    location: "",
    image: "",
};

export default function ServicesPage() {
    const { data: session } = useSession();
    const [services, setServices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);

    // Dialog states
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Form state
    const [form, setForm] = useState<ServiceFormData>(emptyForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Reset image state when forms close
    useEffect(() => {
        if (!isCreateOpen && !isEditOpen) {
            setImageFile(null);
            setImagePreview(null);
        }
    }, [isCreateOpen, isEditOpen]);

    useEffect(() => {
        fetchServices();
        fetchCategories();
    }, [session]);

    const fetchServices = async () => {
        if (!session?.user?.id) return;
        try {
            // Fetch only my services using providerId filter
            const res = await fetch(`/api/services?providerId=${session.user.id}`);
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
            const res = await fetch("/api/categories");
            if (res.ok) {
                const data = await res.json();
                setCategories(data.categories || []);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    const handleCreate = async () => {
        if (!form.title || !form.description || !form.price) return;

        setIsSubmitting(true);
        try {
            let imageUrl = form.image;

            // Upload image if a new one is selected
            if (imageFile) {
                let fileToUpload = imageFile;

                // Compress if larger than 5MB
                if (imageFile.size > 5 * 1024 * 1024) {
                    try {
                        const options = {
                            maxSizeMB: 2.5,
                            maxWidthOrHeight: 1920,
                            useWebWorker: true,
                        };
                        fileToUpload = await imageCompression(imageFile, options);
                    } catch (error) {
                        console.error("Compression error:", error);
                        alert("Gagal mengkompresi gambar.");
                        setIsSubmitting(false);
                        return;
                    }
                }

                const formData = new FormData();
                formData.append("file", fileToUpload);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    imageUrl = uploadData.url;
                } else {
                    const errorData = await uploadRes.json();
                    alert(errorData.error || "Gagal mengunggah gambar");
                    setIsSubmitting(false);
                    return;
                }
            }

            const res = await fetch("/api/services", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: form.title,
                    description: form.description,
                    price: Number(form.price),
                    categoryId: form.categoryId || null,
                    isOnSite: form.isOnSite,
                    location: form.location || null,
                    image: imageUrl || null,
                }),
            });

            if (res.ok) {
                setIsCreateOpen(false);
                setForm(emptyForm);
                setImageFile(null);
                setImagePreview(null);
                fetchServices();
            } else {
                const data = await res.json();
                alert(data.error || "Gagal membuat layanan");
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEdit = (svc: any) => {
        setEditingId(svc.id);
        setImageFile(null);
        setImagePreview(svc.image || null);
        setForm({
            title: svc.title,
            description: svc.description,
            price: String(svc.price),
            categoryId: svc.categoryId || "",
            isOnSite: svc.isOnSite || false,
            location: svc.location || "",
            image: svc.image || "",
        });
        setIsEditOpen(true);
    };

    const handleEdit = async () => {
        if (!editingId || !form.title || !form.description || !form.price) return;

        setIsSubmitting(true);
        try {
            let imageUrl = form.image;

            // Upload image if a new one is selected
            if (imageFile) {
                let fileToUpload = imageFile;

                // Compress if larger than 5MB
                if (imageFile.size > 5 * 1024 * 1024) {
                    try {
                        const options = {
                            maxSizeMB: 2.5,
                            maxWidthOrHeight: 1920,
                            useWebWorker: true,
                        };
                        fileToUpload = await imageCompression(imageFile, options);
                    } catch (error) {
                        console.error("Compression error:", error);
                        alert("Gagal mengkompresi gambar.");
                        setIsSubmitting(false);
                        return;
                    }
                }

                const formData = new FormData();
                formData.append("file", fileToUpload);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    imageUrl = uploadData.url;
                } else {
                    const errorData = await uploadRes.json();
                    alert(errorData.error || "Gagal mengunggah gambar");
                    setIsSubmitting(false);
                    return;
                }
            }

            const res = await fetch(`/api/services/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: form.title,
                    description: form.description,
                    price: Number(form.price),
                    categoryId: form.categoryId || null,
                    isOnSite: form.isOnSite,
                    location: form.location || null,
                    image: imageUrl || null,
                }),
            });

            if (res.ok) {
                setIsEditOpen(false);
                setEditingId(null);
                setForm(emptyForm);
                setImageFile(null);
                setImagePreview(null);
                fetchServices();
            } else {
                const data = await res.json();
                alert(data.error || "Gagal memperbarui layanan");
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openDelete = (id: string) => {
        setDeletingId(id);
        setIsDeleteOpen(true);
    };

    const handleDelete = async () => {
        if (!deletingId) return;

        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/services/${deletingId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setIsDeleteOpen(false);
                setDeletingId(null);
                fetchServices();
            } else {
                const data = await res.json();
                alert(data.error || "Gagal menghapus layanan");
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleActive = async (id: string) => {
        const svc = services.find((s) => s.id === id);
        if (!svc) return;

        const newStatus = !svc.isActive;

        // Optimistic update
        setServices((prev) =>
            prev.map((s) => (s.id === id ? { ...s, isActive: newStatus } : s))
        );

        try {
            const res = await fetch("/api/services", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, isActive: newStatus }),
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
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Service form fields (shared between create and edit)
    const renderFormFields = () => (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Judul Layanan *</Label>
                <Input
                    placeholder="Contoh: Desain Logo Profesional"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <Label>Gambar Layanan</Label>
                <div className="flex flex-col gap-3">
                    {imagePreview && (
                        <div className="relative h-32 w-full max-w-sm overflow-hidden rounded-lg border border-border">
                            <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                    )}
                    <Input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setImageFile(file);
                                const url = URL.createObjectURL(file);
                                setImagePreview(url);
                            } else {
                                setImageFile(null);
                                setImagePreview(form.image || null);
                            }
                        }}
                    />
                    <p className="text-xs text-muted-foreground">Format: JPG, PNG, WEBP. Maks 5MB.</p>
                </div>
            </div>
            <div className="space-y-2">
                <Label>Kategori</Label>
                <Select
                    value={form.categoryId}
                    onValueChange={(val: string | null) =>
                        setForm({ ...form, categoryId: val || "" })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Deskripsi *</Label>
                <Textarea
                    placeholder="Jelaskan layanan Anda secara detail..."
                    className="min-h-24 resize-none"
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                />
            </div>
            <div className="space-y-2">
                <Label>Harga Mulai Dari (Rp) *</Label>
                <Input
                    type="number"
                    placeholder="Contoh: 500000"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border/50 p-3">
                <input
                    type="checkbox"
                    id="isOnSite"
                    checked={form.isOnSite}
                    onChange={(e) =>
                        setForm({ ...form, isOnSite: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-border accent-primary"
                />
                <div>
                    <Label htmlFor="isOnSite" className="text-sm cursor-pointer">Layanan On-Site</Label>
                    <p className="text-xs text-muted-foreground">
                        Datang ke lokasi pelanggan
                    </p>
                </div>
            </div>
            {form.isOnSite && (
                <div className="space-y-2">
                    <Label>Lokasi Layanan</Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Contoh: Jakarta Selatan"
                            value={form.location}
                            onChange={(e) =>
                                setForm({ ...form, location: e.target.value })
                            }
                            className="pl-9"
                        />
                    </div>
                </div>
            )}
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const activeCount = services.filter((s) => s.isActive).length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">
                        <span className="gradient-text">Layanan</span> Saya
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Kelola layanan yang Anda tawarkan di marketplace.
                    </p>
                </div>

                {/* Create Dialog */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger
                        render={
                            <Button className="w-full sm:w-auto gap-2 gradient-bg text-white border-0 hover:opacity-90" />
                        }
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Layanan
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Tambah Layanan Baru</DialogTitle>
                        </DialogHeader>
                        {renderFormFields()}
                        <Button
                            onClick={handleCreate}
                            disabled={
                                isSubmitting ||
                                !form.title ||
                                !form.description ||
                                !form.price
                            }
                            className="w-full gradient-bg text-white border-0 hover:opacity-90 mt-2"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Simpan Layanan
                        </Button>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    icon={ShoppingBag}
                    title="Total Layanan"
                    value={services.length.toString()}
                />
                <StatsCard
                    icon={Eye}
                    title="Layanan Aktif"
                    value={activeCount.toString()}
                />
                <StatsCard icon={Star} title="Rating Rata-rata" value="—" />
                <StatsCard icon={DollarSign} title="Pendapatan" value="—" />
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Layanan</DialogTitle>
                    </DialogHeader>
                    {renderFormFields()}
                    <Button
                        onClick={handleEdit}
                        disabled={
                            isSubmitting ||
                            !form.title ||
                            !form.description ||
                            !form.price
                        }
                        className="w-full gradient-bg text-white border-0 hover:opacity-90 mt-2"
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Perbarui Layanan
                    </Button>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Hapus Layanan?</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Layanan yang sudah dihapus tidak dapat dikembalikan. Apakah
                        Anda yakin ingin menghapus layanan ini?
                    </p>
                    <div className="flex gap-2 mt-4">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsDeleteOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            className="flex-1"
                            disabled={isSubmitting}
                            onClick={handleDelete}
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            Hapus
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Service List */}
            <div className="space-y-3">
                {services.length === 0 ? (
                    <div className="text-center py-12 border border-border/50 rounded-xl bg-card">
                        <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                        <h3 className="text-lg font-medium">Belum ada layanan</h3>
                        <p className="text-muted-foreground mt-2 mb-4 text-sm">
                            Anda belum menerbitkan layanan apa pun ke marketplace.
                        </p>
                        <Button
                            onClick={() => setIsCreateOpen(true)}
                            className="gap-2 gradient-bg text-white border-0"
                        >
                            <Plus className="h-4 w-4" /> Buat Layanan Pertama
                        </Button>
                    </div>
                ) : (
                    services.map((svc) => (
                        <Card
                            key={svc.id}
                            className="border-border/50 hover:shadow-md transition-all"
                        >
                            <CardContent className="p-4 md:p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="h-14 w-14 rounded-xl overflow-hidden gradient-bg flex items-center justify-center shrink-0 opacity-80">
                                        {svc.image ? (
                                            <img src={svc.image} alt={svc.title} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-lg font-bold text-white/30">
                                                {svc.title.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="font-semibold text-sm">
                                                    {svc.title}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-[10px]"
                                                    >
                                                        {svc.category?.name || "Tanpa Kategori"}
                                                    </Badge>
                                                    {svc.isOnSite && svc.location && (
                                                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                                            <MapPin className="h-2.5 w-2.5" />
                                                            {svc.location}
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                        {Number(
                                                            svc.rating || 0
                                                        ).toFixed(1)}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {svc.reviewCount || 0}{" "}
                                                        ulasan
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="font-bold text-sm gradient-text">
                                                    {formatCurrency(
                                                        Number(svc.price)
                                                    )}
                                                </p>
                                                <Badge
                                                    className={`text-xs mt-1 ${svc.isActive
                                                        ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                                                        }`}
                                                >
                                                    {svc.isActive
                                                        ? "Aktif"
                                                        : "Nonaktif"}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-xs gap-1 h-8"
                                                onClick={() => openEdit(svc)}
                                            >
                                                <Edit className="h-3 w-3" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-xs gap-1 h-8"
                                                onClick={() =>
                                                    toggleActive(svc.id)
                                                }
                                            >
                                                {svc.isActive ? (
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
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-xs gap-1 h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() =>
                                                    openDelete(svc.id)
                                                }
                                            >
                                                <Trash2 className="h-3 w-3" />
                                                Hapus
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
