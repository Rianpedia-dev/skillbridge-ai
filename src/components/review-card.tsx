import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/star-rating";

interface ReviewCardProps {
    name: string;
    initials: string;
    rating: number;
    date: string;
    text: string;
    role?: string;
}

export function ReviewCard({ name, initials, rating, date, text, role }: ReviewCardProps) {
    return (
        <Card className="border-border/50 transition-all duration-300 hover:shadow-md">
            <CardContent className="p-5">
                <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="gradient-bg text-white text-sm">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-sm">{name}</h4>
                                {role && <p className="text-xs text-muted-foreground">{role}</p>}
                            </div>
                            <span className="text-xs text-muted-foreground">{date}</span>
                        </div>
                        <StarRating rating={rating} size="sm" className="mt-1" />
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{text}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
