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
        <Link href={href} className="flex flex-col items-center gap-1.5 group">
            <div
                className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-2xl transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg"
                style={{ background: gradient || "linear-gradient(135deg, oklch(0.55 0.25 265), oklch(0.65 0.22 330))" }}
            >
                <Icon className="h-6 w-6 md:h-7 md:w-7 text-white" />
            </div>
            <div className="text-center">
                <p className="font-medium text-[11px] md:text-xs leading-tight">{name}</p>
                <p className="text-[10px] text-muted-foreground">{count} layanan</p>
            </div>
        </Link>
    );
}
