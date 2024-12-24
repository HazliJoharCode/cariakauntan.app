import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
export const stripe = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export async function createPaymentSession(orderId: string, amount: number) {
  try {
    const response = await fetch('/api/create-payment-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId, amount }),
    });

    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Error creating payment session:', error);
    throw error;
  }
}