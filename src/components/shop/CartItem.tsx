import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/lib/utils';
import { CartItem as CartItemType } from '@/types/product';

interface CartItemProps {
  item: CartItemType & {
    product?: {
      name: string;
      price: number;
      images: string[];
    };
  };
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  if (!item.product) return null;

  return (
    <div className="flex gap-4">
      <div className="h-20 w-20 rounded-md overflow-hidden">
        <img
          src={item.product.images[0]}
          alt={item.product.name}
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="flex-1">
        <h4 className="font-medium">{item.product.name}</h4>
        <p className="text-sm text-muted-foreground">
          {formatCurrency(item.product.price)}
        </p>
        
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.productId, Math.max(0, item.quantity - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => removeFromCart(item.productId)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}