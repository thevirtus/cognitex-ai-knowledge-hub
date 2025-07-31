import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface InviteTeamMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  onInviteSent: () => void;
}

export const InviteTeamMemberDialog = ({
  isOpen,
  onClose,
  teamId,
  onInviteSent,
}: InviteTeamMemberDialogProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInvite = async () => {
    if (!email || !teamId) return;

    setIsLoading(true);

    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        throw new Error('Not authenticated');
      }

      // Get current user's profile for the email
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, username')
        .eq('id', currentUser.user.id)
        .single();

      // Get team name
      const { data: team } = await supabase
        .from('teams')
        .select('name')
        .eq('id', teamId)
        .single();

      const { error } = await supabase
        .from('team_invites')
        .insert({
          team_id: teamId,
          email: email.toLowerCase().trim(),
          invited_by: currentUser.user.id,
        });

      if (error) {
        throw error;
      }

      // Send invitation email
      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'team_invite',
          data: {
            inviteEmail: email.toLowerCase().trim(),
            teamName: team?.name || 'Team',
            inviterName: profile?.full_name || profile?.username || 'Team member'
          }
        }
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
        // Don't fail the invite if email fails
      }

      onInviteSent();
      setEmail('');
      onClose();
    } catch (error: any) {
      toast({
        title: "Error sending invitation",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to join your team. They'll receive an email with instructions.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="colleague@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleInvite();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleInvite} disabled={isLoading || !email}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};