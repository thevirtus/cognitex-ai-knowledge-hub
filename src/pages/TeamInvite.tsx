import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Calendar, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const TeamInvite = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [invite, setInvite] = useState<any>(null);
  const [responseStatus, setResponseStatus] = useState<'pending' | 'accepted' | 'declined' | null>(null);
  const { toast } = useToast();

  const inviteId = searchParams.get('id');

  useEffect(() => {
    if (inviteId) {
      loadInvite();
    }
  }, [inviteId]);

  const loadInvite = async () => {
    if (!inviteId) return;

    try {
      const { data, error } = await supabase
        .from('team_invites')
        .select(`
          *,
          teams!inner(name),
          profiles!inner(full_name, username)
        `)
        .eq('id', inviteId)
        .single();

      if (error) throw error;
      setInvite(data);
    } catch (error: any) {
      toast({
        title: "Error loading invitation",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleResponse = async (action: 'accept' | 'decline') => {
    if (!inviteId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('accept-team-invite', {
        body: {
          inviteId,
          action
        }
      });

      if (error) throw error;

      setResponseStatus(action === 'accept' ? 'accepted' : 'declined');
      toast({
        title: action === 'accept' ? "Invitation accepted!" : "Invitation declined",
        description: data.message,
        variant: action === 'accept' ? "default" : "destructive",
      });

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error: any) {
      toast({
        title: "Error responding to invitation",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!inviteId) {
    return (
      <div className="min-h-screen gradient-subtle flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-elegant border-0">
          <CardContent className="text-center py-8">
            <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Invalid Invitation</h2>
            <p className="text-muted-foreground">
              This invitation link is invalid or expired.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (responseStatus) {
    return (
      <div className="min-h-screen gradient-subtle flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-elegant border-0">
          <CardContent className="text-center py-8">
            {responseStatus === 'accepted' ? (
              <>
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Welcome to the Team!</h2>
                <p className="text-muted-foreground mb-4">
                  You have successfully joined the team. You'll be redirected shortly.
                </p>
              </>
            ) : (
              <>
                <XCircle className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Invitation Declined</h2>
                <p className="text-muted-foreground mb-4">
                  You have declined the team invitation. You'll be redirected shortly.
                </p>
              </>
            )}
            <Badge variant="outline">Redirecting in 3 seconds...</Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invite) {
    return (
      <div className="min-h-screen gradient-subtle flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-elegant border-0">
          <CardContent className="text-center py-8">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
            <p>Loading invitation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-subtle flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-elegant border-0">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl">Team Invitation</CardTitle>
          <CardDescription>
            You've been invited to join a team on Cognitex
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="font-semibold text-lg">{invite.teams.name}</h3>
            <p className="text-sm text-muted-foreground">
              Invited by {invite.profiles?.full_name || invite.profiles?.username || 'Team Administrator'}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{invite.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Expires</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(invite.expires_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleResponse('decline')}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Decline
            </Button>
            <Button
              className="flex-1"
              onClick={() => handleResponse('accept')}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Accept & Join
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            By accepting, you'll be able to access team documents and collaborate with other members.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};