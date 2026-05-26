import { reviewSchema, type ReviewProps } from "@/types/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { api } from "@/utils/Axios";
import { useParams } from "react-router-dom";

export const ReviewForm = () => {
  const [rating, setRating] = useState(0);

  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReviewProps>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const onSubmit = async (data: ReviewProps) => {
    try {
      await api.post(
        `/review/${id}`,
        { ...data, rating },
        { withCredentials: true },
      );
      reset();
      setRating(0);

      toast.success("Thanks for sharing your experience");
    } catch (error) {
      toast.error("Please try again");
    }
  };

  return (
    <div className="rounded-xl border bg-background p-6">
      <div className="mb-6">
        <h2 className="text-xl font-medium tracking-tight text-foreground">
          Share your experience
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tell others what you think about this product.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <input type="hidden" {...register("rating", { valueAsNumber: true })} />

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Give rating</p>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className="rounded-md p-1 transition hover:bg-muted"
                onClick={() => {
                  setRating(value);
                  setValue("rating", value, { shouldValidate: true });
                }}
              >
                <Star
                  className={`size-5 ${
                    value <= rating
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>

          {errors.rating && (
            <p className="text-xs text-primary">{errors.rating.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Comment</p>

          <Textarea
            placeholder="Write your review..."
            className="min-h-28 resize-none"
            {...register("comment")}
          />

          {errors.comment && (
            <p className="text-xs text-primary">{errors.comment.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white hover:bg-primary/90"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </form>
    </div>
  );
};
