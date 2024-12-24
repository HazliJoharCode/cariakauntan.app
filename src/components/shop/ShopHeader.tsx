import { Search, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

interface ShopHeaderProps {
  onSearch: (query: string) => void;
}

export default function ShopHeader({ onSearch }: ShopHeaderProps) {
  const { totalItems, openCart } = useCart();

  return (
    <div className="sticky top-0 z-10 bg-background border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="Search products..."
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={openCart} className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-5 h-5 rounded-full text-xs flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}