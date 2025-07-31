import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Code, Key, ExternalLink, Copy, CheckCircle, AlertCircle } from 'lucide-react';

export const API = () => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateApiKey = () => {
    const key = 'cgx_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiKey(key);
    toast({
      title: "API Key Generated",
      description: "Your new API key has been generated. Keep it secure!",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied to clipboard",
      description: "The code has been copied to your clipboard.",
    });
  };

  const codeExamples = {
    javascript: `// Initialize Cognitex API client
const cognitex = new CognitexAPI({
  apiKey: '${apiKey || 'your-api-key-here'}',
  baseURL: 'https://api.cognitex.ai/v1'
});

// Upload and analyze a document
const result = await cognitex.documents.create({
  title: 'My Document',
  content: 'Document content here...',
  teamId: 'your-team-id'
});

// Query your knowledge base
const answer = await cognitex.chat.query({
  question: 'What is our company policy on remote work?',
  teamId: 'your-team-id'
});`,
    
    python: `import cognitex

# Initialize client
client = cognitex.Client(
    api_key="${apiKey || 'your-api-key-here'}",
    base_url="https://api.cognitex.ai/v1"
)

# Upload document
document = client.documents.create(
    title="My Document",
    content="Document content here...",
    team_id="your-team-id"
)

# Query knowledge base
response = client.chat.query(
    question="What is our company policy on remote work?",
    team_id="your-team-id"
)`,
    
    curl: `# Upload a document
curl -X POST "https://api.cognitex.ai/v1/documents" \\
  -H "Authorization: Bearer ${apiKey || 'your-api-key-here'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "My Document",
    "content": "Document content here...",
    "teamId": "your-team-id"
  }'

# Query knowledge base
curl -X POST "https://api.cognitex.ai/v1/chat/query" \\
  -H "Authorization: Bearer ${apiKey || 'your-api-key-here'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "question": "What is our company policy on remote work?",
    "teamId": "your-team-id"
  }'`
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground">API Documentation</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Integrate Cognitex's AI-powered knowledge management capabilities directly into your applications with our RESTful API
          </p>
        </div>

        {/* API Key Generation */}
        <Card className="mb-12 shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="h-5 w-5 mr-2" />
              API Key Management
            </CardTitle>
            <CardDescription>
              Generate and manage your API keys for accessing Cognitex services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="api-key">Your API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="api-key"
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    placeholder="Generate an API key to get started"
                    readOnly
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setShowKey(!showKey)}
                    disabled={!apiKey}
                  >
                    {showKey ? <AlertCircle className="h-4 w-4" /> : <Key className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => copyToClipboard(apiKey)}
                    disabled={!apiKey}
                  >
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button onClick={generateApiKey}>
                Generate New Key
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              Keep your API key secure and never share it in client-side code
            </div>
          </CardContent>
        </Card>

        {/* Code Examples */}
        <Card className="mb-12 shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="h-5 w-5 mr-2" />
              Code Examples
            </CardTitle>
            <CardDescription>
              Get started quickly with these code examples in your preferred language
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="javascript" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="curl">cURL</TabsTrigger>
              </TabsList>
              
              {Object.entries(codeExamples).map(([lang, code]) => (
                <TabsContent key={lang} value={lang} className="mt-4">
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{code}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(code)}
                    >
                      {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <Card className="shadow-elegant border-0">
            <CardHeader>
              <Code className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Documents API</CardTitle>
              <CardDescription>
                Upload, manage, and retrieve documents from your knowledge base
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">POST</Badge>
                <code className="text-sm">/documents</code>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">GET</Badge>
                <code className="text-sm">/documents/:id</code>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="destructive">DELETE</Badge>
                <code className="text-sm">/documents/:id</code>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0">
            <CardHeader>
              <Code className="h-8 w-8 text-primary mb-2" />
              <CardTitle>AI Chat API</CardTitle>
              <CardDescription>
                Query your knowledge base using natural language
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">POST</Badge>
                <code className="text-sm">/chat/query</code>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">GET</Badge>
                <code className="text-sm">/chat/history</code>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0">
            <CardHeader>
              <Code className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Teams API</CardTitle>
              <CardDescription>
                Manage team members and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline">GET</Badge>
                <code className="text-sm">/teams</code>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">POST</Badge>
                <code className="text-sm">/teams/:id/invite</code>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Resources */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="shadow-elegant border-0">
            <CardHeader>
              <CardTitle>Full Documentation</CardTitle>
              <CardDescription>
                Complete API reference with detailed examples
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => window.open('https://docs.cognitex.ai/api', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Full Docs
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0">
            <CardHeader>
              <CardTitle>SDKs & Libraries</CardTitle>
              <CardDescription>
                Official SDKs for popular programming languages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => window.open('https://github.com/cognitex-ai/sdks', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Download SDKs
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0">
            <CardHeader>
              <CardTitle>Support</CardTitle>
              <CardDescription>
                Get help with API integration and troubleshooting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => window.open('/contact', '_self')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};