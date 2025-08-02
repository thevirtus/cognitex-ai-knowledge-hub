import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      toast({
        title: "Payment successful!",
        description: "Your subscription has been activated. Welcome to Cognitex Premium!",
      });
    }
  }, [searchParams, toast]);

  return (
    <div className="min-h-screen gradient-subtle flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-elegant border-0">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-foreground">Payment Successful!</CardTitle>
          <CardDescription>
            Thank you for upgrading to Cognitex Premium. Your subscription is now active.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-card/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">What's next?</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Unlimited AI chat messages</li>
              <li>• Advanced document management</li>
              <li>• Team collaboration features</li>
              <li>• Priority customer support</li>
            </ul>
          </div>
          <Button 
            className="w-full" 
            onClick={() => navigate('/')}
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};