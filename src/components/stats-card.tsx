import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    icon: LucideIcon;
    title: string;
    value: string;
    trend?: string;
    trendUp?: boolean;
    className?: string;
}

export function StatsCard({ icon: Icon, title, value, trend, trendUp, className }: StatsCardProps) {
    return (
        <Card className={cn("border-border/50", className)}>
            <CardContent className="p-5">
                <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                    </div>
                    {trend && (
                        <span
                            className={cn(
                                "text-xs font-medium px-2 py-1 rounded-full",
                                trendUp
                                    ? "bg-green-500/10 text-green-500"
                                    : "bg-red-500/10 text-red-500"
                            )}
                        >
                            {trend}
                        </span>
                    )}
                </div>
                <div className="mt-3">
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{title}</p>
                </div>
            </CardContent>
        </Card>
    );
}
