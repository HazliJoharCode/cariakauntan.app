import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types/product';

interface CartStore {
  items: CartItem[];
  totalItems: number;
  addToCart: (productId: string, quantity: number, variantId?: string) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      isCartOpen: false,

      addToCart: (productId, quantity, variantId) => {
        const items = [...get().items];
        const existingItem = items.find(
          item => item.productId === productId && item.variantId === variantId
        );

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          items.push({ productId, variantId, quantity, price: 0 }); // Price will be updated from product data
        }

        set({ 
          items,
          totalItems: items.reduce((total, item) => total + item.quantity, 0)
        });
      },

      removeFromCart: (productId, variantId) => {
        const items = get().items.filter(
          item => !(item.productId === productId && item.variantId === variantId)
        );
        
        set({ 
          items,
          totalItems: items.reduce((total, item) => total + item.quantity, 0)
        });
      },

      updateQuantity: (productId, quantity, variantId) => {
        const items = get().items.map(item => {
          if (item.productId === productId && item.variantId === variantId) {
            return { ...item, quantity };
          }
          return item;
        });

        set({ 
          items,
          totalItems: items.reduce((total, item) => total + item.quantity, 0)
        });
      },

      clearCart: () => set({ items: [], totalItems: 0 }),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
    }),
    {
      name: 'cart-storage',
    }
  )
);