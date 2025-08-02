import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Subscription {
  subscribed: boolean;
  tier?: string;
  subscription_end?: string;
  ends_at?: string;
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        setSubscription({ subscribed: false });
      } else {
        setSubscription(data);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscription({ subscribed: false });
    } finally {
      setIsLoading(false);
    }
  };

  const createCheckout = async (tier: 'basic' | 'premium' | 'enterprise') => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { tier }
      });
      
      if (error) {
        // Handle case when Stripe is not configured
        if (error.message.includes('STRIPE_SECRET_KEY')) {
          throw new Error('Payment system is not configured yet. Please contact support.');
        }
        throw error;
      }
      
      if (data?.url) {
        // Open in new tab for security
        window.open(data.url, '_blank');
      } else {
        throw new Error('Payment system is currently unavailable. Please try again later.');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      throw error;
    }
  };

  const openCustomerPortal = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      throw error;
    }
  };

  return {
    subscription,
    isLoading,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
  };
};