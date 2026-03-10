"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Loader2,
    Upload,
    Trash2,
    ImageIcon,
    Plus,
    Save,
    ExternalLink,
} from "lucide-react";
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

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [deleteKey, setDeleteKey] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    async function fetchSettings() {
        try {
            setIsLoading(true);
            const res = await fetch("/api/admin/settings");
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleUploadImage(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsSaving(true);
        try {
            // Upload file first
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) {
                throw new Error("Upload failed");
            }

            const { url } = await uploadRes.json();

            // Get next hero image number
            const heroImages = settings.filter(s => s.key.startsWith("hero_image_"));
            const nextNum = heroImages.length + 1;
            const key = `hero_image_${nextNum}`;

            // Save setting
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key,
                    value: url,
                    label: `Header Image ${nextNum}`,
                    type: "image",
                }),
            });

            if (res.ok) {
                await fetchSettings();
            }
        } catch (error) {
            console.error("Failed to upload image:", error);
        } finally {
            setIsSaving(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }

    async function handleDeleteSetting() {
        if (!deleteKey) return;
        setIsSaving(true);
        try {
            const res = await fetch(`/api/admin/settings?key=${encodeURIComponent(deleteKey)}`, {
                method: "DELETE",
            });
            if (res.ok) {
                await fetchSettings();
                setDeleteKey(null);
            }
        } catch (error) {
            console.error("Failed to delete setting:", error);
        } finally {
            setIsSaving(false);
        }
    }

    const heroImages = settings.filter(s => s.type === "image" && s.key.startsWith("hero_image_"));

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Pengaturan Situs</h1>
                <p className="text-muted-foreground mt-2">
                    Kelola gambar header dan konfigurasi tampilan website.
                </p>
            </div>

            {/* Header Images Section */}
            <Card className="border-border/50 shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <ImageIcon className="h-5 w-5 text-primary" />
                            Header Images
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Gambar yang ditampilkan di bagian hero/banner halaman utama.
                        </p>
                    </div>
                    <div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleUploadImage}
                        />
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isSaving}
                            className="gradient-bg text-white gap-2"
                        >
                            {isSaving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Plus className="h-4 w-4" />
                            )}
                            Upload Image
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {heroImages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                <ImageIcon className="h-8 w-8 text-primary" />
                            </div>
                            <p className="text-muted-foreground text-sm">
                                Belum ada header image. Klik tombol upload untuk menambahkan.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {heroImages.map((img) => (
                                <div key={img.id} className="group relative rounded-xl overflow-hidden border border-border/50 bg-card">
                                    <div className="aspect-video relative">
                                        <img
                                            src={img.value}
                                            alt={img.label || "Header Image"}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                            <a href={img.value} target="_blank" rel="noopener noreferrer">
                                                <Button size="icon" variant="secondary" className="h-8 w-8">
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </a>
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                className="h-8 w-8"
                                                onClick={() => setDeleteKey(img.key)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium">{img.label}</span>
                                            <Badge variant="secondary" className="text-[10px]">
                                                {img.key}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteKey} onOpenChange={(open: boolean) => !open && setDeleteKey(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Header Image?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus gambar header ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteSetting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
