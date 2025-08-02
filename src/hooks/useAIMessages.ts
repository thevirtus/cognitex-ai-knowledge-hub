import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAIMessages = () => {
  const [messagesUsed, setMessagesUsed] = useState(0);
  const [canUseAI, setCanUseAI] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAIUsage();
    checkOwnerStatus();
  }, []);

  const checkOwnerStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        const { data, error } = await supabase
          .from('owner_privileges')
          .select('*')
          .eq('email', user.email)
          .maybeSingle();
        
        if (!error && data) {
          setIsOwner(true);
          setCanUseAI(true);
          return;
        }
      }
      setIsOwner(false);
    } catch (error) {
      console.error('Error checking owner status:', error);
    }
  };

  const checkAIUsage = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check subscription to determine limits
      const { data: subscriptionData } = await supabase.functions.invoke('check-subscription');
      let dailyLimit = 2; // Free tier default

      if (subscriptionData?.subscribed) {
        // Set limits based on subscription tier
        if (subscriptionData.subscription_tier === 'Basic') {
          dailyLimit = 50;
        } else if (subscriptionData.subscription_tier === 'Premium') {
          dailyLimit = 100;
        } else if (subscriptionData.subscription_tier === 'Enterprise') {
          dailyLimit = 1000;
        } else {
          dailyLimit = 50; // Default for any unknown tier
        }
      }

      const { data, error } = await supabase
        .from('ai_message_usage')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        // Check if reset date has passed
        const resetDate = new Date(data.reset_date);
        const now = new Date();
        
        if (resetDate <= now) {
          // Reset the counter
          await supabase
            .from('ai_message_usage')
            .update({
              messages_used: 0,
              reset_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            })
            .eq('user_id', user.id);
          setMessagesUsed(0);
          setCanUseAI(true);
        } else {
          setMessagesUsed(data.messages_used);
          setCanUseAI(data.messages_used < dailyLimit);
        }
      } else {
        // Create initial record
        await supabase
          .from('ai_message_usage')
          .insert({
            user_id: user.id,
            messages_used: 0,
            reset_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          });
        setMessagesUsed(0);
        setCanUseAI(true);
      }
    } catch (error) {
      console.error('Error checking AI usage:', error);
      setCanUseAI(false);
    }
  };

  const incrementMessageCount = async () => {
    if (isOwner) return true; // Owners have unlimited access

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Check subscription to determine limits
      const { data: subscriptionData } = await supabase.functions.invoke('check-subscription');
      let dailyLimit = 2; // Free tier default

      if (subscriptionData?.subscribed) {
        if (subscriptionData.subscription_tier === 'Basic') {
          dailyLimit = 50;
        } else if (subscriptionData.subscription_tier === 'Premium') {
          dailyLimit = 100;
        } else if (subscriptionData.subscription_tier === 'Enterprise') {
          dailyLimit = 1000;
        } else {
          dailyLimit = 50; // Default for any unknown tier
        }
      }

      const newCount = messagesUsed + 1;
      
      await supabase
        .from('ai_message_usage')
        .upsert({
          user_id: user.id,
          messages_used: newCount,
          reset_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });

      setMessagesUsed(newCount);
      const newCanUseAI = newCount < dailyLimit;
      setCanUseAI(newCanUseAI);

      if (!newCanUseAI) {
        const tierName = subscriptionData?.subscribed 
          ? `${subscriptionData.subscription_tier} (${dailyLimit} messages)`
          : `Free (${dailyLimit} messages)`;
        
        toast({
          title: "Daily AI limit reached",
          description: `You've reached your ${tierName} daily limit. Upgrade for more AI messages.`,
          variant: "destructive",
        });
      }

      return newCanUseAI;
    } catch (error) {
      console.error('Error incrementing message count:', error);
      return false;
    }
  };

  return {
    messagesUsed,
    canUseAI: isOwner || canUseAI,
    isOwner,
    incrementMessageCount,
    checkAIUsage,
  };
};