import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/useSubscription';
import { Loader2, User as UserIcon, CreditCard, Shield } from 'lucide-react';

interface SettingsProps {
  user: User;
}

export const Settings = ({ user }: SettingsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState(user.user_metadata?.full_name || '');
  const [documentCount, setDocumentCount] = useState(0);
  const [teamMemberCount, setTeamMemberCount] = useState(0);
  const { toast } = useToast();
  const { subscription, isLoading: subscriptionLoading } = useSubscription();

  useEffect(() => {
    loadUsageData();
  }, [user.id]);

  const loadUsageData = async () => {
    try {
      // Get user's team
      const { data: teamMember } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id)
        .single();

      if (teamMember) {
        // Get document count
        const { count: docCount } = await supabase
          .from('documents')
          .select('*', { count: 'exact', head: true })
          .eq('team_id', teamMember.team_id);

        // Get team member count
        const { count: memberCount } = await supabase
          .from('team_members')
          .select('*', { count: 'exact', head: true })
          .eq('team_id', teamMember.team_id);

        setDocumentCount(docCount || 0);
        setTeamMemberCount(memberCount || 0);
      }
    } catch (error) {
      console.error('Error loading usage data:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: displayName }
      });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen gradient-subtle py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Account Settings</h1>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Subscription
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="shadow-elegant border-0">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      {displayName ? displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{displayName || 'No name set'}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your display name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed currently
                    </p>
                  </div>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Profile
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription">
            <Card className="shadow-elegant border-0">
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>
                  Manage your subscription and billing information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg">
                  <div>
                    <h3 className="font-semibold">
                      {subscription?.subscribed 
                        ? `${subscription.tier || 'Premium'} Plan` 
                        : 'Free Plan'
                      }
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {subscription?.subscribed 
                        ? `Active until ${subscription.subscription_end ? new Date(subscription.subscription_end).toLocaleDateString() : 'N/A'}`
                        : "You're currently on the free plan"
                      }
                    </p>
                  </div>
                  <Badge variant={subscription?.subscribed ? 'default' : 'secondary'}>
                    {subscription?.subscribed ? subscription.tier || 'Premium' : 'Free'}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Documents</span>
                      <span className="text-muted-foreground">
                        {documentCount} / {subscription?.subscribed ? '∞' : '10'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Team Members</span>
                      <span className="text-muted-foreground">
                        {teamMemberCount} / {subscription?.subscribed ? '∞' : '5'}
                      </span>
                    </div>
                  </div>
                </div>

                <Button className="w-full">
                  Upgrade to Premium
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="shadow-elegant border-0">
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Manage your account security and privacy settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-card/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Password</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Change your password to keep your account secure
                    </p>
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </div>

                  <div className="p-4 bg-card/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Account Deletion</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Permanently delete your account and all associated data
                    </p>
                    <Button variant="destructive" size="sm">
                      Delete Account
                    </Button>
                  </div>

                  <div className="p-4 bg-card/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Sign Out</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Sign out of your account on this device
                    </p>
                    <Button variant="outline" size="sm" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};