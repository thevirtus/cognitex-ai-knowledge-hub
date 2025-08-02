import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const integrationId = url.searchParams.get('integration_id');
    const code = url.searchParams.get('code');
    const type = url.searchParams.get('type') || 'drive';

    if (!integrationId) {
      return new Response('Missing integration_id', { status: 400 });
    }

    // If we have a code, this is the callback
    if (code) {
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: Deno.env.get('GOOGLE_CLIENT_ID') ?? '',
          client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET') ?? '',
          code,
          grant_type: 'authorization_code',
          redirect_uri: `${Deno.env.get('SUPABASE_URL')}/functions/v1/google-oauth?integration_id=${integrationId}&type=${type}`,
        }),
      });

      const tokens = await tokenResponse.json();

      if (tokens.access_token) {
        // Update integration with tokens
        const { error } = await supabase
          .from('integrations')
          .update({
            config: {
              access_token: tokens.access_token,
              refresh_token: tokens.refresh_token,
              scope: tokens.scope,
              type: type
            },
            is_active: true
          })
          .eq('id', integrationId);

        if (error) {
          console.error('Error updating integration:', error);
          return new Response(`
            <html>
              <body>
                <h1>Connection Failed</h1>
                <p>Error: ${error.message}</p>
                <script>window.close()</script>
              </body>
            </html>
          `, { 
            headers: { 'Content-Type': 'text/html' }
          });
        }

        return new Response(`
          <html>
            <body>
              <h1>Connected Successfully!</h1>
              <p>Google ${type === 'drive' ? 'Drive' : 'Workspace'} has been connected to your team.</p>
              <script>window.close()</script>
            </body>
          </html>
        `, { 
          headers: { 'Content-Type': 'text/html' }
        });
      }

      return new Response(`
        <html>
          <body>
            <h1>Connection Failed</h1>
            <p>Failed to obtain access token</p>
            <script>window.close()</script>
          </body>
        </html>
      `, { 
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Initial OAuth redirect
    const scopes = type === 'drive' 
      ? 'https://www.googleapis.com/auth/drive.readonly'
      : 'https://www.googleapis.com/auth/documents.readonly https://www.googleapis.com/auth/spreadsheets.readonly';

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + new URLSearchParams({
      client_id: Deno.env.get('GOOGLE_CLIENT_ID') ?? '',
      redirect_uri: `${Deno.env.get('SUPABASE_URL')}/functions/v1/google-oauth?integration_id=${integrationId}&type=${type}`,
      response_type: 'code',
      scope: scopes,
      access_type: 'offline',
      prompt: 'consent'
    });

    return Response.redirect(authUrl);

  } catch (error: any) {
    console.error('OAuth error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(handler);