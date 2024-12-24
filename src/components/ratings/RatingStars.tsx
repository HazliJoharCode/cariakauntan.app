import { Star, StarHalf } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function RatingStars({ rating, size = 'md' }: RatingStarsProps) {
  const sizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const iconSize = sizes[size];

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className={`${iconSize} fill-primary text-primary`} />
      ))}
      {hasHalfStar && (
        <StarHalf className={`${iconSize} fill-primary text-primary`} />
      )}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => (
        <Star key={`empty-${i}`} className={`${iconSize} text-muted-foreground`} />
      ))}
    </div>
  );
}