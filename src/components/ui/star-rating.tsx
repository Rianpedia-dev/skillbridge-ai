"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: "sm" | "md" | "lg";
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
    className?: string;
}

const sizeMap = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
};

export function StarRating({
    rating,
    maxRating = 5,
    size = "md",
    interactive = false,
    onRatingChange,
    className,
}: StarRatingProps) {
    return (
        <div className={cn("flex items-center gap-0.5", className)}>
            {Array.from({ length: maxRating }, (_, i) => {
                const filled = i < Math.floor(rating);
                const halfFilled = !filled && i < rating;

                return (
                    <button
                        key={i}
                        type="button"
                        disabled={!interactive}
                        onClick={() => onRatingChange?.(i + 1)}
                        className={cn(
                            "transition-transform",
                            interactive && "hover:scale-110 cursor-pointer",
                            !interactive && "cursor-default"
                        )}
                    >
                        <Star
                            className={cn(
                                sizeMap[size],
                                filled && "fill-yellow-400 text-yellow-400",
                                halfFilled && "fill-yellow-400/50 text-yellow-400",
                                !filled && !halfFilled && "fill-muted text-muted-foreground/30"
                            )}
                        />
                    </button>
                );
            })}
        </div>
    );
}
