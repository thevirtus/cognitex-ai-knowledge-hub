-- Fix security issues - Add missing RLS policy for owner_privileges
CREATE POLICY "Only owners can view owner privileges" 
ON public.owner_privileges 
FOR SELECT 
USING (public.is_owner(auth.email()));

-- Fix search_path issues in functions
CREATE OR REPLACE FUNCTION public.is_owner(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.owner_privileges 
    WHERE email = user_email
  );
$$;

CREATE OR REPLACE FUNCTION public.reset_daily_ai_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.ai_message_usage 
  SET messages_used = 0, 
      reset_date = now() + INTERVAL '1 day',
      updated_at = now()
  WHERE reset_date <= now();
END;
$$;

CREATE OR REPLACE FUNCTION public.update_integrations_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;