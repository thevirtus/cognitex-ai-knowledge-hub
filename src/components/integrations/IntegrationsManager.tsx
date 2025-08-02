import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IntegrationCard } from './IntegrationCard';
import { OAuthIntegration } from './OAuth/IntegrationOAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Slack, 
  MessageSquare, 
  FileText, 
  Database, 
  Mail,
  Calendar,
  Github,
  Trello,
  Webhook
} from 'lucide-react';

interface IntegrationsManagerProps {
  teamId: string;
}

export const IntegrationsManager = ({ teamId }: IntegrationsManagerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [availableIntegrations] = useState([
    // OAuth-based integrations
    {
      name: 'Google Drive',
      type: 'google_drive',
      description: 'Sync documents with Google Drive',
      icon: '📁',
      category: 'Storage',
      status: 'available',
      useOAuth: true
    },
    {
      name: 'Notion',
      type: 'notion',
      description: 'Sync your knowledge base with Notion',
      icon: '📝',
      category: 'Productivity',
      status: 'beta',
      useOAuth: true
    },
    {
      name: 'GitHub',
      type: 'github',
      description: 'Track issues and pull requests',
      icon: '🐙',
      category: 'Development',
      status: 'beta',
      useOAuth: true
    },
    // Traditional config-based integrations
    {
      name: 'Slack',
      type: 'slack',
      description: 'Get notifications and updates in your Slack channels',
      icon: <Slack className="w-5 h-5 text-purple-600" />,
      category: 'Communication',
      status: 'available',
      useOAuth: false,
      configFields: [
        { name: 'webhook_url', label: 'Webhook URL', type: 'url' as const, placeholder: 'https://hooks.slack.com/...' },
        { name: 'channel', label: 'Channel', type: 'text' as const, placeholder: '#general' }
      ]
    },
    {
      name: 'Discord',
      type: 'discord',
      description: 'Send notifications to your Discord server',
      icon: <MessageSquare className="w-5 h-5 text-indigo-600" />,
      category: 'Communication',
      status: 'available',
      useOAuth: false,
      configFields: [
        { name: 'webhook_url', label: 'Webhook URL', type: 'url' as const, placeholder: 'https://discord.com/api/webhooks/...' }
      ]
    },
    {
      name: 'Email Notifications',
      type: 'email',
      description: 'Get email notifications for important updates',
      icon: <Mail className="w-5 h-5 text-red-600" />,
      category: 'Communication',
      status: 'available',
      useOAuth: false,
      configFields: [
        { name: 'email', label: 'Email Address', type: 'text' as const, placeholder: 'notifications@company.com' }
      ]
    },
    {
      name: 'Custom Webhook',
      type: 'webhook',
      description: 'Send data to any custom endpoint',
      icon: <Webhook className="w-5 h-5 text-orange-600" />,
      category: 'Custom',
      status: 'available',
      useOAuth: false,
      configFields: [
        { name: 'url', label: 'Webhook URL', type: 'url' as const, placeholder: 'https://api.example.com/webhook' },
        { name: 'secret', label: 'Secret (optional)', type: 'password' as const, placeholder: 'Webhook secret' }
      ]
    }
  ]);
  const { toast } = useToast();

  useEffect(() => {
    loadIntegrations();
  }, [teamId]);

  const loadIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('team_id', teamId);

      if (error) throw error;
      setIntegrations(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading integrations",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredIntegrations = availableIntegrations.filter(integration =>
    integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    integration.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIntegrationWithStatus = (integration: any) => {
    const connected = integrations.find(
      i => i.integration_type === integration.type && i.is_active
    );
    return {
      ...integration,
      id: connected?.id,
      isConnected: !!connected,
    };
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Team Integrations
          </CardTitle>
          <CardDescription>
            Connect your favorite tools and services to enhance your team's productivity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search integrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredIntegrations.map((integration) => {
          const integrationWithStatus = getIntegrationWithStatus(integration);
          
           return integration.useOAuth ? (
            <OAuthIntegration
              key={integration.type}
              integration={{
                id: integration.type,
                name: integration.name,
                description: integration.description,
                icon: typeof integration.icon === 'string' ? integration.icon : '🔗',
                category: integration.category,
                status: integration.status as 'available' | 'beta' | 'coming_soon'
              }}
              teamId={teamId}
              isConnected={integrationWithStatus.isConnected}
              onConnectionChange={loadIntegrations}
            />
          ) : (
            <IntegrationCard
              key={integration.type}
              integration={integrationWithStatus}
              teamId={teamId}
              onUpdate={loadIntegrations}
            />
          );
        })}
      </div>

      {filteredIntegrations.length === 0 && (
        <Card className="shadow-sm border">
          <CardContent className="text-center py-8">
            <Database className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No integrations found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms to find the integration you're looking for.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};