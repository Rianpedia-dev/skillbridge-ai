import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/star-rating";
import { MapPin } from "lucide-react";

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
    image,
}: ServiceCardProps) {
    return (
        <Link href={`/marketplace/${id}`}>
            <Card className="group overflow-hidden card-marketplace border-border/50 h-full">
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] overflow-hidden gradient-bg opacity-80">
                    {image ? (
                        <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl md:text-5xl font-bold text-white/20">{title.charAt(0)}</span>
                        </div>
                    )}
                    <Badge className="absolute top-2 left-2 bg-background/80 text-foreground backdrop-blur-sm text-[10px] md:text-xs border-0 px-1.5 py-0.5 md:px-2 md:py-0.5">
                        {category}
                    </Badge>
                    {(location || isOnSite) && (
                        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-background/80 text-foreground backdrop-blur-sm text-[9px] md:text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                            <MapPin className="h-2.5 w-2.5 md:h-3 md:w-3" />
                            <span className="truncate max-w-[80px]">
                                {isOnSite ? "Di Lokasi" : ""} {location && `${location}`}
                            </span>
                        </div>
                    )}
                </div>

                <CardContent className="p-2.5 md:p-4">
                    <h3 className="font-semibold text-xs md:text-sm line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                        {title}
                    </h3>

                    {/* Provider */}
                    <div className="flex items-center gap-1.5 mt-2">
                        <Avatar className="h-5 w-5 md:h-6 md:w-6">
                            <AvatarFallback className="text-[8px] md:text-[10px] gradient-bg text-white">
                                {providerInitials}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-[10px] md:text-xs text-muted-foreground truncate">{providerName}</span>
                    </div>

                    {/* Rating & Price */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                        <div className="flex items-center gap-1">
                            <StarRating rating={rating} size="sm" />
                            <span className="text-[10px] md:text-xs text-muted-foreground">({reviewCount})</span>
                        </div>
                    </div>
                    <div className="mt-1.5">
                        <p className="text-[10px] md:text-xs text-muted-foreground">Mulai dari</p>
                        <p className="text-xs md:text-sm font-bold text-primary">{price}</p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
