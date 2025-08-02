-- Create team_invites table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.team_invites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  UNIQUE(team_id, email)
);

-- Add missing columns to existing tables
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS username TEXT,
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Enable RLS on team_invites if it exists
ALTER TABLE public.team_invites ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Team admins can manage invites" ON public.team_invites;
DROP POLICY IF EXISTS "Invited users can view their invites" ON public.team_invites;

-- Create RLS policies for team_invites
CREATE POLICY "Team admins can manage invites" 
ON public.team_invites 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.team_members 
  WHERE team_id = team_invites.team_id AND user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Invited users can view their invites" 
ON public.team_invites 
FOR SELECT 
USING (auth.email() = email);

-- Create function to handle new user signup (overwrite existing)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  username_val TEXT;
  team_id_val UUID;
BEGIN
  -- Extract username from email (part before @)
  username_val := split_part(NEW.email, '@', 1);
  
  -- Insert profile (handle conflicts)
  INSERT INTO public.profiles (user_id, username, full_name)
  VALUES (NEW.id, username_val, COALESCE(NEW.raw_user_meta_data->>'full_name', username_val))
  ON CONFLICT (user_id) DO UPDATE SET
    username = EXCLUDED.username,
    full_name = EXCLUDED.full_name;
  
  -- Create team only if user doesn't have one yet
  IF NOT EXISTS (SELECT 1 FROM public.team_members WHERE user_id = NEW.id) THEN
    INSERT INTO public.teams (name, created_by)
    VALUES (username_val || '''s Team', NEW.id)
    RETURNING id INTO team_id_val;
    
    -- Add user as admin to the team
    INSERT INTO public.team_members (team_id, user_id, role)
    VALUES (team_id_val, NEW.id, 'admin');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup (drop if exists first)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();