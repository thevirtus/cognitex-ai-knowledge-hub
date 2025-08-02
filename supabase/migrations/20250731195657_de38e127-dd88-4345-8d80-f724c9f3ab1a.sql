-- Fix infinite recursion in team_members RLS policies
-- First, create a security definer function to check team membership safely
CREATE OR REPLACE FUNCTION public.is_team_member(_team_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members 
    WHERE team_id = _team_id AND user_id = _user_id
  );
$$;

-- Create function to check if user is team admin
CREATE OR REPLACE FUNCTION public.is_team_admin(_team_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members 
    WHERE team_id = _team_id AND user_id = _user_id AND role = 'admin'
  );
$$;

-- Drop all existing policies on team_members to recreate them properly
DROP POLICY IF EXISTS "Allow members to view memberships" ON public.team_members;
DROP POLICY IF EXISTS "Allow admins to insert memberships" ON public.team_members;
DROP POLICY IF EXISTS "Allow admins to update memberships" ON public.team_members;
DROP POLICY IF EXISTS "Allow admins to delete memberships" ON public.team_members;

-- Create new policies using the security definer functions
CREATE POLICY "Users can view their own team memberships" 
ON public.team_members 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Team admins can view all team memberships" 
ON public.team_members 
FOR SELECT 
USING (public.is_team_admin(team_id, auth.uid()));

CREATE POLICY "Team admins can insert memberships" 
ON public.team_members 
FOR INSERT 
WITH CHECK (public.is_team_admin(team_id, auth.uid()));

CREATE POLICY "Team admins can update memberships" 
ON public.team_members 
FOR UPDATE 
USING (public.is_team_admin(team_id, auth.uid()));

CREATE POLICY "Team admins can delete memberships" 
ON public.team_members 
FOR DELETE 
USING (public.is_team_admin(team_id, auth.uid()));

-- Fix the teams table to not reference description column which doesn't exist
-- Update policies on other tables to use the security definer functions

-- Update teams policies
DROP POLICY IF EXISTS "Team members can view teams" ON public.teams;
DROP POLICY IF EXISTS "Team admins can update teams" ON public.teams;

CREATE POLICY "Team members can view teams" 
ON public.teams 
FOR SELECT 
USING (public.is_team_member(id, auth.uid()));

CREATE POLICY "Team admins can update teams" 
ON public.teams 
FOR UPDATE 
USING (public.is_team_admin(id, auth.uid()));

-- Update documents policies
DROP POLICY IF EXISTS "Allow team members to view documents" ON public.documents;
DROP POLICY IF EXISTS "Allow team members to insert documents" ON public.documents;
DROP POLICY IF EXISTS "Allow team members to update their own documents" ON public.documents;
DROP POLICY IF EXISTS "Allow team members to delete their own documents" ON public.documents;

CREATE POLICY "Team members can view documents" 
ON public.documents 
FOR SELECT 
USING (public.is_team_member(team_id, auth.uid()));

CREATE POLICY "Team members can insert documents" 
ON public.documents 
FOR INSERT 
WITH CHECK (public.is_team_member(team_id, auth.uid()));

CREATE POLICY "Team members can update documents" 
ON public.documents 
FOR UPDATE 
USING (public.is_team_member(team_id, auth.uid()));

CREATE POLICY "Team members can delete documents" 
ON public.documents 
FOR DELETE 
USING (public.is_team_member(team_id, auth.uid()));

-- Update integrations policies
DROP POLICY IF EXISTS "Team members can view integrations" ON public.integrations;
DROP POLICY IF EXISTS "Team admins can manage integrations" ON public.integrations;

CREATE POLICY "Team members can view integrations" 
ON public.integrations 
FOR SELECT 
USING (public.is_team_member(team_id, auth.uid()));

CREATE POLICY "Team admins can manage integrations" 
ON public.integrations 
FOR ALL 
USING (public.is_team_admin(team_id, auth.uid()));

-- Update activity_logs policies
DROP POLICY IF EXISTS "Allow team members to view logs" ON public.activity_logs;

CREATE POLICY "Team members can view logs" 
ON public.activity_logs 
FOR SELECT 
USING (public.is_team_member(team_id, auth.uid()));

-- Update team_invites policies
DROP POLICY IF EXISTS "Team admins can manage invites" ON public.team_invites;

CREATE POLICY "Team admins can manage invites" 
ON public.team_invites 
FOR ALL 
USING (public.is_team_admin(team_id, auth.uid()));