"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    User,
    Mail,
    MapPin,
    Phone,
    Briefcase,
    Globe,
    Save,
    Camera,
    Loader2
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import imageCompression from "browser-image-compression";

export default function ProfilePage() {
    const { data: session, isPending } = useSession();

    // States
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Form States
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [website, setWebsite] = useState("");
    const [title, setTitle] = useState("");
    const [bio, setBio] = useState("");
    const [skills, setSkills] = useState("");

    const isFreelancer = session?.user?.role === "freelancer";
    const userName = session?.user?.name || "";
    const userEmail = session?.user?.email || "";
    const userImage = session?.user?.image || "";

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (session) {
            const nameParts = userName.split(" ");
            setFirstName(nameParts[0] || "");
            setLastName(nameParts.slice(1).join(" ") || "");
            setImagePreview(userImage || null);

            // Only fetch freelancer profile if role is freelancer
            if (isFreelancer) {
                fetchFreelancerProfile();
            } else {
                setIsLoading(false);
            }
        }
    }, [session]);

    const fetchFreelancerProfile = async () => {
        try {
            const res = await fetch("/api/freelancer/profile");
            if (res.ok) {
                const data = await res.json();
                if (data.profile) {
                    setTitle(data.profile.title || "");
                    setBio(data.profile.bio || "");
                    setLocation(data.profile.location || "");
                    if (data.profile.portfolioUrls && data.profile.portfolioUrls.length > 0) {
                        setWebsite(data.profile.portfolioUrls[0]);
                    }
                    setSkills(data.profile.skills ? data.profile.skills.join(", ") : "");
                    // Basic user data isn"t in profile API right now, usually we merge it.
                }
            }
        } catch (error) {
            console.error("Failed to fetch freelancer profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage({ type: "", text: "" });

        try {
            let imageUrl = userImage;

            // Handle image upload if a new file is selected
            if (imageFile) {
                let fileToUpload = imageFile;

                if (imageFile.size > 5 * 1024 * 1024) {
                    setMessage({ type: "success", text: "Mengkompresi gambar..." });
                    try {
                        const options = {
                            maxSizeMB: 2.5,
                            maxWidthOrHeight: 1920,
                            useWebWorker: true,
                        };
                        fileToUpload = await imageCompression(imageFile, options);
                    } catch (error) {
                        console.error("Compression error:", error);
                        setMessage({ type: "error", text: "Gagal mengkompresi gambar." });
                        setIsSaving(false);
                        return;
                    }
                }

                const formData = new FormData();
                formData.append("file", fileToUpload);
                formData.append("folder", "avatars");

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    imageUrl = uploadData.url;
                } else {
                    const errorData = await uploadRes.json();
                    setMessage({ type: "error", text: errorData.error || "Gagal mengunggah gambar profil" });
                    setIsSaving(false);
                    return;
                }
            }

            // Update base user info (name, image)
            const fullName = `${firstName} ${lastName}`.trim();
            const userUpdateRes = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: fullName || undefined,
                    image: imageUrl !== userImage ? imageUrl : undefined
                })
            });

            if (!userUpdateRes.ok) {
                throw new Error("Gagal memperbarui profil pengguna");
            }

            if (isFreelancer) {
                const skillArray = skills.split(",").map(s => s.trim()).filter(Boolean);

                const res = await fetch("/api/freelancer/profile", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: title || "Freelancer Independen", // Fallback if empty to avoid 400
                        bio,
                        location,
                        portfolioUrls: website ? [website] : [],
                        skills: skillArray,
                        hourlyRate: 0
                    })
                });

                if (!res.ok) throw new Error("Failed to update profile");
            }

            setMessage({ type: "success", text: "Profil berhasil diperbarui. Halaman akan dimuat ulang..." });

            // Reload page to refresh session state across app
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error) {
            setMessage({ type: "error", text: "Terjadi kesalahan saat menyimpan." });
        } finally {
            setIsSaving(false);

            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage({ type: "", text: "" });
            }, 3000);
        }
    };

    if (isPending || isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const initial = userName ? userName.substring(0, 2).toUpperCase() : "U";

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">
                    <span className="gradient-text">Edit</span> Profil
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Kelola informasi profil Anda.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left: Avatar & basic info */}
                <Card className="border-border/50 lg:col-span-1">
                    <CardContent className="p-6 text-center">
                        <div className="relative inline-block group">
                            <Avatar className="h-24 w-24 mx-auto overflow-hidden">
                                {imagePreview ? (
                                    <img src={imagePreview} alt={userName} className="h-full w-full object-cover" />
                                ) : (
                                    <AvatarFallback className="gradient-bg text-white text-2xl">{initial}</AvatarFallback>
                                )}
                            </Avatar>
                            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 h-8 w-8 rounded-full gradient-bg flex items-center justify-center border-2 border-background cursor-pointer hover:opacity-90 transition-opacity">
                                <Camera className="h-3.5 w-3.5 text-white" />
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setImageFile(file);
                                            setImagePreview(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <h3 className="font-semibold mt-4">{userName || "User"}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{session?.user?.role || "Customer"}</p>
                        <Badge variant="secondary" className="mt-2">
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5" />
                            Terverifikasi
                        </Badge>

                        <Separator className="my-4" />

                        <div className="space-y-3 text-left text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                {userEmail}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                {location || "Belum diatur"}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                {phone || "Belum diatur"}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Edit form */}
                <div className="lg:col-span-2 space-y-4">
                    {message.text && (
                        <div className={`p-3 rounded-md text-sm ${message.type === "success" ? "bg-green-500/15 text-green-600" : "bg-destructive/15 text-destructive"}`}>
                            {message.text}
                        </div>
                    )}

                    <Card className="border-border/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Informasi Dasar</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Nama Depan</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} className="pl-9" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Nama Belakang</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} className="pl-9" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="email" value={userEmail} disabled className="pl-9 bg-muted/50" />
                                </div>
                                <p className="text-[11px] text-muted-foreground">Email default tidak bisa diubah langsung.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Nomor Telepon</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+62 812-xxxx-xxxx" className="pl-9" />
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="location">Lokasi</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Jakarta, Indonesia" className="pl-9" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="website" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://" className="pl-9" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {isFreelancer && (
                        <Card className="border-border/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Bio & Keahlian</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Gelar Profesional / Headline</Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="Contoh: Senior UI/UX Designer"
                                        className="mb-2"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        value={bio}
                                        onChange={e => setBio(e.target.value)}
                                        placeholder="Ceritakan sedikit tentang pengalaman dan layanan Anda..."
                                        className="min-h-24 resize-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="skills">Keahlian Utama</Label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="skills"
                                            value={skills}
                                            onChange={e => setSkills(e.target.value)}
                                            placeholder="Contoh: Design, Programming, Video Editing"
                                            className="pl-9"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Pisahkan dengan koma</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex justify-end">
                        <Button
                            className="gap-2 gradient-bg text-white border-0 hover:opacity-90"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Simpan Perubahan
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
