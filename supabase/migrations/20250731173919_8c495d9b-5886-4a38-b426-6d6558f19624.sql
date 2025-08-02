-- Add owner privileges system
CREATE TABLE IF NOT EXISTS public.owner_privileges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on owner_privileges
ALTER TABLE public.owner_privileges ENABLE ROW LEVEL SECURITY;

-- Insert the owner email
INSERT INTO public.owner_privileges (email) 
VALUES ('austinviolin27@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Add AI message tracking table
CREATE TABLE IF NOT EXISTS public.ai_message_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  messages_used INTEGER NOT NULL DEFAULT 0,
  reset_date TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '1 day',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on ai_message_usage
ALTER TABLE public.ai_message_usage ENABLE ROW LEVEL SECURITY;

-- Create policies for ai_message_usage
CREATE POLICY "Users can view their own message usage" 
ON public.ai_message_usage 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own message usage" 
ON public.ai_message_usage 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own message usage" 
ON public.ai_message_usage 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create integrations table
CREATE TABLE IF NOT EXISTS public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL,
  integration_name TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on integrations
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- Create policies for integrations
CREATE POLICY "Team members can view integrations" 
ON public.integrations 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM team_members 
  WHERE team_members.team_id = integrations.team_id 
  AND team_members.user_id = auth.uid()
));

CREATE POLICY "Team admins can manage integrations" 
ON public.integrations 
FOR ALL
USING (EXISTS (
  SELECT 1 FROM team_members 
  WHERE team_members.team_id = integrations.team_id 
  AND team_members.user_id = auth.uid() 
  AND team_members.role = 'admin'
));

-- Create function to check if user is owner
CREATE OR REPLACE FUNCTION public.is_owner(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.owner_privileges 
    WHERE email = user_email
  );
$$;

-- Create function to reset daily AI message limits
CREATE OR REPLACE FUNCTION public.reset_daily_ai_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.ai_message_usage 
  SET messages_used = 0, 
      reset_date = now() + INTERVAL '1 day',
      updated_at = now()
  WHERE reset_date <= now();
END;
$$;

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_integrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON public.integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_integrations_updated_at();

-- Create trigger for updating ai_message_usage timestamps
CREATE TRIGGER update_ai_message_usage_updated_at
  BEFORE UPDATE ON public.ai_message_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();