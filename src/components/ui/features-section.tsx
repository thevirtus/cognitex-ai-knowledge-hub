import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Zap, Shield, RefreshCw, Users, Globe } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Search",
      description: "Natural language queries that understand context and intent, delivering precise results from across your entire knowledge base."
    },
    {
      icon: Zap,
      title: "Smart Indexing Across Platforms",
      description: "Automatically organizes and cross-references content from 50+ integrations, creating a unified knowledge graph."
    },
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description: "SOC 2 Type II, GDPR, CCPA, and HIPAA compliant with AES-256 encryption and zero-trust architecture."
    },
    {
      icon: RefreshCw,
      title: "Real-Time Sync & Updates",
      description: "Keep your knowledge base current with instant synchronization and intelligent change detection."
    },
    {
      icon: Users,
      title: "Role-Based Access Control",
      description: "Granular permissions ensure team members see only what they need while maintaining security boundaries."
    },
    {
      icon: Globe,
      title: "Universal Integration",
      description: "Connect to Notion, Google Drive, Slack, GitHub, Confluence, and 45+ other platforms your team already uses."
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Powerful Features for Modern Teams
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything your team needs to unlock the full potential of your collective knowledge
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-elegant transition-all duration-300 hover:scale-105 animate-fade-in-delayed border-muted/20"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};