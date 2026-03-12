"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminRoute = pathname.startsWith("/admin");
    const isDashboardRoute = pathname.startsWith("/dashboard");
    const hideNavFooter = isAdminRoute || isDashboardRoute;

    return (
        <>
            {!hideNavFooter && <Navbar />}
            <main className={hideNavFooter ? "min-h-screen" : "min-h-screen pt-16"}>
                {children}
            </main>
            {!hideNavFooter && <Footer />}
        </>
    );
}
