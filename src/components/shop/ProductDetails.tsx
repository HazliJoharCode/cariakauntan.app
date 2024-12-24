import { useState } from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Minus, Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductDetailsProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetails({ product, isOpen, onClose }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!selectedVariant && product.variants?.length) {
      return; // Don't add if variant is required but not selected
    }
    addToCart(product.id, quantity, selectedVariant || undefined);
    onClose();
  };

  const currentVariant = product.variants?.find(v => v.id === selectedVariant);
  const price = currentVariant?.price || product.price;
  const stock = currentVariant?.stock ?? product.stock;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg">
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((image, i) => (
                <div key={i} className="aspect-square rounded-md overflow-hidden">
                  <img
                    src={image}
                    alt={`${product.name} view ${i + 2}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <p className="text-muted-foreground">{product.description}</p>

            <div>
              <p className="text-2xl font-bold">{formatCurrency(price)}</p>
              {stock > 0 ? (
                <p className="text-sm text-muted-foreground">
                  {stock} items in stock
                </p>
              ) : (
                <p className="text-sm text-destructive">Out of stock</p>
              )}
            </div>

            {product.variants?.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Size</label>
                <Select
                  value={selectedVariant || ''}
                  onValueChange={setSelectedVariant}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants.map((variant) => (
                      <SelectItem 
                        key={variant.id} 
                        value={variant.id}
                        disabled={variant.stock === 0}
                      >
                        {variant.attributes.size} - {variant.stock > 0 
                          ? `${variant.stock} in stock` 
                          : 'Out of stock'
                        }
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={stock === 0}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={stock === 0 || quantity >= stock}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={
                    stock === 0 || 
                    (product.variants?.length && !selectedVariant)
                  }
                >
                  {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>

              {product.variants?.length && !selectedVariant && (
                <p className="text-sm text-destructive" role="alert">
                  Please select a size
                </p>
              )}
            </div>

            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">Product Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span>{product.category}</span>
                </div>
                {product.variants?.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available Sizes</span>
                    <span>
                      {product.variants
                        .map(v => v.attributes.size)
                        .join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}