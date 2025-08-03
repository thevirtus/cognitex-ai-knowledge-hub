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
    const integrationId = url.searchParams.get('integration_id') || url.searchParams.get('state');
    const code = url.searchParams.get('code');

    if (!integrationId) {
      return new Response('Missing integration_id', { status: 400 });
    }

    // If we have a code, this is the callback
    if (code) {
      const tokenResponse = await fetch('https://api.notion.com/v1/oauth/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${Deno.env.get('NOTION_CLIENT_ID')}:${Deno.env.get('NOTION_CLIENT_SECRET')}`)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri: `${Deno.env.get('SUPABASE_URL')}/functions/v1/notion-oauth`,
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
              workspace_id: tokens.workspace_id,
              workspace_name: tokens.workspace_name,
              bot_id: tokens.bot_id
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
              <p>Notion workspace "${tokens.workspace_name}" has been connected to your team.</p>
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
    const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/notion-oauth`;
    const authUrl = `https://api.notion.com/v1/oauth/authorize?` + new URLSearchParams({
      client_id: Deno.env.get('NOTION_CLIENT_ID') ?? '',
      response_type: 'code',
      owner: 'user',
      redirect_uri: redirectUri,
      state: integrationId,
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