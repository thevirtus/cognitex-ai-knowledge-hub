import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { supabase } from "../_shared/supabase.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const integrationId = url.searchParams.get('integration_id');
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    console.log('GitHub OAuth request:', { integrationId, code: !!code, state });

    if (!integrationId) {
      throw new Error('Missing integration_id parameter');
    }

    // Get integration details
    const { data: integration, error: integrationError } = await supabase
      .from('integrations')
      .select('*')
      .eq('id', integrationId)
      .single();

    if (integrationError) throw integrationError;
    if (!integration) throw new Error('Integration not found');

    console.log('Found integration:', integration.id);

    if (!code) {
      // Step 1: Redirect to GitHub OAuth
      const clientId = Deno.env.get('GITHUB_CLIENT_ID');
      if (!clientId) {
        throw new Error('GitHub client ID not configured');
      }

      const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/github-oauth`;
      
      const githubAuthUrl = `https://github.com/login/oauth/authorize?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=repo,user:email&` +
        `state=${integrationId}`;

      console.log('Redirecting to GitHub OAuth:', githubAuthUrl);

      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': githubAuthUrl
        }
      });
    }

    // Step 2: Exchange code for access token
    const clientId = Deno.env.get('GITHUB_CLIENT_ID');
    const clientSecret = Deno.env.get('GITHUB_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new Error('GitHub OAuth credentials not configured');
    }

    console.log('Exchanging code for token...');

    const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/github-oauth`;

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();
    console.log('Token response:', { success: !!tokenData.access_token });

    if (tokenData.error) {
      throw new Error(`GitHub OAuth error: ${tokenData.error_description}`);
    }

    if (!tokenData.access_token) {
      throw new Error('No access token received from GitHub');
    }

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const userData = await userResponse.json();
    console.log('GitHub user:', userData.login);

    // Update integration with OAuth data
    const { error: updateError } = await supabase
      .from('integrations')
      .update({
        config: {
          access_token: tokenData.access_token,
          token_type: tokenData.token_type || 'bearer',
          scope: tokenData.scope,
          user_info: {
            id: userData.id,
            login: userData.login,
            name: userData.name,
            email: userData.email,
            avatar_url: userData.avatar_url
          }
        },
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', integrationId);

    if (updateError) throw updateError;

    console.log('Integration updated successfully');

    // Return success page
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>GitHub Connected</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .success { color: #22c55e; }
            .container { max-width: 400px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="success">✅ GitHub Connected!</h1>
            <p>Your GitHub account has been successfully connected.</p>
            <p>User: <strong>${userData.login}</strong></p>
            <p>You can now close this window and return to the application.</p>
            <script>
              setTimeout(() => {
                window.close();
              }, 3000);
            </script>
          </div>
        </body>
      </html>
    `, {
      headers: { ...corsHeaders, 'Content-Type': 'text/html' },
    });

  } catch (error) {
    console.error('GitHub OAuth error:', error);
    
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>GitHub Connection Error</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .error { color: #ef4444; }
            .container { max-width: 400px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="error">❌ Connection Failed</h1>
            <p>There was an error connecting your GitHub account:</p>
            <p><strong>${error.message}</strong></p>
            <p>Please try again or contact support if the problem persists.</p>
            <script>
              setTimeout(() => {
                window.close();
              }, 5000);
            </script>
          </div>
        </body>
      </html>
    `, {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/html' },
    });
  }
});