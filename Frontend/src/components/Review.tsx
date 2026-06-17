import type { Review as ReviewProps, User } from "@/types/type";
import { BadgeCheck, Star } from "lucide-react";

type ReviewPropsData = { review: ReviewProps; user: User };

export const Review = ({ feedback }: { feedback: ReviewPropsData }) => {
  return (
    <div className="bg-background space-y-3 rounded-xl border p-4">
      {/* User Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="bg-primary/15 text-primary flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold">
            {feedback.user.name[0].toUpperCase()}
          </div>

          <div>
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium">{feedback.user.name}</p>
              {/* Verified Badge */}
              {feedback.user.emailVerified && (
                <BadgeCheck className="text-primary size-4" />
              )}
            </div>
            {/* Date */}
            <p className="text-muted-foreground text-xs">
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
        <p className="text-muted-foreground text-sm">
          {feedback.review.comment}
        </p>
      )}
    </div>
  );
};
