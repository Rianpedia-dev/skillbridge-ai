import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/star-rating";

interface ServiceCardProps {
    id: string;
    title: string;
    description: string;
    price: string;
    category: string;
    rating: number;
    reviewCount: number;
    providerName: string;
    providerInitials: string;
    image?: string;
    location?: string;
    isOnSite?: boolean;
}

export function ServiceCard({
    id,
    title,
    description,
    price,
    category,
    rating,
    reviewCount,
    providerName,
    providerInitials,
    location,
    isOnSite,
}: ServiceCardProps) {
    return (
        <Link href={`/marketplace/${id}`}>
            <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 border-border/50">
                {/* Thumbnail placeholder */}
                <div className="relative h-44 overflow-hidden gradient-bg opacity-80">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white/20">{title.charAt(0)}</span>
                    </div>
                    <Badge className="absolute top-3 left-3 bg-background/80 text-foreground backdrop-blur-sm text-xs border-0">
                        {category}
                    </Badge>
                    {(location || isOnSite) && (
                        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-background/80 text-foreground backdrop-blur-sm text-[10px] font-medium px-2 py-1 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                            {isOnSite ? "Di Lokasi" : ""} {location && `• ${location}`}
                        </div>
                    )}
                </div>

                <CardContent className="p-4">
                    <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {description}
                    </p>

                    {/* Provider */}
                    <div className="flex items-center gap-2 mt-3">
                        <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-[10px] gradient-bg text-white">
                                {providerInitials}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{providerName}</span>
                    </div>

                    {/* Rating & Price */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                        <div className="flex items-center gap-1.5">
                            <StarRating rating={rating} size="sm" />
                            <span className="text-xs text-muted-foreground">({reviewCount})</span>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground">Mulai dari</p>
                            <p className="text-sm font-bold text-primary">{price}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
