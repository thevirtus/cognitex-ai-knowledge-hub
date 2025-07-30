import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Database, Zap, Shield, Globe, Terminal } from 'lucide-react';

export const API = () => {
  const endpoints = [
    {
      method: 'GET',
      path: '/api/v1/documents',
      description: 'List all documents',
      auth: 'Required'
    },
    {
      method: 'POST',
      path: '/api/v1/documents',
      description: 'Create a new document',
      auth: 'Required'
    },
    {
      method: 'PUT',
      path: '/api/v1/documents/{id}',
      description: 'Update a document',
      auth: 'Required'
    },
    {
      method: 'DELETE',
      path: '/api/v1/documents/{id}',
      description: 'Delete a document',
      auth: 'Required'
    },
    {
      method: 'POST',
      path: '/api/v1/documents/{id}/summarize',
      description: 'Generate AI summary',
      auth: 'Required'
    },
    {
      method: 'POST',
      path: '/api/v1/chat',
      description: 'Chat with documents',
      auth: 'Required'
    }
  ];

  const features = [
    {
      icon: Database,
      title: 'Full CRUD Operations',
      description: 'Complete access to all document and team management functions'
    },
    {
      icon: Zap,
      title: 'Real-time Webhooks',
      description: 'Get notified instantly when content changes or events occur'
    },
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'OAuth 2.0 and API key authentication with rate limiting'
    },
    {
      icon: Globe,
      title: 'RESTful Design',
      description: 'Standard HTTP methods with JSON responses and pagination'
    }
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-500';
      case 'POST': return 'bg-blue-500';
      case 'PUT': return 'bg-yellow-500';
      case 'DELETE': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen gradient-subtle py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Cognitex API
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Build powerful integrations with our comprehensive REST API. Access all platform features 
            programmatically and create custom workflows for your team.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="shadow-elegant border-0 text-center">
                <CardHeader>
                  <IconComponent className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* API Documentation */}
        <Card className="shadow-elegant border-0 mb-16">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-6 w-6 text-primary" />
              API Reference
            </CardTitle>
            <CardDescription>
              Explore our API endpoints and learn how to integrate with Cognitex
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="endpoints" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
                <TabsTrigger value="authentication">Authentication</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
              </TabsList>
              
              <TabsContent value="endpoints" className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Available Endpoints</h3>
                <div className="space-y-3">
                  {endpoints.map((endpoint, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-card/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <Badge className={`${getMethodColor(endpoint.method)} text-white px-3 py-1`}>
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {endpoint.path}
                        </code>
                        <span className="text-sm text-muted-foreground">
                          {endpoint.description}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {endpoint.auth}
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="authentication" className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Authentication Methods</h3>
                <div className="space-y-6">
                  <div className="p-4 bg-card/50 rounded-lg">
                    <h4 className="font-semibold mb-2">API Key Authentication</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Include your API key in the Authorization header:
                    </p>
                    <code className="block bg-muted p-3 rounded text-sm">
                      Authorization: Bearer your-api-key-here
                    </code>
                  </div>
                  
                  <div className="p-4 bg-card/50 rounded-lg">
                    <h4 className="font-semibold mb-2">OAuth 2.0</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      For user-facing applications, use OAuth 2.0 authorization code flow:
                    </p>
                    <code className="block bg-muted p-3 rounded text-sm">
                      GET /oauth/authorize?client_id=your-client-id&response_type=code
                    </code>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="examples" className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Code Examples</h3>
                <div className="space-y-6">
                  <div className="p-4 bg-card/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Create a Document</h4>
                    <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
{`curl -X POST "https://api.cognitex.ai/v1/documents" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "My Document",
    "content": "Document content here",
    "team_id": "team-uuid"
  }'`}
                    </pre>
                  </div>
                  
                  <div className="p-4 bg-card/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Generate AI Summary</h4>
                    <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
{`curl -X POST "https://api.cognitex.ai/v1/documents/doc-id/summarize" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json"`}
                    </pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* SDKs and Libraries */}
        <Card className="shadow-elegant border-0 mb-16">
          <CardHeader className="text-center">
            <CardTitle>SDKs & Libraries</CardTitle>
            <CardDescription>
              Official client libraries for popular programming languages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              {['JavaScript', 'Python', 'Node.js', 'Go'].map((lang, index) => (
                <div key={index} className="text-center p-4 bg-card/50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">{lang}</h4>
                  <Badge variant="outline" className="text-xs">
                    Coming Soon
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Get Started */}
        <Card className="shadow-elegant border-0">
          <CardHeader className="text-center">
            <CardTitle>Ready to Get Started?</CardTitle>
            <CardDescription>
              Generate your API key and start building with Cognitex today
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-x-4">
              <Button className="shadow-glow transition-smooth">
                Generate API Key
              </Button>
              <Button variant="outline">
                View Full Documentation
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Need help? Contact our developer support team at 
              <span className="font-semibold"> api@cognitex.ai</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};