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
      // Use existing send-email function
      const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          to: config.email,
          subject: data.subject || 'Cognitex Notification',
          html: data.message || data.html,
          from: 'connectcognitex@gmail.com'
        }
      });
      
      if (emailError) throw emailError;
      
      return { message: 'Email sent successfully', result: emailResult };
    
    case 'test_connection':
      const { data: testResult, error: testError } = await supabase.functions.invoke('send-email', {
        body: {
          to: config.email,
          subject: 'Cognitex Integration Test',
          html: '<h2>🔧 Integration Test</h2><p>Your Cognitex email integration is working correctly!</p>',
          from: 'connectcognitex@gmail.com'
        }
      });
      
      if (testError) throw testError;
      
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