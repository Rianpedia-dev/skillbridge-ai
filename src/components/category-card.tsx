import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

interface CategoryCardProps {
    href: string;
    icon: LucideIcon;
    name: string;
    count: number;
    gradient?: string;
}

export function CategoryCard({ href, icon: Icon, name, count, gradient }: CategoryCardProps) {
    return (
        <Link href={href}>
            <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 border-border/50 cursor-pointer">
                <CardContent className="p-6 text-center">
                    <div
                        className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110"
                        style={{ background: gradient || "linear-gradient(135deg, oklch(0.55 0.25 265), oklch(0.65 0.22 330))" }}
                    >
                        <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm">{name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{count} layanan</p>
                </CardContent>
            </Card>
        </Link>
    );
}
