-- Create missing tables that don't already exist

-- Create team_invites table (likely missing)
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

ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS file_url TEXT,
ADD COLUMN IF NOT EXISTS file_type TEXT,
ADD COLUMN IF NOT EXISTS uploaded_by UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.teams 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Enable RLS on new table
ALTER TABLE public.team_invites ENABLE ROW LEVEL SECURITY;

-- Create missing RLS policies
CREATE POLICY IF NOT EXISTS "Team admins can manage invites" 
ON public.team_invites 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.team_members 
  WHERE team_id = team_invites.team_id AND user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY IF NOT EXISTS "Invited users can view their invites" 
ON public.team_invites 
FOR SELECT 
USING (auth.email() = email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at (if they don't exist)
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_teams_updated_at ON public.teams;
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_documents_updated_at ON public.documents;
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  username_val TEXT;
  team_id_val UUID;
BEGIN
  -- Extract username from email (part before @)
  username_val := split_part(NEW.email, '@', 1);
  
  -- Insert profile
  INSERT INTO public.profiles (user_id, username, full_name)
  VALUES (NEW.id, username_val, COALESCE(NEW.raw_user_meta_data->>'full_name', username_val))
  ON CONFLICT (user_id) DO NOTHING;
  
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

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();