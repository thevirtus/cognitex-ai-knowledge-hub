import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  FileText, 
  RefreshCw, 
  ExternalLink, 
  Calendar,
  User,
  Download
} from 'lucide-react';

interface IntegratedDocumentProps {
  teamId: string;
}

interface Document {
  id: string;
  title: string;
  content: string;
  source_integration?: string;
  source_url?: string;
  imported_at?: string;
  updated_at: string;
  created_at?: string;
  owner_id?: string;
  team_id?: string;
  metadata?: any;
}

export const IntegratedDocument = ({ teamId }: IntegratedDocumentProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDocuments();
  }, [teamId]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('team_id', teamId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading documents",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const syncIntegrations = async () => {
    try {
      setSyncing(true);
      
      // Get all active integrations
      const { data: integrations, error: integrationsError } = await supabase
        .from('integrations')
        .select('*')
        .eq('team_id', teamId)
        .eq('is_active', true);

      if (integrationsError) throw integrationsError;

      // Sync each integration
      for (const integration of integrations || []) {
        if (integration.integration_type === 'google_drive') {
          await syncGoogleDrive(integration);
        } else if (integration.integration_type === 'notion') {
          await syncNotion(integration);
        } else if (integration.integration_type === 'github') {
          await syncGitHub(integration);
        }
      }

      await loadDocuments();
      
      toast({
        title: "Sync completed",
        description: "All integrations have been synced successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Sync failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const syncGoogleDrive = async (integration: any) => {
    const { error } = await supabase.functions.invoke('fetch-google-drive', {
      body: { integrationId: integration.id }
    });
    if (error) throw error;
  };

  const syncNotion = async (integration: any) => {
    // Call Notion sync function when available
    console.log('Syncing Notion integration:', integration.id);
  };

  const syncGitHub = async (integration: any) => {
    // Call GitHub sync function when available
    console.log('Syncing GitHub integration:', integration.id);
  };

  const getSourceIcon = (source?: string) => {
    switch (source) {
      case 'google_drive':
        return '📁';
      case 'notion':
        return '📝';
      case 'github':
        return '🐙';
      default:
        return '📄';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card className="shadow-sm border">
        <CardContent className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Integrated Documents
              </CardTitle>
              <CardDescription>
                Documents synced from your connected integrations
              </CardDescription>
            </div>
            <Button 
              onClick={syncIntegrations} 
              disabled={syncing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync All'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No documents found</h3>
              <p className="text-muted-foreground mb-4">
                Connect your integrations to start importing documents automatically.
              </p>
              <Button onClick={syncIntegrations} disabled={syncing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                Sync Integrations
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <Card key={doc.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{getSourceIcon(doc.source_integration)}</span>
                          <h4 className="font-semibold truncate">{doc.title}</h4>
                          {doc.source_integration && (
                            <Badge variant="outline" className="text-xs">
                              {doc.source_integration.replace('_', ' ')}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {doc.content?.substring(0, 150)}...
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(doc.updated_at)}
                          </div>
                          {doc.metadata?.author && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {doc.metadata.author}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {doc.source_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(doc.source_url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const element = document.createElement('a');
                            const file = new Blob([doc.content], { type: 'text/plain' });
                            element.href = URL.createObjectURL(file);
                            element.download = `${doc.title}.txt`;
                            document.body.appendChild(element);
                            element.click();
                            document.body.removeChild(element);
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};