import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { FileText, Plus, Edit2, Trash2, Brain, Loader2 } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

type Document = Tables<'documents'>;

interface DocumentManagerProps {
  user: User;
  teamId: string;
}

export const DocumentManager = ({ user, teamId }: DocumentManagerProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadDocuments();
  }, [teamId]);

  const loadDocuments = async () => {
    try {
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
      setIsLoading(false);
    }
  };

  const createDocument = async () => {
    if (!newDocTitle.trim()) return;

    try {
      const { data, error } = await supabase
        .from('documents')
        .insert({
          title: newDocTitle,
          content: newDocContent,
          team_id: teamId,
          owner_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setDocuments([data, ...documents]);
      setNewDocTitle('');
      setNewDocContent('');
      setIsCreateDialogOpen(false);
      toast({
        title: "Document created",
        description: "Your document has been created successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating document",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateDocument = async (doc: Document) => {
    try {
      const { error } = await supabase
        .from('documents')
        .update({
          title: doc.title,
          content: doc.content,
        })
        .eq('id', doc.id);

      if (error) throw error;

      setDocuments(documents.map(d => d.id === doc.id ? doc : d));
      setEditingDoc(null);
      toast({
        title: "Document updated",
        description: "Your document has been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating document",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteDocument = async (docId: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', docId);

      if (error) throw error;

      setDocuments(documents.filter(d => d.id !== docId));
      toast({
        title: "Document deleted",
        description: "Your document has been deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting document",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generateSummary = async (doc: Document) => {
    setIsSummarizing(doc.id);
    
    try {
      // This would call an AI service to generate a summary
      // For now, we'll show a placeholder
      toast({
        title: "AI Summary (Premium Feature)",
        description: "Upgrade to Premium to access AI-powered document summaries.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error generating summary",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSummarizing(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Documents</h2>
          <p className="text-muted-foreground">Manage your team's knowledge base</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Document</DialogTitle>
              <DialogDescription>
                Add a new document to your team's knowledge base.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  placeholder="Document title..."
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newDocContent}
                  onChange={(e) => setNewDocContent(e.target.value)}
                  placeholder="Start writing your content..."
                  rows={10}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createDocument} disabled={!newDocTitle.trim()}>
                  Create Document
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Documents Grid */}
      {documents.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No documents yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first document to start building your knowledge base.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Document
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <Card key={doc.id} className="group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {editingDoc?.id === doc.id ? (
                      <Input
                        value={editingDoc.title || ''}
                        onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                        className="mb-2"
                      />
                    ) : (
                      <CardTitle className="line-clamp-2">{doc.title}</CardTitle>
                    )}
                    <CardDescription>
                      Updated {doc.updated_at ? new Date(doc.updated_at).toLocaleDateString() : 'Unknown'}
                    </CardDescription>
                  </div>
                  <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingDoc?.id === doc.id ? (
                  <Textarea
                    value={editingDoc.content || ''}
                    onChange={(e) => setEditingDoc({ ...editingDoc, content: e.target.value })}
                    rows={6}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {doc.content || 'No content'}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {editingDoc?.id === doc.id ? (
                      <>
                        <Button size="sm" onClick={() => updateDocument(editingDoc)}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingDoc(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingDoc(doc)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => generateSummary(doc)}
                          disabled={isSummarizing === doc.id}
                        >
                          {isSummarizing === doc.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Brain className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteDocument(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};