import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Background Decorations */}
            <div className="fixed -top-[40%] -left-[20%] w-[70%] h-[70%] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="fixed -bottom-[40%] -right-[20%] w-[70%] h-[70%] bg-accent/5 rounded-full blur-[120px] pointer-events-none -z-10" />

            <div className="flex">
                <AdminSidebar />
                <main className="flex-1 lg:ml-64 md:ml-20">
                    <div className="container mx-auto p-4 md:p-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
