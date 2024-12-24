import { format } from 'date-fns';
import RatingStars from './RatingStars';

interface Rating {
  id: string;
  rating: number;
  review: string | null;
  created_at: string;
  profiles: {
    full_name: string;
  };
}

interface RatingsListProps {
  ratings: Rating[];
}

export default function RatingsList({ ratings }: RatingsListProps) {
  if (ratings.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No ratings yet. Be the first to rate this provider!
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {ratings.map((rating) => (
        <div key={rating.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RatingStars rating={rating.rating} />
              <span className="font-medium">{rating.profiles.full_name}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {format(new Date(rating.created_at), 'MMM d, yyyy')}
            </span>
          </div>
          {rating.review && (
            <p className="text-sm text-muted-foreground">{rating.review}</p>
          )}
        </div>
      ))}
    </div>
  );
}