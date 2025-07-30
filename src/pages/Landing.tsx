import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Users, FileText, MessageSquare, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Landing = () => {
  return (
    <div className="min-h-screen gradient-subtle">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Brain className="h-12 w-12 text-primary mr-4" />
            <h1 className="text-5xl font-bold text-foreground">Cognitex</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Transform your team's knowledge into intelligent insights with AI-powered document management and chat
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="shadow-glow transition-smooth">
                Get Started Free
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Powerful Features for Modern Teams
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-elegant border-0">
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Smart Document Management</CardTitle>
                <CardDescription>
                  Upload, organize, and AI-summarize your team's documents automatically
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="shadow-elegant border-0">
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <CardTitle>AI-Powered Chat</CardTitle>
                <CardDescription>
                  Ask questions about your documents and get intelligent answers instantly
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="shadow-elegant border-0">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Invite team members, manage roles, and collaborate on knowledge seamlessly
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="shadow-elegant border-0">
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Enterprise Security</CardTitle>
                <CardDescription>
                  Bank-level security with role-based access control and data encryption
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="shadow-elegant border-0">
              <CardHeader>
                <Zap className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Integrations</CardTitle>
                <CardDescription>
                  Connect with Google Drive, Notion, Slack, and other productivity tools
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="shadow-elegant border-0">
              <CardHeader>
                <Brain className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Advanced AI</CardTitle>
                <CardDescription>
                  Leverage cutting-edge AI to extract insights from your team's knowledge
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Ready to Supercharge Your Team's Knowledge?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of teams already using Cognitex to unlock their collective intelligence
          </p>
          <Link to="/auth">
            <Button size="lg" className="shadow-glow transition-smooth">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};