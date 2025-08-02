import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { inviteId, action } = await req.json();

    if (!inviteId || !action) {
      throw new Error("Missing required parameters");
    }

    // Create a Supabase client using service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get the invite details
    const { data: invite, error: inviteError } = await supabaseAdmin
      .from('team_invites')
      .select('*')
      .eq('id', inviteId)
      .eq('status', 'pending')
      .single();

    if (inviteError || !invite) {
      throw new Error("Invalid or expired invitation");
    }

    // Check if invite has expired
    if (new Date() > new Date(invite.expires_at)) {
      await supabaseAdmin
        .from('team_invites')
        .update({ status: 'expired' })
        .eq('id', inviteId);
      
      throw new Error("This invitation has expired");
    }

    if (action === 'accept') {
      // Get or create user based on email
      const { data: existingUser } = await supabaseAdmin.auth.admin.getUserByEmail(invite.email);
      
      if (!existingUser.user) {
        // Send signup invite email instead
        const { error: signupError } = await supabaseAdmin.auth.admin.inviteUserByEmail(invite.email, {
          redirectTo: `${req.headers.get('origin')}/join-team?invite=${inviteId}`
        });
        
        if (signupError) throw signupError;
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: "Signup invitation sent. Please check your email to create an account and join the team."
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // User exists, add them to the team
      const { error: memberError } = await supabaseAdmin
        .from('team_members')
        .insert({
          team_id: invite.team_id,
          user_id: existingUser.user.id,
          role: 'member'
        });

      if (memberError) {
        // Check if user is already a member
        if (memberError.code === '23505') { // Unique constraint violation
          // Update invite status anyway
          await supabaseAdmin
            .from('team_invites')
            .update({ status: 'accepted' })
            .eq('id', inviteId);
          
          return new Response(JSON.stringify({ 
            success: true, 
            message: "You are already a member of this team!"
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        throw memberError;
      }

      // Update invite status
      await supabaseAdmin
        .from('team_invites')
        .update({ status: 'accepted' })
        .eq('id', inviteId);

      // Send welcome email
      await supabaseAdmin.functions.invoke('send-email', {
        body: {
          type: 'team_welcome',
          data: {
            email: invite.email,
            teamName: 'Your Team' // You might want to fetch actual team name
          }
        }
      });

      return new Response(JSON.stringify({ 
        success: true, 
        message: "Successfully joined the team!"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else if (action === 'decline') {
      // Update invite status to declined
      await supabaseAdmin
        .from('team_invites')
        .update({ status: 'declined' })
        .eq('id', inviteId);

      return new Response(JSON.stringify({ 
        success: true, 
        message: "Invitation declined."
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else {
      throw new Error("Invalid action. Must be 'accept' or 'decline'");
    }

  } catch (error) {
    console.error('Error in accept-team-invite function:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});