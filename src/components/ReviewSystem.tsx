import { useState } from "react";
import { Star, ThumbsUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  helpful: number;
}

interface ReviewSystemProps {
  productId: string;
  productTitle: string;
}

const StarRating = ({ rating, size = 16, interactive = false, onChange }: { rating: number; size?: number; interactive?: boolean; onChange?: (r: number) => void }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        disabled={!interactive}
        onClick={() => onChange?.(star)}
        className={interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}
      >
        <Star
          style={{ width: size, height: size }}
          className={`${star <= rating ? "fill-amber-400 text-amber-400" : "fill-transparent text-border"} transition-colors`}
        />
      </button>
    ))}
  </div>
);

export const StarRatingDisplay = ({ rating, count, size = 14 }: { rating: number; count?: number; size?: number }) => (
  <div className="flex items-center gap-1.5">
    <StarRating rating={Math.round(rating)} size={size} />
    {count !== undefined && (
      <span className="text-xs text-muted-foreground">({count})</span>
    )}
  </div>
);

export const ReviewSystem = ({ productId, productTitle }: ReviewSystemProps) => {
  const [showForm, setShowForm] = useState(false);
  const [formRating, setFormRating] = useState(0);
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [formName, setFormName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // No fake reviews - empty state by default
  const reviews: Review[] = [];
  const avgRating = 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formRating === 0) return;
    // In production, this would POST to a review service or Shopify metafields
    setSubmitted(true);
    setShowForm(false);
    setFormRating(0);
    setFormTitle("");
    setFormBody("");
    setFormName("");
  };

  return (
    <div className="mt-12 border-t border-border pt-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Customer Reviews</h3>
          {reviews.length > 0 ? (
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={Math.round(avgRating)} size={18} />
              <span className="text-sm text-muted-foreground">
                {avgRating.toFixed(1)} out of 5 · {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-1">No reviews yet. Be the first to share your experience.</p>
          )}
        </div>
        <Button variant="outline" onClick={() => setShowForm(!showForm)}>
          Write a Review
        </Button>
      </div>

      {/* Submission confirmation */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-3"
          >
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
            <p className="text-sm text-foreground">Thank you for your review! It will be visible after moderation.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="overflow-hidden mb-8 p-6 rounded-xl bg-muted/50 border border-border space-y-4"
          >
            <h4 className="text-sm font-semibold text-foreground">Review: {productTitle}</h4>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Your Rating *</label>
              <StarRating rating={formRating} size={24} interactive onChange={setFormRating} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Your Name</label>
              <input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full text-sm rounded-lg border border-border bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="John D."
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Review Title</label>
              <input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full text-sm rounded-lg border border-border bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Summarize your experience"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Your Review</label>
              <textarea
                value={formBody}
                onChange={(e) => setFormBody(e.target.value)}
                rows={4}
                className="w-full text-sm rounded-lg border border-border bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                placeholder="Share your thoughts about this product..."
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={formRating === 0}>Submit Review</Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      {reviews.length === 0 && !showForm && (
        <div className="text-center py-12 text-muted-foreground">
          <Star className="h-10 w-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No reviews yet</p>
        </div>
      )}

      {reviews.map((review) => (
        <div key={review.id} className="py-5 border-b border-border/50 last:border-0">
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={review.rating} size={14} />
            {review.verified && (
              <span className="inline-flex items-center gap-1 text-[10px] text-primary font-medium">
                <CheckCircle2 className="h-3 w-3" /> Verified Purchase
              </span>
            )}
          </div>
          <h4 className="text-sm font-semibold text-foreground mb-1">{review.title}</h4>
          <p className="text-sm text-muted-foreground mb-2">{review.body}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{review.author}</span>
            <span>{review.date}</span>
            <button className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
              <ThumbsUp className="h-3 w-3" /> Helpful ({review.helpful})
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
