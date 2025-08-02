import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  ExternalLink, 
  RefreshCw, 
  Loader2,
  Eye,
  FolderOpen 
} from 'lucide-react';

interface IntegratedDocumentProps {
  integration: {
    id: string;
    integration_type: string;
    integration_name: string;
    config: any;
    is_active: boolean;
  };
  onViewContent: (content: any) => void;
}

export const IntegratedDocument = ({ integration, onViewContent }: IntegratedDocumentProps) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (integration.is_active) {
      fetchDocuments();
    }
  }, [integration]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const functionName = getFunctionName(integration.integration_type);
      if (!functionName) {
        throw new Error(`Unsupported integration type: ${integration.integration_type}`);
      }

      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          integrationId: integration.id,
          action: 'list_documents'
        }
      });

      if (error) throw error;

      setDocuments(data.documents || []);
      setLastSync(new Date());
    } catch (error: any) {
      toast({
        title: "Error fetching documents",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFunctionName = (integrationType: string): string | null => {
    switch (integrationType) {
      case 'google_drive':
        return 'fetch-google-drive';
      case 'notion':
        return 'fetch-notion-content';
      case 'github':
        return 'fetch-github-content';
      default:
        return null;
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
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

  const handleViewDocument = async (doc: any) => {
    try {
      const functionName = getFunctionName(integration.integration_type);
      if (!functionName) return;

      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          integrationId: integration.id,
          action: 'get_content',
          documentId: doc.id
        }
      });

      if (error) throw error;

      onViewContent({
        title: doc.name || doc.title,
        content: data.content,
        type: integration.integration_type,
        source: integration.integration_name,
        url: doc.webViewLink || doc.url
      });
    } catch (error: any) {
      toast({
        title: "Error loading document",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!integration.is_active) {
    return (
      <Card className="opacity-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>{getIconForType(integration.integration_type)}</span>
            <span>{integration.integration_name}</span>
            <Badge variant="outline">Disconnected</Badge>
          </CardTitle>
          <CardDescription>
            Connect this integration to access documents
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <span>{getIconForType(integration.integration_type)}</span>
              <span>{integration.integration_name}</span>
              <Badge variant="default">Connected</Badge>
            </CardTitle>
            <CardDescription>
              {documents.length} documents available
              {lastSync && ` • Last synced ${lastSync.toLocaleTimeString()}`}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDocuments}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && documents.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading documents...</span>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No documents found</p>
          </div>
        ) : (
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {documents.map((doc, index) => (
                <div key={doc.id || index} className="flex items-center justify-between p-2 rounded border">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{doc.name || doc.title}</p>
                      {doc.size && (
                        <p className="text-xs text-muted-foreground">{doc.size}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDocument(doc)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {doc.webViewLink && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(doc.webViewLink, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};