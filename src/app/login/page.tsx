"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");

        try {
            const { error } = await signIn.email({
                email,
                password,
            });

            if (error) {
                setErrorMsg(error.message || "Email atau password salah");
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err: any) {
            setErrorMsg(err.message || "Terjadi kesalahan saat login");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
            </div>

            <Card className="w-full max-w-md border-border/50">
                <CardHeader className="text-center pb-2">
                    <Link href="/" className="flex items-center justify-center gap-2 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                    </Link>
                    <CardTitle className="text-2xl font-bold">Selamat Datang Kembali</CardTitle>
                    <CardDescription>Masuk ke akun SkillBridge AI Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                        {errorMsg && (
                            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md text-center">
                                {errorMsg}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="nama@email.com"
                                    className="pl-9 h-11"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link href="#" className="text-xs text-primary hover:underline">
                                    Lupa password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-9 h-11"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 gradient-bg text-white border-0 gap-2 hover:opacity-90 mt-4"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    Masuk
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="relative pt-2">
                        <Separator />
                        <span className="absolute left-1/2 -translate-x-1/2 top-2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                            atau
                        </span>
                    </div>

                    {/* Google Login */}
                    <Button
                        variant="outline"
                        className="w-full gap-2 h-11 mt-2"
                        disabled={isLoading}
                        type="button"
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
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Masuk dengan Google
                    </Button>

                    <p className="text-center text-sm text-muted-foreground pt-2">
                        Belum punya akun?{" "}
                        <Link href="/register" className="text-primary font-medium hover:underline">
                            Daftar sekarang
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
