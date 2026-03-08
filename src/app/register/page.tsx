"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Mail, Lock, User, ArrowRight, Briefcase, UserCheck, Loader2 } from "lucide-react";
import { signUp, signIn } from "@/lib/auth-client";

export default function RegisterPage() {
    const router = useRouter();
    const [agreed, setAgreed] = useState(false);
    const [role, setRole] = useState<"customer" | "freelancer">("customer");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Form states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [skill, setSkill] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agreed) {
            setErrorMsg("Anda harus menyetujui Syarat & Ketentuan");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMsg("Password dan Konfirmasi Password tidak cocok");
            return;
        }

        if (password.length < 8) {
            setErrorMsg("Password minimal 8 karakter");
            return;
        }

        setIsLoading(true);
        setErrorMsg("");

        try {
            const { error } = await signUp.email({
                email,
                password,
                name,
                role: role // Built-in Better Auth custom field
            });

            if (error) {
                setErrorMsg(error.message || "Terjadi kesalahan saat pendaftaran");
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err: any) {
            setErrorMsg(err.message || "Terjadi kesalahan sistem saat pendaftaran");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute bottom-20 left-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
            </div>

            <Card className="w-full max-w-md border-border/50">
                <CardHeader className="text-center pb-2">
                    <Link href="/" className="flex items-center justify-center gap-2 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                    </Link>
                    <CardTitle className="text-2xl font-bold">Buat Akun Baru</CardTitle>
                    <CardDescription>Bergabung dengan SkillBridge AI</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Google Register */}
                    <Button
                        variant="outline"
                        className="w-full gap-2 h-11"
                        type="button"
                        disabled={isLoading}
                        onClick={async () => {
                            setIsLoading(true);
                            try {
                                await signIn.social({
                                    provider: "google",
                                    callbackURL: "/dashboard"
                                });
                            } catch (err) {
                                console.error(err);
                                setIsLoading(false);
                            }
                        }}
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Daftar dengan Google
                    </Button>

                    <div className="relative">
                        <Separator />
                        <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                            atau
                        </span>
                    </div>

                    {/* Role Tabs */}
                    {errorMsg && (
                        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md text-center mb-4">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Tabs defaultValue="customer" className="w-full" onValueChange={(v) => {
                            setRole(v as "customer" | "freelancer");
                            setErrorMsg("");
                        }}>
                            <TabsList className="grid grid-cols-2 w-full">
                                <TabsTrigger value="customer" className="gap-2 text-xs">
                                    <UserCheck className="h-3.5 w-3.5" />
                                    Customer
                                </TabsTrigger>
                                <TabsTrigger value="freelancer" className="gap-2 text-xs">
                                    <Briefcase className="h-3.5 w-3.5" />
                                    Service Provider
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="customer" className="space-y-3 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name-c">Nama Lengkap</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="name-c" placeholder="Nama lengkap Anda" className="pl-9 h-11" value={name} onChange={e => setName(e.target.value)} disabled={isLoading} required={role === "customer"} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email-c">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="email-c" type="email" placeholder="nama@email.com" className="pl-9 h-11" value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} required={role === "customer"} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password-c">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="password-c" type="password" placeholder="Min. 8 karakter" className="pl-9 h-11" value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading} required={role === "customer"} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-c">Konfirmasi Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="confirm-c" type="password" placeholder="Ulangi password" className="pl-9 h-11" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} disabled={isLoading} required={role === "customer"} />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="freelancer" className="space-y-3 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name-p">Nama Lengkap</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="name-p" placeholder="Nama lengkap Anda" className="pl-9 h-11" value={name} onChange={e => setName(e.target.value)} disabled={isLoading} required={role === "freelancer"} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email-p">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="email-p" type="email" placeholder="nama@email.com" className="pl-9 h-11" value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} required={role === "freelancer"} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="skill-p">Keahlian Utama</Label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="skill-p" placeholder="Contoh: Web Developer" className="pl-9 h-11" value={skill} onChange={e => setSkill(e.target.value)} disabled={isLoading} required={role === "freelancer"} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password-p">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="password-p" type="password" placeholder="Min. 8 karakter" className="pl-9 h-11" value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading} required={role === "freelancer"} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-p">Konfirmasi Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="confirm-p" type="password" placeholder="Ulangi password" className="pl-9 h-11" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} disabled={isLoading} required={role === "freelancer"} />
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>

                        {/* Terms */}
                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-1 rounded border-border accent-primary"
                            />
                            <Label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                                Saya menyetujui{" "}
                                <Link href="#" className="text-primary hover:underline">Syarat & Ketentuan</Link>{" "}
                                dan{" "}
                                <Link href="#" className="text-primary hover:underline">Kebijakan Privasi</Link>
                            </Label>
                        </div>

                        <Button type="submit" disabled={isLoading || !agreed} className="w-full h-11 gradient-bg text-white border-0 gap-2 hover:opacity-90 mt-4">
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Daftar Akun <ArrowRight className="h-4 w-4" /></>}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="text-primary font-medium hover:underline">
                            Masuk
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
