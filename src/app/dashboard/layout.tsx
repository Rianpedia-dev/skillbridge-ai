"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";
import {
    LayoutDashboard,
    ShoppingBag,
    User,
    Briefcase,
    Settings,
    LogOut,
    Sparkles,
    ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const sidebarLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/orders", label: "Pesanan Saya", icon: ShoppingBag },
    { href: "/dashboard/services", label: "Layanan Saya", icon: Briefcase },
    { href: "/dashboard/profile", label: "Profil", icon: User },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 flex-col border-r border-border/50 bg-card">
                <div className="p-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Kembali ke Home
                    </Link>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-10 w-10 rounded-xl gradient-bg flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-sm">Dashboard</h2>
                            <p className="text-xs text-muted-foreground">SkillBridge AI</p>
                        </div>
                    </div>
                </div>

                <Separator />

                <nav className="flex-1 p-3 space-y-1">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "gradient-bg text-white"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                )}
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3">
                    <Separator className="mb-3" />
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground text-sm"
                        onClick={async () => {
                            await signOut({
                                fetchOptions: {
                                    onSuccess: () => {
                                        router.push("/");
                                    },
                                },
                            });
                        }}
                    >
                        <LogOut className="h-4 w-4" />
                        Keluar
                    </Button>
                </div>
            </aside>

            {/* Mobile nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50">
                <nav className="flex items-center justify-around py-2">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                <link.icon className="h-5 w-5" />
                                <span className="text-[10px] font-medium">{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Main content */}
            <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">{children}</main>
        </div>
    );
}
