import { useState } from 'react';
import ShopHeader from '@/components/shop/ShopHeader';
import ProductGrid from '@/components/shop/ProductGrid';
import CartDrawer from '@/components/shop/CartDrawer';
import CategoryFilter from '@/components/shop/CategoryFilter';
import ProductDetails from '@/components/shop/ProductDetails';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types/product';

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { products, loading } = useProducts();

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product =>
    (selectedCategory === null || product.category === selectedCategory) &&
    (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader onSearch={setSearchQuery} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <ProductGrid 
            products={filteredProducts}
            onProductClick={setSelectedProduct}
          />
        )}
      </main>

      <CartDrawer />
      
      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          isOpen={true}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}