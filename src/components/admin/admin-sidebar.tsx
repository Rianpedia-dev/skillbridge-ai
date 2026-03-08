"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    Briefcase,
    Settings,
    ChevronLeft,
    LogOut,
    ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const menuItems = [
    {
        title: "Overview",
        icon: LayoutDashboard,
        href: "/admin",
    },
    {
        title: "Users",
        icon: Users,
        href: "/admin/users",
    },
    {
        title: "Services",
        icon: Briefcase,
        href: "/admin/services",
    },
    {
        title: "Orders",
        icon: ShoppingBag,
        href: "/admin/orders",
    },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen transition-all duration-300 border-r border-border bg-card/50 backdrop-blur-xl",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className="flex h-full flex-col gap-4 p-4">
                {/* Logo */}
                <div className="flex items-center gap-3 px-2 py-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-bg text-white shadow-lg">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <span className="text-lg font-bold gradient-text">Admin Panel</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">SkillBridge AI</span>
                        </div>
                    )}
                </div>

                <hr className="border-border/50" />

                {/* Menu */}
                <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar py-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <div
                                    className={cn(
                                        "group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 cursor-pointer",
                                        isActive
                                            ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                    )}
                                >
                                    <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                    {!isCollapsed && <span className="font-medium text-sm">{item.title}</span>}
                                    {!isCollapsed && isActive && (
                                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto space-y-2">
                    <hr className="border-border/50 mb-4" />

                    <Link href="/dashboard">
                        <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all cursor-pointer">
                            <ChevronLeft className="h-5 w-5 shrink-0" />
                            {!isCollapsed && <span className="font-medium text-sm">Kembali ke User App</span>}
                        </div>
                    </Link>

                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 rounded-xl px-3 py-6 text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-all font-medium"
                    >
                        <LogOut className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span className="text-sm">Logout</span>}
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="absolute -right-3 top-24 h-6 w-6 rounded-full border border-border bg-background shadow-md lg:flex hidden"
                    >
                        <ChevronLeft className={cn("h-3 w-3 transition-transform", isCollapsed && "rotate-180")} />
                    </Button>
                </div>
            </div>
        </aside>
    );
}
