import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Elements } from '@stripe/stripe-react-js';
import { stripe } from '@/lib/stripe';
import { useCart } from '@/hooks/useCart';
import CheckoutForm from './CheckoutForm';
import PaymentForm from './PaymentForm';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutDialog({ isOpen, onClose }: CheckoutDialogProps) {
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [orderId, setOrderId] = useState<string | null>(null);
  const { items, total, clearCart } = useCart();

  const handleCheckoutSubmit = async (values: any) => {
    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          total_amount: total,
          shipping_address: values.address,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(
          items.map(item => ({
            order_id: order.id,
            product_id: item.productId,
            variant_id: item.variantId,
            quantity: item.quantity,
            price_at_time: item.price
          }))
        );

      if (itemsError) throw itemsError;

      // Create payment session
      const session = await createPaymentSession(order.id, total);
      setOrderId(order.id);
      setStep('payment');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create order. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    onClose();
    toast({
      title: 'Success',
      description: 'Your order has been placed successfully!',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogTitle>
          {step === 'details' ? 'Checkout Details' : 'Payment'}
        </DialogTitle>
        
        {step === 'details' ? (
          <CheckoutForm onSubmit={handleCheckoutSubmit} total={total} />
        ) : (
          <Elements stripe={stripe}>
            <PaymentForm 
              orderId={orderId!} 
              onSuccess={handlePaymentSuccess} 
            />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  );
}