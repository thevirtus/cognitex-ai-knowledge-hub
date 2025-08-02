import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, MessageSquare, Database, Calendar, Mail, Video, Code, Workflow, ExternalLink } from 'lucide-react';

const integrationData = {
  'google-drive': {
    icon: FileText,
    name: 'Google Drive',
    status: 'Coming Soon',
    description: 'Sync documents, spreadsheets, and presentations automatically with your Cognitex knowledge base.',
    features: ['Real-time sync', 'Version control', 'Auto-import', 'Bi-directional sync'],
    setupSteps: [
      'Connect your Google account via OAuth',
      'Select folders and files to sync',
      'Configure sync frequency and settings',
      'Start automatic document importing'
    ],
    benefits: [
      'Automatically import Google Docs, Sheets, and Slides',
      'Keep your knowledge base up-to-date with real-time changes',
      'Search across all your Google Drive content from Cognitex',
      'Maintain version history and collaboration features'
    ],
    comingSoon: true
  },
  'notion': {
    icon: FileText,
    name: 'Notion',
    status: 'Available',
    description: 'Import pages, databases, and content from your Notion workspace into Cognitex.',
    features: ['Page import', 'Database sync', 'Block-level sync', 'Markdown support'],
    setupSteps: [
      'Create a Notion integration in your workspace',
      'Provide your Notion API key',
      'Select pages and databases to import',
      'Configure import settings and frequency'
    ],
    benefits: [
      'Import all your Notion pages and databases',
      'Maintain formatting and structure',
      'Sync changes automatically',
      'Search across imported Notion content'
    ]
  },
  'slack': {
    icon: MessageSquare,
    name: 'Slack',
    status: 'Available',
    description: 'Get notifications and search team conversations from your Slack workspace.',
    features: ['Message search', 'Channel sync', 'File sharing', 'Bot integration'],
    setupSteps: [
      'Install the Cognitex app in your Slack workspace',
      'Authorize permissions for channels and messages',
      'Configure which channels to sync',
      'Set up notification preferences'
    ],
    benefits: [
      'Search through team conversations',
      'Import shared files and documents',
      'Get AI insights from team discussions',
      'Receive notifications in Slack'
    ]
  },
  'microsoft-teams': {
    icon: Video,
    name: 'Microsoft Teams',
    status: 'Coming Soon',
    description: 'Integrate with Teams channels and file sharing for seamless collaboration.',
    features: ['Channel sync', 'Meeting notes', 'File integration', 'Chat history'],
    setupSteps: [
      'Install Cognitex app from Teams App Store',
      'Connect your Office 365 account',
      'Select teams and channels to sync',
      'Configure sync and notification settings'
    ],
    benefits: [
      'Import meeting notes and recordings',
      'Sync shared files from Teams',
      'Search across team conversations',
      'AI-powered meeting summaries'
    ],
    comingSoon: true
  },
  'gmail': {
    icon: Mail,
    name: 'Gmail',
    status: 'Beta',
    description: 'Import and search through important email threads and attachments.',
    features: ['Email import', 'Thread analysis', 'Attachment sync', 'Smart filtering'],
    setupSteps: [
      'Connect your Gmail account via OAuth',
      'Set up email filtering rules',
      'Configure which emails to import',
      'Enable attachment extraction'
    ],
    benefits: [
      'Search through important email threads',
      'Extract knowledge from email conversations',
      'Import email attachments automatically',
      'AI-powered email insights'
    ]
  },
  'google-calendar': {
    icon: Calendar,
    name: 'Google Calendar',
    status: 'Available',
    description: 'Sync meeting notes and agenda items from your calendar events.',
    features: ['Meeting sync', 'Agenda import', 'Note linking', 'Reminder integration'],
    setupSteps: [
      'Connect your Google Calendar account',
      'Select calendars to sync',
      'Configure meeting note templates',
      'Set up automatic agenda creation'
    ],
    benefits: [
      'Automatically create meeting notes',
      'Link calendar events to documents',
      'Import agenda items and action items',
      'Track meeting outcomes and decisions'
    ]
  },
  'airtable': {
    icon: Database,
    name: 'Airtable',
    status: 'Coming Soon',
    description: 'Connect databases and structured content from your Airtable bases.',
    features: ['Table sync', 'Record import', 'Field mapping', 'Automation triggers'],
    setupSteps: [
      'Generate an Airtable API key',
      'Select bases and tables to sync',
      'Configure field mapping settings',
      'Set up sync frequency and triggers'
    ],
    benefits: [
      'Import structured data from Airtable',
      'Maintain relationships between records',
      'Sync changes automatically',
      'Search across database content'
    ],
    comingSoon: true
  },
  'github': {
    icon: Code,
    name: 'GitHub',
    status: 'Beta',
    description: 'Import documentation, wikis, and project files from your repositories.',
    features: ['Repo sync', 'Wiki import', 'Issue tracking', 'Documentation sync'],
    setupSteps: [
      'Connect your GitHub account',
      'Select repositories to sync',
      'Configure file type filters',
      'Set up documentation import rules'
    ],
    benefits: [
      'Import README files and documentation',
      'Sync wiki pages and project notes',
      'Track issues and project status',
      'Search across development documentation'
    ]
  },
  'zapier': {
    icon: Workflow,
    name: 'Zapier',
    status: 'Available',
    description: 'Connect to 5000+ apps through Zapier automation workflows.',
    features: ['Webhook triggers', 'Custom workflows', 'Data mapping', 'Event automation'],
    setupSteps: [
      'Create a Zapier account if needed',
      'Find Cognitex in the Zapier app directory',
      'Set up triggers and actions',
      'Configure data mapping and filters'
    ],
    benefits: [
      'Connect to thousands of apps',
      'Automate data import workflows',
      'Create custom integration scenarios',
      'Trigger actions based on events'
    ]
  }
};

