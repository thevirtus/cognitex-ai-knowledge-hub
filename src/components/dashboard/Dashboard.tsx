import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Brain, FileText, Users, LogOut, Plus, Mail, Crown, Settings } from 'lucide-react';
import { InviteTeamMemberDialog } from './InviteTeamMemberDialog';
import { IntegrationsManager } from '@/components/integrations/IntegrationsManager';
import { Tables } from '@/integrations/supabase/types';
import { DocumentManager } from '@/components/documents/DocumentManager';
import { AIChat } from '@/components/chat/AIChat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSubscription } from '@/hooks/useSubscription';
import { useOwnerPrivileges } from '@/hooks/useOwnerPrivileges';
import { Badge } from '@/components/ui/badge';

type Profile = Tables<'profiles'>;
type Team = Tables<'teams'>;
type Document = Tables<'documents'>;

interface DashboardProps {
  user: User;
  defaultTab?: string;
}

export const Dashboard = ({ user, defaultTab }: DashboardProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    if (defaultTab) return defaultTab;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam) return tabParam;
    const path = window.location.pathname;
    if (path === '/chat') return 'chat';
    if (path === '/documents') return 'documents';
    return 'documents';
  });
  const { toast } = useToast();
  const { subscription, createCheckout, openCustomerPortal } = useSubscription();
  const { isOwner } = useOwnerPrivileges();

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    try {
      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      setProfile(profileData);

      // Load user's team
      const { data: teamMemberData, error: teamMemberError } = await supabase
        .from('team_members')
        .select(`
          team_id,
          teams (
            id,
            name,
            created_by
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (teamMemberError) {
        throw teamMemberError;
      }

      const userTeam = (teamMemberData as any).teams as Team;
      setTeam(userTeam);

      // Load team documents
      const { data: documentsData, error: documentsError } = await supabase
        .from('documents')
        .select('*')
        .eq('team_id', userTeam.id)
        .order('created_at', { ascending: false });

      if (documentsError) {
        throw documentsError;
      }

      setDocuments(documentsData);
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

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCreateDocument = async () => {
    if (!team) {
      toast({
        title: "Error",
        description: "Team not found. Please try refreshing the page.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('documents')
        .insert({
          title: 'New Document',
          content: 'Start writing your content here...',
          team_id: team.id,
          owner_id: user.id,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setDocuments([data, ...documents]);
      toast({
        title: "Document created",
        description: "Your new document has been created successfully.",
      });
    } catch (error: any) {
      console.error('Error creating document:', error);
      toast({
        title: "Error creating document",
        description: error.message || "Failed to create document. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Brain className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold">Cognitex</span>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <span className="text-sm text-muted-foreground">
                Welcome back, {profile?.full_name || profile?.username || user.email}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome to {team?.name || 'Your Team'}
              </h1>
              <p className="text-muted-foreground">
                Manage your team's knowledge and collaborate with AI-powered insights.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {isOwner && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  <Crown className="h-3 w-3 mr-1" />
                  Owner
                </Badge>
              )}
              {subscription?.subscribed ? (
                <div className="flex items-center space-x-2">
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <Crown className="h-3 w-3 mr-1" />
                    {subscription.tier || 'Premium'}
                  </Badge>
                  <Button variant="outline" onClick={openCustomerPortal}>
                    Manage Subscription
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => {
                    createCheckout('premium').catch((error) => {
                      toast({
                        title: "Payment System",
                        description: error.message,
                        variant: "destructive",
                      });
                    });
                  }}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>
              )}
              <Button variant="outline" onClick={() => setIsInviteDialogOpen(true)}>
                <Mail className="h-4 w-4 mr-2" />
                Invite Team Member
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{team?.name}</div>
                <p className="text-xs text-muted-foreground">
                  Your knowledge workspace
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Documents</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{documents.length}</div>
                <p className="text-xs text-muted-foreground">
                  Total documents in your team
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subscription</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {subscription?.subscribed ? (
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">{subscription.tier || 'Premium'}</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Free</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {subscription?.subscribed 
                    ? `Full access to all features${subscription.subscription_end ? ` • Renews ${new Date(subscription.subscription_end).toLocaleDateString()}` : ''}`
                    : 'Limited access - upgrade for more'
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Workspace */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="documents">
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="chat">
                <Brain className="h-4 w-4 mr-2" />
                AI Chat
              </TabsTrigger>
              <TabsTrigger value="integrations">
                <Settings className="h-4 w-4 mr-2" />
                Integrations
              </TabsTrigger>
            </TabsList>
            <TabsContent value="documents" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Team Documents</h2>
                  <Button onClick={handleCreateDocument} disabled={!team}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Document
                  </Button>
                </div>
                <DocumentManager user={user} teamId={team?.id || ''} />
              </div>
            </TabsContent>
            <TabsContent value="chat" className="mt-6">
              <div className="h-[600px]">
                <AIChat user={user} teamId={team?.id || ''} />
              </div>
            </TabsContent>
            <TabsContent value="integrations" className="mt-6">
              {team?.id && <IntegrationsManager teamId={team.id} />}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Invite Team Member Dialog */}
      <InviteTeamMemberDialog
        isOpen={isInviteDialogOpen}
        onClose={() => setIsInviteDialogOpen(false)}
        teamId={team?.id || ''}
        onInviteSent={() => {
          toast({
            title: "Invitation sent",
            description: "Team member invitation has been sent successfully.",
          });
        }}
      />
    </div>
  );
};