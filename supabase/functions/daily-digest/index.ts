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
    console.log("Daily digest function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get all teams
    const { data: teams, error: teamsError } = await supabaseClient
      .from('teams')
      .select(`
        id,
        name,
        team_members!inner (
          profiles!inner (
            id,
            full_name,
            username
          )
        )
      `);

    if (teamsError) throw teamsError;

    console.log(`Found ${teams?.length || 0} teams`);

    for (const team of teams || []) {
      try {
        // Get team member emails
        const { data: memberProfiles, error: membersError } = await supabaseClient
          .from('team_members')
          .select(`
            profiles!inner (
              id
            )
          `)
          .eq('team_id', team.id);

        if (membersError) throw membersError;

        const userIds = memberProfiles?.map(m => (m.profiles as any).id) || [];
        if (userIds.length === 0) continue;

        // Get user emails from auth.users
        const { data: users, error: usersError } = await supabaseClient.auth.admin.listUsers();
        if (usersError) throw usersError;

        const teamEmails = users.users
          .filter(user => userIds.includes(user.id))
          .map(user => user.email)
          .filter(Boolean);

        if (teamEmails.length === 0) continue;

        // Get document count
        const { count: documentCount } = await supabaseClient
          .from('documents')
          .select('*', { count: 'exact', head: true })
          .eq('team_id', team.id);

        // Get recent activity (last 24 hours)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const { data: recentDocs, error: docsError } = await supabaseClient
          .from('documents')
          .select(`
            id,
            title,
            updated_at,
            profiles!documents_owner_id_fkey (
              full_name,
              username
            )
          `)
          .eq('team_id', team.id)
          .gte('updated_at', yesterday.toISOString())
          .order('updated_at', { ascending: false });

        if (docsError) throw docsError;

        const updates = recentDocs?.map(doc => ({
          title: doc.title,
          action: 'updated',
          user: (doc.profiles as any)?.full_name || (doc.profiles as any)?.username || 'Unknown'
        })) || [];

        // Send digest email
        const emailResult = await supabaseClient.functions.invoke('send-email', {
          body: {
            type: 'daily_digest',
            data: {
              teamMembers: teamEmails,
              teamName: team.name,
              documentCount: documentCount || 0,
              updates: updates.slice(0, 10) // Limit to 10 recent updates
            }
          }
        });

        console.log(`Sent digest to team ${team.name}:`, emailResult);

      } catch (teamError) {
        console.error(`Error processing team ${team.name}:`, teamError);
      }
    }

    return new Response(JSON.stringify({ success: true, processed: teams?.length || 0 }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error in daily-digest function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});