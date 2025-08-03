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
    const { integrationId, action, data } = await req.json();

    if (!integrationId || !action) {
      throw new Error("Integration ID and action are required");
    }

    // Get integration details
    const { data: integration, error: integrationError } = await supabase
      .from('integrations')
      .select('*')
      .eq('id', integrationId)
      .single();

    if (integrationError) throw integrationError;
    if (!integration) throw new Error("Integration not found");

    let result;

    switch (integration.integration_type) {
      case 'notion':
        result = await handleNotionAction(integration, action, data);
        break;
      case 'google_drive':
        result = await handleGoogleDriveAction(integration, action, data);
        break;
      case 'github':
        result = await handleGitHubAction(integration, action, data);
        break;
      case 'slack':
        result = await handleSlackAction(integration, action, data);
        break;
      case 'discord':
        result = await handleDiscordAction(integration, action, data);
        break;
      case 'email':
        result = await handleEmailAction(integration, action, data);
        break;
      case 'webhook':
        result = await handleWebhookAction(integration, action, data);
        break;
      default:
        throw new Error(`Unsupported integration type: ${integration.integration_type}`);
    }

    // Log the activity
    await supabase
      .from('activity_logs')
      .insert({
        team_id: integration.team_id,
        action: `Integration ${action}`,
        metadata: {
          integration_type: integration.integration_type,
          integration_name: integration.integration_name,
          action,
          result
        }
      });

    return new Response(JSON.stringify({ 
      success: true,
      result
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in integration-action function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleNotionAction(integration: any, action: string, data: any) {
  const config = integration.config;
  
  switch (action) {
    case 'fetch_documents':
      try {
        const response = await fetch('https://api.notion.com/v1/search', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.access_token}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28'
          },
          body: JSON.stringify({
            filter: {
              property: 'object',
              value: 'page'
            },
            sort: {
              direction: 'descending',
              timestamp: 'last_edited_time'
            }
          })
        });

        if (!response.ok) {
          throw new Error(`Notion API error: ${response.statusText}`);
        }

        const notionData = await response.json();
        
        return {
          message: 'Documents fetched successfully',
          documents: notionData.results?.map((page: any) => ({
            id: page.id,
            title: page.properties?.title?.title?.[0]?.text?.content || 'Untitled',
            url: page.url,
            lastEdited: page.last_edited_time,
            createdTime: page.created_time
          })) || []
        };
      } catch (error) {
        console.error('Notion fetch error:', error);
        throw new Error(`Failed to fetch Notion documents: ${error.message}`);
      }
    
    case 'test_connection':
      try {
        const response = await fetch('https://api.notion.com/v1/users/me', {
          headers: {
            'Authorization': `Bearer ${config.access_token}`,
            'Notion-Version': '2022-06-28'
          }
        });

        if (!response.ok) {
          throw new Error(`Notion connection test failed: ${response.statusText}`);
        }

        const userData = await response.json();
        return { 
          message: 'Notion connection test successful',
          user: userData.name || userData.id
        };
      } catch (error) {
        throw new Error(`Notion connection test failed: ${error.message}`);
      }
      
    default:
      throw new Error(`Unsupported Notion action: ${action}`);
  }
}

