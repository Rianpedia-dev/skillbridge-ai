"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "@/lib/auth-client";
import {
    LayoutDashboard,
    ShoppingBag,
    User,
    Briefcase,
    Settings,
    LogOut,
    Sparkles,
    ChevronLeft,
    MessageSquare,
    Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const allSidebarLinks = [
    { href: "/admin", label: "Admin Panel", icon: Shield, adminOnly: true, adminVisible: true },
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard, adminOnly: false, adminVisible: true },
    { href: "/dashboard/orders", label: "Pesanan Saya", icon: ShoppingBag, adminOnly: false, adminVisible: false },
    { href: "/dashboard/services", label: "Layanan Saya", icon: Briefcase, adminOnly: false, adminVisible: false },
    { href: "/dashboard/chat", label: "Pesan", icon: MessageSquare, adminOnly: false, adminVisible: false },
    { href: "/dashboard/profile", label: "Profil", icon: User, adminOnly: false, adminVisible: true },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const isAdmin = session?.user?.role?.toLowerCase() === "admin";

    const sidebarLinks = allSidebarLinks.filter(link => {
        if (isAdmin) {
            return link.adminVisible;
        }
        return !link.adminOnly;
    });

    return (
        <div className="min-h-screen flex pt-0">
            {/* Sidebar - with top padding for fixed navbar */}
            <aside className="hidden md:flex w-64 flex-col border-r border-border/50 bg-card fixed top-16 bottom-0 left-0 z-30">
                <div className="p-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Kembali ke Home
                    </Link>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-10 w-10 flex items-center justify-center">
                            <img src="/lg.png" alt="SkillBridge Logo" className="h-full w-full object-contain" />
                        </div>
                        <div>
                            <h2 className="font-bold text-sm">Dashboard</h2>
                            <p className="text-xs text-muted-foreground">SkillBridge AI</p>
                        </div>
                    </div>
                </div>

                <Separator />

                <nav className="flex-1 p-3 space-y-1">
                    {sidebarLinks.map((link: typeof allSidebarLinks[number]) => {
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
                    {sidebarLinks.map((link: typeof allSidebarLinks[number]) => {
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

            {/* Main content - offset for fixed sidebar */}
            <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 md:ml-64">{children}</main>
        </div>
    );
}
