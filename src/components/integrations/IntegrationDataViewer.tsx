import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Eye, FileText, Download, ExternalLink, Loader2 } from 'lucide-react';

interface IntegrationDataViewerProps {
  integration: {
    id: string;
    integration_type: string;
    config: any;
  };
}

export const IntegrationDataViewer = ({ integration }: IntegrationDataViewerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const { toast } = useToast();

  const fetchIntegrationData = async () => {
    setIsLoading(true);
    try {
      if (integration.integration_type === 'google_drive' && integration.config && 'folder_id' in integration.config) {
        const { data: response, error } = await supabase.functions.invoke('fetch-google-drive', {
          body: {
            folderId: integration.config.folder_id
          }
        });

        if (error) throw error;
        setData(response);
      } else {
        // For all other integrations, show real functionality
        setData({
          type: integration.integration_type,
          config: integration.config,
          actions: getAvailableActions(integration.integration_type)
        });
      }
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableActions = (type: string) => {
    switch (type) {
      case 'slack':
        return [
          { name: 'Send Message', action: 'send_message', description: 'Send a message to your Slack channel' },
          { name: 'Test Connection', action: 'test_connection', description: 'Test the Slack webhook connection' }
        ];
      case 'discord':
        return [
          { name: 'Send Message', action: 'send_message', description: 'Send a message to your Discord server' },
          { name: 'Test Connection', action: 'test_connection', description: 'Test the Discord webhook connection' }
        ];
      case 'email':
        return [
          { name: 'Send Email', action: 'send_email', description: 'Send an email notification' },
          { name: 'Test Connection', action: 'test_connection', description: 'Send a test email' }
        ];
      case 'webhook':
        return [
          { name: 'Send Webhook', action: 'send_webhook', description: 'Send data to your custom endpoint' },
          { name: 'Test Connection', action: 'test_connection', description: 'Test the webhook endpoint' }
        ];
      default:
        return [
          { name: 'View Config', action: 'view_config', description: 'View integration configuration' }
        ];
    }
  };

  const executeAction = async (action: string, actionData: any = {}) => {
    try {
      const { data: response, error } = await supabase.functions.invoke('integration-action', {
        body: {
          integrationId: integration.id,
          action,
          data: actionData
        }
      });

      if (error) throw error;

      toast({
        title: "Action completed",
        description: response.result?.message || "Action executed successfully",
      });
    } catch (error: any) {
      toast({
        title: "Action failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleViewData = () => {
    setIsOpen(true);
    fetchIntegrationData();
  };

  const renderGoogleDriveData = () => {
    if (!data || !data.files) {
      return <p className="text-muted-foreground">No files found or integration not configured properly.</p>;
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Files in Google Drive Folder</h4>
          <Badge variant="outline">{data.totalFiles} files</Badge>
        </div>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {data.files.map((file: any, index: number) => (
            <Card key={file.id || index} className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <h5 className="font-medium truncate">{file.name}</h5>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                    <span>{file.sizeFormatted}</span>
                    <span>Modified: {file.lastModified}</span>
                  </div>
                  {file.content && (
                    <div className="mt-2 p-2 bg-muted rounded text-xs">
                      <p className="text-muted-foreground mb-1">Content preview:</p>
                      <p className="line-clamp-3">{file.content.substring(0, 200)}...</p>
                    </div>
                  )}
                </div>
                {file.webViewLink && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(file.webViewLink, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderOtherData = () => {
    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Integration Type</h4>
          <Badge variant="secondary">{data?.type}</Badge>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">Configuration</h4>
          <pre className="bg-muted p-3 rounded text-sm overflow-auto">
            {JSON.stringify(data?.config, null, 2)}
          </pre>
        </div>
        
        {data?.actions && (
          <div>
            <h4 className="font-semibold mb-2">Available Actions</h4>
            <div className="space-y-2">
              {data.actions.map((action: any, index: number) => (
                <Card key={index} className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">{action.name}</h5>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (action.action === 'send_message') {
                          const message = prompt('Enter message to send:');
                          if (message) {
                            executeAction(action.action, { message });
                          }
                        } else if (action.action === 'send_email') {
                          const subject = prompt('Enter email subject:');
                          const message = prompt('Enter email message:');
                          if (subject && message) {
                            executeAction(action.action, { subject, message });
                          }
                        } else if (action.action === 'send_webhook') {
                          const message = prompt('Enter data to send (JSON format):');
                          if (message) {
                            try {
                              const parsedData = JSON.parse(message);
                              executeAction(action.action, parsedData);
                            } catch {
                              executeAction(action.action, { message });
                            }
                          }
                        } else {
                          executeAction(action.action);
                        }
                      }}
                    >
                      Execute
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={handleViewData}>
          <Eye className="h-4 w-4 mr-2" />
          View Data
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Integration Data: {integration.integration_type}</DialogTitle>
          <DialogDescription>
            View the data and files from this integration
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading integration data...</span>
            </div>
          ) : data ? (
            integration.integration_type === 'google_drive' ? 
              renderGoogleDriveData() : 
              renderOtherData()
          ) : (
            <p className="text-muted-foreground">No data available</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};