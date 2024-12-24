import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/product';
import { toast } from '@/hooks/use-toast';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      // First get all published products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          stock,
          category:categories(name)
        `)
        .eq('status', 'published');

      if (productsError) throw productsError;

      // Then get all product images
      const productIds = productsData?.map(p => p.id) || [];
      const { data: imagesData, error: imagesError } = await supabase
        .from('product_images')
        .select('*')
        .in('product_id', productIds)
        .order('position');

      if (imagesError) throw imagesError;

      // Combine products with their images
      const productsWithImages = productsData?.map(product => ({
        ...product,
        category: product.category?.name || 'Uncategorized',
        images: imagesData
          .filter(img => img.product_id === product.id)
          .map(img => img.url),
        createdAt: new Date().toISOString(), // Add required fields
        updatedAt: new Date().toISOString(),
      })) || [];

      setProducts(productsWithImages);
    } catch (error: any) {
      console.error('Error loading products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return {
    products,
    loading,
    loadProducts,
  };
}