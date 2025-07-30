import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, MessageSquare, Database, Calendar, Mail, Video, Code, Workflow } from 'lucide-react';

export const Integrations = () => {
  const integrations = [
    {
      icon: FileText,
      name: 'Google Drive',
      description: 'Sync documents, spreadsheets, and presentations automatically',
      status: 'Available',
      category: 'Document Management',
      features: ['Real-time sync', 'Version control', 'Auto-import', 'Bi-directional sync']
    },
    {
      icon: FileText,
      name: 'Notion',
      description: 'Import pages, databases, and content from your Notion workspace',
      status: 'Available',
      category: 'Note Taking',
      features: ['Page import', 'Database sync', 'Block-level sync', 'Markdown support']
    },
    {
      icon: MessageSquare,
      name: 'Slack',
      description: 'Get notifications and search team conversations',
      status: 'Available',
      category: 'Communication',
      features: ['Message search', 'Channel sync', 'File sharing', 'Bot integration']
    },
    {
      icon: Video,
      name: 'Microsoft Teams',
      description: 'Integrate with Teams channels and file sharing',
      status: 'Coming Soon',
      category: 'Communication',
      features: ['Channel sync', 'Meeting notes', 'File integration', 'Chat history']
    },
    {
      icon: Mail,
      name: 'Gmail',
      description: 'Import and search through important email threads',
      status: 'Beta',
      category: 'Email',
      features: ['Email import', 'Thread analysis', 'Attachment sync', 'Smart filtering']
    },
    {
      icon: Calendar,
      name: 'Google Calendar',
      description: 'Sync meeting notes and agenda items',
      status: 'Available',
      category: 'Productivity',
      features: ['Meeting sync', 'Agenda import', 'Note linking', 'Reminder integration']
    },
    {
      icon: Database,
      name: 'Airtable',
      description: 'Connect databases and structured content',
      status: 'Coming Soon',
      category: 'Database',
      features: ['Table sync', 'Record import', 'Field mapping', 'Automation triggers']
    },
    {
      icon: Code,
      name: 'GitHub',
      description: 'Import documentation, wikis, and project files',
      status: 'Beta',
      category: 'Development',
      features: ['Repo sync', 'Wiki import', 'Issue tracking', 'Documentation sync']
    },
    {
      icon: Workflow,
      name: 'Zapier',
      description: 'Connect to 5000+ apps through Zapier automation',
      status: 'Available',
      category: 'Automation',
      features: ['Webhook triggers', 'Custom workflows', 'Data mapping', 'Event automation']
    }
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Available': return 'default';
      case 'Beta': return 'secondary';
      case 'Coming Soon': return 'outline';
      default: return 'secondary';
    }
  };

  const categories = [...new Set(integrations.map(i => i.category))];

  return (
    <div className="min-h-screen gradient-subtle py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Powerful Integrations
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect Cognitex with your favorite tools to create a unified knowledge hub. 
            Automatically sync content from all your productivity apps.
          </p>
        </div>

        {/* Integration Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {integrations.map((integration, index) => {
            const IconComponent = integration.icon;
            return (
              <Card key={index} className="shadow-elegant border-0 h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <IconComponent className="h-8 w-8 text-primary" />
                    <Badge variant={getStatusVariant(integration.status) as any}>
                      {integration.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{integration.name}</CardTitle>
                  <CardDescription>
                    {integration.description}
                  </CardDescription>
                  <Badge variant="outline" className="w-fit text-xs">
                    {integration.category}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 mb-4">
                    {integration.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    disabled={integration.status === 'Coming Soon'}
                  >
                    {integration.status === 'Available' && 'Connect'}
                    {integration.status === 'Beta' && 'Join Beta'}
                    {integration.status === 'Coming Soon' && 'Coming Soon'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Categories Overview */}
        <Card className="shadow-elegant border-0 mb-16">
          <CardHeader className="text-center">
            <CardTitle>Integration Categories</CardTitle>
            <CardDescription>
              We support integrations across all major productivity categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <div key={index} className="text-center p-4 bg-card/50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">{category}</h4>
                  <p className="text-xs text-muted-foreground">
                    {integrations.filter(i => i.category === category).length} integrations
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* API Access */}
        <Card className="shadow-elegant border-0">
          <CardHeader className="text-center">
            <CardTitle>Need a Custom Integration?</CardTitle>
            <CardDescription>
              Use our powerful API to build custom integrations for your specific needs
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <h4 className="font-semibold mb-2">REST API</h4>
                <p className="text-sm text-muted-foreground">
                  Full featured REST API for all platform functions
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Webhooks</h4>
                <p className="text-sm text-muted-foreground">
                  Real-time notifications for content changes
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">SDK Support</h4>
                <p className="text-sm text-muted-foreground">
                  Client libraries for popular programming languages
                </p>
              </div>
            </div>
            <div className="space-x-4">
              <Button>View API Documentation</Button>
              <Button variant="outline">Request Integration</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};