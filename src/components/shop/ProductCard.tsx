import { Product } from '@/types/product';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/lib/utils';
import { ImageOff } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onProductClick?: (product: Product) => void;
}

export default function ProductCard({ product, onProductClick }: ProductCardProps) {
  const { addToCart } = useCart();

  const hasVariants = product.variants && product.variants.length > 0;
  const totalStock = hasVariants
    ? product.variants.reduce((sum, v) => sum + v.stock, 0)
    : product.stock;

  return (
    <Card className="group overflow-hidden cursor-pointer" onClick={() => onProductClick?.(product)}>
      <CardHeader className="p-0">
        <div className="aspect-square overflow-hidden bg-muted">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <ImageOff className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground truncate">{product.description}</p>
        <p className="mt-2 font-bold">{formatCurrency(product.price)}</p>
        {hasVariants && (
          <p className="text-sm text-muted-foreground mt-1">
            {product.variants.length} sizes available
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          variant={hasVariants ? "outline" : "default"}
          onClick={(e) => {
            e.stopPropagation();
            if (!hasVariants) {
              addToCart(product.id, 1);
            } else {
              onProductClick?.(product);
            }
          }}
          disabled={totalStock === 0}
        >
          {totalStock === 0 ? 'Out of Stock' : hasVariants ? 'Select Options' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}