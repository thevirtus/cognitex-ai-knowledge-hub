-- Fix the handle_new_user function to handle conflicts better
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  username_val TEXT;
  team_id_val UUID;
BEGIN
  -- Extract username from email (part before @)
  username_val := split_part(NEW.email, '@', 1);
  
  -- Insert profile (handle conflicts gracefully)
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (NEW.id, username_val, COALESCE(NEW.raw_user_meta_data->>'full_name', username_val))
  ON CONFLICT (id) DO UPDATE SET
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
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the auth process
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$function$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();