async function handleGoogleDriveAction(integration: any, action: string, data: any) {
  const config = integration.config;
  
  switch (action) {
    case 'fetch_documents':
      try {
        const response = await fetch('https://www.googleapis.com/drive/v3/files?pageSize=20&orderBy=modifiedTime desc', {
          headers: {
            'Authorization': `Bearer ${config.access_token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Google Drive API error: ${response.statusText}`);
        }

        const driveData = await response.json();
        
        return {
          message: 'Documents fetched successfully',
          documents: driveData.files?.map((file: any) => ({
            id: file.id,
            title: file.name,
            url: `https://drive.google.com/file/d/${file.id}/view`,
            lastModified: file.modifiedTime,
            createdTime: file.createdTime,
            mimeType: file.mimeType
          })) || []
        };
      } catch (error) {
        console.error('Google Drive fetch error:', error);
        throw new Error(`Failed to fetch Google Drive documents: ${error.message}`);
      }
    
    case 'test_connection':
      try {
        const response = await fetch('https://www.googleapis.com/drive/v3/about?fields=user', {
          headers: {
            'Authorization': `Bearer ${config.access_token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Google Drive connection test failed: ${response.statusText}`);
        }

        const userData = await response.json();
        return { 
          message: 'Google Drive connection test successful',
          user: userData.user?.displayName || userData.user?.emailAddress
        };
      } catch (error) {
        throw new Error(`Google Drive connection test failed: ${error.message}`);
      }
      
    default:
      throw new Error(`Unsupported Google Drive action: ${action}`);
  }
}

async function handleGitHubAction(integration: any, action: string, data: any) {
  const config = integration.config;
  
  switch (action) {
    case 'fetch_repositories':
      try {
        const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=20', {
          headers: {
            'Authorization': `Bearer ${config.access_token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Cognitex-Integration'
          }
        });

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.statusText}`);
        }

        const repos = await response.json();
        
        return {
          message: 'Repositories fetched successfully',
          repositories: repos.map((repo: any) => ({
            id: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            url: repo.html_url,
            description: repo.description,
            lastUpdated: repo.updated_at,
            language: repo.language,
            stars: repo.stargazers_count
          }))
        };
      } catch (error) {
        console.error('GitHub fetch error:', error);
        throw new Error(`Failed to fetch GitHub repositories: ${error.message}`);
      }

    case 'fetch_issues':
      try {
        const response = await fetch(`https://api.github.com/repos/${data.repo}/issues?state=open&per_page=20`, {
          headers: {
            'Authorization': `Bearer ${config.access_token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Cognitex-Integration'
          }
        });

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.statusText}`);
        }

        const issues = await response.json();
        
        return {
          message: 'Issues fetched successfully',
          issues: issues.map((issue: any) => ({
            id: issue.id,
            number: issue.number,
            title: issue.title,
            url: issue.html_url,
            state: issue.state,
            createdAt: issue.created_at,
            labels: issue.labels.map((label: any) => label.name)
          }))
        };
      } catch (error) {
        console.error('GitHub issues fetch error:', error);
        throw new Error(`Failed to fetch GitHub issues: ${error.message}`);
      }
    
    case 'test_connection':
      try {
        const response = await fetch('https://api.github.com/user', {
          headers: {
            'Authorization': `Bearer ${config.access_token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Cognitex-Integration'
          }
        });

        if (!response.ok) {
          throw new Error(`GitHub connection test failed: ${response.statusText}`);
        }

        const userData = await response.json();
        return { 
          message: 'GitHub connection test successful',
          user: userData.login || userData.name
        };
      } catch (error) {
        throw new Error(`GitHub connection test failed: ${error.message}`);
      }
      
    default:
      throw new Error(`Unsupported GitHub action: ${action}`);
  }
}

async function handleSlackAction(integration: any, action: string, data: any) {
  const config = integration.config;
  
  switch (action) {
    case 'send_message':
      const slackResponse = await fetch(config.webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: data.message,
          channel: config.channel || '#general',
          username: 'Cognitex Bot'
        })
      });
      
      if (!slackResponse.ok) {
        throw new Error(`Slack error: ${slackResponse.statusText}`);
      }
      
      return { message: 'Message sent to Slack successfully' };
    
    case 'test_connection':
      const testResponse = await fetch(config.webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: '🔧 Cognitex integration test - connection successful!',
          channel: config.channel || '#general',
          username: 'Cognitex Bot'
        })
      });
      
      if (!testResponse.ok) {
        throw new Error(`Slack test failed: ${testResponse.statusText}`);
      }
      
      return { message: 'Slack connection test successful' };
      
    default:
      throw new Error(`Unsupported Slack action: ${action}`);
  }
}

async function handleDiscordAction(integration: any, action: string, data: any) {
  const config = integration.config;
  
  switch (action) {
    case 'send_message':
      const discordResponse = await fetch(config.webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: data.message,
          username: 'Cognitex Bot'
        })
      });
      
      if (!discordResponse.ok) {
        throw new Error(`Discord error: ${discordResponse.statusText}`);
      }
      
      return { message: 'Message sent to Discord successfully' };
    
    case 'test_connection':
      const testResponse = await fetch(config.webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: '🔧 Cognitex integration test - connection successful!',
          username: 'Cognitex Bot'
        })
      });
      
      if (!testResponse.ok) {
        throw new Error(`Discord test failed: ${testResponse.statusText}`);
      }
      
      return { message: 'Discord connection test successful' };
      
    default:
      throw new Error(`Unsupported Discord action: ${action}`);
  }
}

async function handleEmailAction(integration: any, action: string, data: any) {
  const config = integration.config;
  
  switch (action) {
    case 'send_email':
      // Call the send-email function directly with Resend
      const resend = await import("npm:resend@4.0.0");
      const resendClient = new resend.Resend(Deno.env.get("RESEND_API_KEY"));
      
      const emailResponse = await resendClient.emails.send({
        from: "Cognitex <connectcognitex@gmail.com>",
        to: [config.email],
        subject: data.subject || 'Cognitex Notification',
        html: data.message || data.html || '<p>Notification from Cognitex</p>',
      });
      
      if (emailResponse.error) {
        throw new Error(`Email sending failed: ${emailResponse.error.message}`);
      }
      
      return { message: 'Email sent successfully', result: emailResponse };
    
    case 'test_connection':
      const resendTest = await import("npm:resend@4.0.0");
      const resendTestClient = new resendTest.Resend(Deno.env.get("RESEND_API_KEY"));
      
      const testResponse = await resendTestClient.emails.send({
        from: "Cognitex <connectcognitex@gmail.com>",
        to: [config.email],
        subject: 'Cognitex Integration Test',
        html: '<h2>🔧 Integration Test</h2><p>Your Cognitex email integration is working correctly!</p>',
      });
      
      if (testResponse.error) {
        throw new Error(`Test email failed: ${testResponse.error.message}`);
      }
      
      return { message: 'Test email sent successfully' };
      
    default:
      throw new Error(`Unsupported Email action: ${action}`);
  }
}

async function handleWebhookAction(integration: any, action: string, data: any) {
  const config = integration.config;
  
  switch (action) {
    case 'send_webhook':
      const webhookResponse = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Cognitex-Webhook/1.0',
          ...(config.secret && { 'X-Webhook-Secret': config.secret })
        },
        body: JSON.stringify(data)
      });
      
      const responseText = await webhookResponse.text();
      let responseData;
      
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }
      
      return { 
        message: 'Webhook sent successfully',
        status: webhookResponse.status,
        response: responseData
      };
    
    case 'test_connection':
      const testResponse = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Cognitex-Webhook/1.0',
          ...(config.secret && { 'X-Webhook-Secret': config.secret })
        },
        body: JSON.stringify({
          test: true,
          message: 'Cognitex integration test',
          timestamp: new Date().toISOString()
        })
      });
      
      return { 
        message: 'Webhook test sent successfully',
        status: testResponse.status
      };
      
    default:
      throw new Error(`Unsupported Webhook action: ${action}`);
  }
}