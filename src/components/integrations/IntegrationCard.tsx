import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { IntegrationDataViewer } from './IntegrationDataViewer';
import { Eye } from 'lucide-react';

interface IntegrationCardProps {
  integration: {
    id?: string;
    name: string;
    description: string;
    type: string;
    icon: React.ReactNode;
    isConnected?: boolean;
    configFields?: Array<{
      name: string;
      label: string;
      type: 'text' | 'password' | 'url';
      placeholder?: string;
    }>;
  };
  teamId: string;
  onUpdate?: () => void;
}

export const IntegrationCard = ({ integration, teamId, onUpdate }: IntegrationCardProps) => {
  const [isConnected, setIsConnected] = useState(integration.isConnected || false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showDataViewer, setShowDataViewer] = useState(false);
  const [config, setConfig] = useState<Record<string, string>>({});
  const [integrationData, setIntegrationData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsConnected(integration.isConnected || false);
    if (integration.isConnected && integration.id) {
      loadIntegrationData();
    }
  }, [integration.isConnected, integration.id]);

  const loadIntegrationData = async () => {
    if (!integration.id) return;
    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('id', integration.id)
        .single();
      
      if (error) throw error;
      setIntegrationData(data);
    } catch (error) {
      console.error('Error loading integration data:', error);
    }
  };

  const handleToggle = async (enabled: boolean) => {
    if (!enabled) {
      // Disconnect
      await handleDisconnect();
      return;
    }

    if (integration.configFields && integration.configFields.length > 0) {
      setShowConfig(true);
    } else {
      await handleConnect({});
    }
  };

  const handleConnect = async (configData: Record<string, string>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('integrations')
        .upsert({
          id: integration.id,
          team_id: teamId,
          integration_type: integration.type,
          integration_name: integration.name,
          config: configData,
          is_active: true,
        });

      if (error) throw error;

      setIsConnected(true);
      setShowConfig(false);
      toast({
        title: "Integration connected",
        description: `${integration.name} has been successfully connected.`,
      });
      onUpdate?.();
    } catch (error: any) {
      toast({
        title: "Connection failed",
        description: error.message,
        variant: "destructive",
      });
      // Reset the switch state on error
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      if (integration.id) {
        const { error } = await supabase
          .from('integrations')
          .update({ is_active: false })
          .eq('id', integration.id);

        if (error) throw error;
      }

      setIsConnected(false);
      toast({
        title: "Integration disconnected",
        description: `${integration.name} has been disconnected.`,
      });
      onUpdate?.();
    } catch (error: any) {
      toast({
        title: "Disconnection failed",
        description: error.message,
        variant: "destructive",
      });
      // Reset the switch state on error
      setIsConnected(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleConnect(config);
  };

  if (showDataViewer && integrationData) {
    return (
      <div className="space-y-4">
        <IntegrationDataViewer integration={integrationData} />
        <Button variant="outline" onClick={() => setShowDataViewer(false)}>
          Back to Integration
        </Button>
      </div>
    );
  }

  return (
    <Card className="shadow-elegant border-0">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            {integration.icon}
          </div>
          <div>
            <CardTitle className="text-lg">{integration.name}</CardTitle>
            <CardDescription className="text-sm">
              {integration.description}
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isConnected && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDataViewer(true)}
                className="flex items-center gap-1"
              >
                <Eye className="h-3 w-3" />
                View Data
              </Button>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Connected
              </Badge>
            </>
          )}
          <Switch
            checked={isConnected}
            onCheckedChange={handleToggle}
            disabled={isLoading}
          />
        </div>
      </CardHeader>

      {showConfig && integration.configFields && (
        <CardContent>
          <form onSubmit={handleConfigSubmit} className="space-y-4">
            <h4 className="font-semibold">Configuration</h4>
            {integration.configFields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-medium">{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={config[field.name] || ''}
                  onChange={(e) => setConfig({ ...config, [field.name]: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
            ))}
            <div className="flex space-x-2">
              <Button type="submit" disabled={isLoading}>
                Connect
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowConfig(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      )}
    </Card>
  );
};