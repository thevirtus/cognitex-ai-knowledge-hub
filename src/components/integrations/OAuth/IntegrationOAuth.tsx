import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, CheckCircle, Settings } from 'lucide-react';

interface OAuthIntegrationProps {
  integration: {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    status: 'available' | 'beta' | 'coming_soon';
    oauthUrl?: string;
  };
  teamId: string;
  isConnected: boolean;
  onConnectionChange: () => void;
}

export const OAuthIntegration = ({ 
  integration, 
  teamId, 
  isConnected, 
  onConnectionChange 
}: OAuthIntegrationProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleOAuthConnect = async () => {
    setIsConnecting(true);
    
    try {
      // Create integration record first
      const { data: newIntegration, error } = await supabase
        .from('integrations')
        .upsert({
          team_id: teamId,
          integration_type: integration.id,
          integration_name: integration.name,
          config: { oauth_pending: true },
          is_active: false
        })
        .select()
        .single();

      if (error) throw error;

      // Start OAuth flow
      const oauthUrl = getOAuthUrl(integration.id, newIntegration.id);
      
      // Open OAuth in popup
      const popup = window.open(
        oauthUrl,
        'oauth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      // Listen for OAuth completion
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          // Check if OAuth was successful
          checkOAuthSuccess(newIntegration.id);
        }
      }, 1000);

    } catch (error: any) {
      toast({
        title: "Connection failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const checkOAuthSuccess = async (integrationId: string) => {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('id', integrationId)
        .single();

      if (error) throw error;

      if (data.is_active) {
        toast({
          title: "Connected successfully",
          description: `${integration.name} has been connected to your team.`,
        });
        onConnectionChange();
      } else {
        toast({
          title: "Connection incomplete",
          description: "Please try connecting again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error checking connection",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getOAuthUrl = (integrationType: string, integrationId: string): string => {
    const baseUrl = `https://gheecokmulrlxzgahyrq.supabase.co/functions/v1`;
    
    switch (integrationType) {
      case 'google_drive':
        return `${baseUrl}/google-oauth?integration_id=${integrationId}&type=drive`;
      case 'notion':
        return `${baseUrl}/notion-oauth?integration_id=${integrationId}`;
      case 'slack':
        return `${baseUrl}/slack-oauth?integration_id=${integrationId}`;
      case 'discord':
        return `${baseUrl}/discord-oauth?integration_id=${integrationId}`;
      case 'github':
        return `${baseUrl}/github-oauth?integration_id=${integrationId}`;
      default:
        return '#';
    }
  };

  const handleDisconnect = async () => {
    try {
      const { error } = await supabase
        .from('integrations')
        .update({ is_active: false })
        .eq('team_id', teamId)
        .eq('integration_type', integration.id);

      if (error) throw error;

      toast({
        title: "Disconnected",
        description: `${integration.name} has been disconnected.`,
      });
      onConnectionChange();
    } catch (error: any) {
      toast({
        title: "Error disconnecting",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'available':
        return 'default';
      case 'beta':
        return 'secondary';
      case 'coming_soon':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{integration.icon}</div>
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>{integration.name}</span>
                {isConnected && <CheckCircle className="h-4 w-4 text-green-500" />}
              </CardTitle>
              <CardDescription>{integration.description}</CardDescription>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Badge variant={getStatusVariant(integration.status)}>
              {integration.status.replace('_', ' ')}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {integration.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {integration.status === 'available' || integration.status === 'beta' ? (
            <div className="flex space-x-2">
              {isConnected ? (
                <>
                  <Button variant="outline" onClick={handleDisconnect} size="sm">
                    Disconnect
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    Settings
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={handleOAuthConnect} 
                  disabled={isConnecting}
                  size="sm"
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {isConnecting ? 'Connecting...' : `Connect ${integration.name}`}
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-muted-foreground">Coming Soon</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};