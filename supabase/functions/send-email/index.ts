import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } }
);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    
    let emailResponse;
    
    if (type === "team_invite") {
      const { inviteEmail, teamName, inviterName } = data;
      
      // Get the latest invite for this email to create proper link
      let inviteLink = `${req.headers.get("origin")}/auth`;
      
      try {
        const { data: inviteData } = await supabaseClient
          .from('team_invites')
          .select('id')
          .eq('email', inviteEmail)
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (inviteData) {
          inviteLink = `${req.headers.get("origin")}/team-invite?id=${inviteData.id}`;
        }
      } catch (error) {
        console.error('Error fetching invite ID:', error);
      }
      
      emailResponse = await resend.emails.send({
        from: "Cognitex <connectcognitex@gmail.com>",
        to: [inviteEmail],
        subject: `You're invited to join ${teamName} on Cognitex`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #6366f1;">You're Invited to Cognitex!</h1>
            <p>Hi there!</p>
            <p><strong>${inviterName}</strong> has invited you to join their team <strong>"${teamName}"</strong> on Cognitex - the AI-powered team knowledge management platform.</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">What is Cognitex?</h3>
              <ul style="margin: 0;">
                <li>AI-powered document management</li>
                <li>Intelligent chat with your team's knowledge</li>
                <li>Seamless team collaboration</li>
                <li>Integrations with popular tools</li>
              </ul>
            </div>
            
            <a href="${inviteLink}" 
               style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
              Accept Invitation
            </a>
            
            <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
              If you didn't expect this invitation, you can safely ignore this email.
            </p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 12px; text-align: center;">
              © 2024 Cognitex. All rights reserved.<br>
              Contact us: <a href="mailto:connectcognitex@gmail.com">connectcognitex@gmail.com</a>
            </p>
          </div>
        `,
      });
    } else if (type === "document_update") {
      const { teamMembers, documentTitle, updaterName, teamName } = data;
      
      emailResponse = await resend.emails.send({
        from: "Cognitex <connectcognitex@gmail.com>",
        to: teamMembers,
        subject: `Document Updated in ${teamName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #6366f1;">Document Updated</h1>
            <p><strong>${updaterName}</strong> updated the document <strong>"${documentTitle}"</strong> in your team <strong>${teamName}</strong>.</p>
            
            <a href="${req.headers.get("origin")}/dashboard" 
               style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
              View Document
            </a>
            
            <p style="color: #64748b; font-size: 14px;">
              Stay up to date with your team's knowledge base on Cognitex.
            </p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 12px; text-align: center;">
              © 2024 Cognitex. All rights reserved.<br>
              Contact us: <a href="mailto:connectcognitex@gmail.com">connectcognitex@gmail.com</a>
            </p>
          </div>
        `,
      });
    } else if (type === "daily_digest") {
      const { teamMembers, teamName, documentCount, updates } = data;
      
      emailResponse = await resend.emails.send({
        from: "Cognitex <connectcognitex@gmail.com>",
        to: teamMembers,
        subject: `Daily Digest - ${teamName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #6366f1;">Daily Digest for ${teamName}</h1>
            <p>Here's what happened in your team today:</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">📊 Team Activity</h3>
              <p><strong>${documentCount}</strong> documents in your knowledge base</p>
              <p><strong>${updates.length}</strong> updates today</p>
            </div>
            
            ${updates.length > 0 ? `
              <h3>Recent Updates:</h3>
              <ul>
                ${updates.map(update => `<li><strong>${update.title}</strong> - ${update.action} by ${update.user}</li>`).join('')}
              </ul>
            ` : '<p>No updates today - your team knowledge base is stable!</p>'}
            
            <a href="${req.headers.get("origin")}/dashboard" 
               style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
              View Dashboard
            </a>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 12px; text-align: center;">
              © 2024 Cognitex. All rights reserved.<br>
              Contact us: <a href="mailto:connectcognitex@gmail.com">connectcognitex@gmail.com</a>
            </p>
          </div>
        `,
      });
    }

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});