export const IntegrationDetail = () => {
  const { name } = useParams<{ name: string }>();
  const integration = name ? integrationData[name as keyof typeof integrationData] : null;

  if (!integration) {
    return (
      <div className="min-h-screen gradient-subtle py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Integration Not Found</h1>
          <p className="text-xl text-muted-foreground mb-8">
            The integration you're looking for doesn't exist.
          </p>
          <Link to="/integrations">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Integrations
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = integration.icon;

  return (
    <div className="min-h-screen gradient-subtle py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/integrations" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Integrations
          </Link>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
              <IconComponent className="h-8 w-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-4xl font-bold">{integration.name}</h1>
                <Badge variant={
                  integration.status === 'Available' ? 'default' : 
                  integration.status === 'Beta' ? 'secondary' : 'outline'
                }>
                  {integration.status}
                </Badge>
              </div>
              <p className="text-xl text-muted-foreground">{integration.description}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Setup Instructions */}
          <Card className="shadow-elegant border-0">
            <CardHeader>
              <CardTitle>How to Connect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="space-y-3">
                {integration.setupSteps.map((step, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-sm">{step}</span>
                  </li>
                ))}
              </ol>
              
              {integration.status === 'Coming Soon' ? (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Coming Soon</h4>
                  <p className="text-sm text-muted-foreground">
                    This integration is currently in development. Contact us at{' '}
                    <a href="mailto:connectcognitex@gmail.com" className="text-primary hover:underline">
                      connectcognitex@gmail.com
                    </a>{' '}
                    to be notified when it's available.
                  </p>
                </div>
              ) : integration.status === 'Beta' ? (
                <div className="mt-6">
                  <Button className="w-full" onClick={() => window.open('mailto:connectcognitex@gmail.com?subject=Beta Access Request - ' + integration.name)}>
                    <Mail className="h-4 w-4 mr-2" />
                    Request Beta Access
                  </Button>
                </div>
              ) : (
                <div className="mt-6">
                  <Button className="w-full" onClick={() => window.open('/auth')}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect {integration.name}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="shadow-elegant border-0">
            <CardHeader>
              <CardTitle>Key Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {integration.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="shadow-elegant border-0">
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {integration.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card className="shadow-elegant border-0">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Having trouble setting up this integration? Our team is here to help.
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full" onClick={() => window.open('mailto:connectcognitex@gmail.com?subject=Integration Support - ' + integration.name)}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </Button>
                <Button variant="outline" className="w-full" onClick={() => window.open('/contact')}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};