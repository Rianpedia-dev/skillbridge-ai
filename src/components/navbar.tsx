"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
    Menu,
    Sparkles,
    Search,
    Calculator,
    LayoutDashboard,
    LogIn,
    UserPlus,
    LogOut,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const navLinks = [
    { href: "/marketplace", label: "Marketplace", icon: Search },
    { href: "/ai-matching", label: "AI Matching", icon: Sparkles },
    { href: "/price-estimator", label: "Price Estimator", icon: Calculator },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { data: session, isPending } = useSession();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                    setIsOpen(false);
                },
            },
        });
    };

    return (
        <header className="sticky top-0 z-50 w-full glass">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-xl gradient-bg transition-transform group-hover:scale-110">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold gradient-text hidden sm:inline-block">
                        SkillBridge
                    </span>
                    <span className="text-xl font-bold text-foreground hidden sm:inline-block">
                        AI
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
                        >
                            <link.icon className="h-4 w-4" />
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-2">
                    {mounted && !isPending && session ? (
                        <>
                            <Link href="/dashboard">
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </Button>
                            </Link>
                            <Button variant="outline" size="sm" className="gap-2" onClick={handleLogout}>
                                <LogOut className="h-4 w-4" />
                                Keluar
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <LogIn className="h-4 w-4" />
                                    Masuk
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm" className="gap-2 gradient-bg text-white border-0 hover:opacity-90">
                                    <UserPlus className="h-4 w-4" />
                                    Daftar
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger
                        render={<Button variant="ghost" size="icon" className="md:hidden" />}
                    >
                        <Menu className="h-5 w-5" />
                    </SheetTrigger>
                    <SheetContent side="right" className="w-72">
                        <SheetTitle className="flex items-center gap-2 mb-6">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-bold gradient-text">SkillBridge AI</span>
                        </SheetTitle>
                        <nav className="flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
                                >
                                    <link.icon className="h-5 w-5" />
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="mt-6 flex flex-col gap-2">
                            {mounted && !isPending && session ? (
                                <>
                                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full gap-2 justify-start">
                                            <LayoutDashboard className="h-4 w-4" />
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" className="w-full gap-2 justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
                                        <LogOut className="h-4 w-4" />
                                        Keluar
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full gap-2">
                                            <LogIn className="h-4 w-4" />
                                            Masuk
                                        </Button>
                                    </Link>
                                    <Link href="/register" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full gap-2 gradient-bg text-white border-0">
                                            <UserPlus className="h-4 w-4" />
                                            Daftar
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
