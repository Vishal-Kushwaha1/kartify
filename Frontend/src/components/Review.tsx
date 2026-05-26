import type { Review as ReviewProps, User } from "@/types/type";
import { BadgeCheck, Star } from "lucide-react";

type ReviewPropsData = { review: ReviewProps; user: User };

export const Review = ({ feedback }: { feedback: ReviewPropsData }) => {
  return (
    <div className="rounded-xl border bg-background p-4 space-y-3">
      {/* User Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="h-9 w-9 rounded-full bg-primary/15 text-primary flex items-center justify-center font-semibold text-sm">
            {feedback.user.name[0].toUpperCase()}
          </div>

          <div>
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium">{feedback.user.name}</p>
              {/* Verified Badge */}
              {feedback.user.emailVerified && (
                <BadgeCheck className="size-4 text-primary" />
              )}
            </div>
            {/* Date */}
            <p className="text-xs text-muted-foreground">
              {new Date(feedback.review.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Stars */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`size-4 ${
              star <= feedback.review.rating
                ? "fill-primary text-primary"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>

      {/* Comment */}
      {feedback.review.comment && (
        <p className="text-sm text-muted-foreground">
          {feedback.review.comment}
        </p>
      )}
    </div>
  );
};
