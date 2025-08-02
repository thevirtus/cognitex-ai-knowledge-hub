-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create teams table
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team_members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Create documents table
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  file_url TEXT,
  file_type TEXT,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team_invites table
CREATE TABLE public.team_invites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  UNIQUE(team_id, email)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view and update their own profile" 
ON public.profiles 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for teams
CREATE POLICY "Team members can view their teams" 
ON public.teams 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.team_members 
  WHERE team_id = teams.id AND user_id = auth.uid()
));

CREATE POLICY "Team admins can update their teams" 
ON public.teams 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.team_members 
  WHERE team_id = teams.id AND user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Authenticated users can create teams" 
ON public.teams 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

-- Create RLS policies for team_members
CREATE POLICY "Team members can view team memberships" 
ON public.team_members 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.team_members tm 
  WHERE tm.team_id = team_members.team_id AND tm.user_id = auth.uid()
));

CREATE POLICY "Team admins can manage memberships" 
ON public.team_members 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.team_members tm 
  WHERE tm.team_id = team_members.team_id AND tm.user_id = auth.uid() AND tm.role = 'admin'
));

CREATE POLICY "Users can join teams" 
ON public.team_members 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for documents
CREATE POLICY "Team members can view team documents" 
ON public.documents 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.team_members 
  WHERE team_id = documents.team_id AND user_id = auth.uid()
));

CREATE POLICY "Team members can create documents" 
ON public.documents 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.team_members 
  WHERE team_id = documents.team_id AND user_id = auth.uid()
) AND auth.uid() = uploaded_by);

CREATE POLICY "Team members can update team documents" 
ON public.documents 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.team_members 
  WHERE team_id = documents.team_id AND user_id = auth.uid()
));

CREATE POLICY "Team members can delete team documents" 
ON public.documents 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.team_members 
  WHERE team_id = documents.team_id AND user_id = auth.uid()
));

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

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

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
  VALUES (NEW.id, username_val, COALESCE(NEW.raw_user_meta_data->>'full_name', username_val));
  
  -- Create team
  INSERT INTO public.teams (name, created_by)
  VALUES (username_val || '''s Team', NEW.id)
  RETURNING id INTO team_id_val;
  
  -- Add user as admin to the team
  INSERT INTO public.team_members (team_id, user_id, role)
  VALUES (team_id_val, NEW.id, 'admin');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();