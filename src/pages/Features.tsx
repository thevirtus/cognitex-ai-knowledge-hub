import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, FileText, MessageSquare, Users, Shield, Zap, Search, BarChart3, Clock, Globe } from 'lucide-react';

export const Features = () => {
  const features = [
    {
      icon: FileText,
      title: 'Smart Document Management',
      description: 'Upload, organize, and automatically categorize your team\'s documents with AI-powered tagging and intelligent search.',
      benefits: ['Automatic categorization', 'Version control', 'Bulk operations', 'Smart search']
    },
    {
      icon: MessageSquare,
      title: 'AI-Powered Chat',
      description: 'Ask questions about your documents and get intelligent, contextual answers instantly from your knowledge base.',
      benefits: ['Natural language queries', 'Contextual responses', 'Source citations', 'Multi-document insights']
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Invite team members, assign roles, and collaborate seamlessly on your shared knowledge base.',
      benefits: ['Role-based access', 'Real-time collaboration', 'Activity tracking', 'Team analytics']
    },
    {
      icon: Brain,
      title: 'Advanced AI Summaries',
      description: 'Generate intelligent summaries, extract key insights, and identify important themes across your documents.',
      benefits: ['Auto-summaries', 'Key insight extraction', 'Theme identification', 'Trend analysis']
    },
    {
      icon: Search,
      title: 'Intelligent Search',
      description: 'Find exactly what you need with semantic search that understands context and meaning.',
      benefits: ['Semantic search', 'Fuzzy matching', 'Filter options', 'Search history']
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with encryption, access controls, and compliance features to protect your data.',
      benefits: ['End-to-end encryption', 'SSO integration', 'Audit logs', 'Compliance ready']
    },
    {
      icon: Zap,
      title: 'Third-party Integrations',
      description: 'Connect with Google Drive, Notion, Slack, and other productivity tools to sync your data automatically.',
      benefits: ['Google Drive sync', 'Notion integration', 'Slack notifications', 'API access']
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Track usage patterns, popular content, and team engagement with comprehensive analytics.',
      benefits: ['Usage analytics', 'Content insights', 'Team metrics', 'Custom reports']
    },
    {
      icon: Clock,
      title: 'Version History',
      description: 'Track changes, restore previous versions, and maintain a complete history of your documents.',
      benefits: ['Full version history', 'Change tracking', 'Restore points', 'Diff visualization']
    },
    {
      icon: Globe,
      title: 'Multi-language Support',
      description: 'Work with documents in multiple languages with AI that understands and processes global content.',
      benefits: ['50+ languages', 'Auto-translation', 'Cross-language search', 'Localized UI']
    }
  ];

  return (
    <div className="min-h-screen gradient-subtle py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Powerful Features for Modern Teams
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover how Cognitex transforms your team's knowledge management with cutting-edge AI and intelligent collaboration tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="shadow-elegant border-0 h-full">
                <CardHeader>
                  <IconComponent className="h-8 w-8 text-primary mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of teams already using Cognitex to unlock their collective intelligence.
          </p>
        </div>
      </div>
    </div>
  );
};