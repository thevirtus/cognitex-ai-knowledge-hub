import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Eye, FileCheck, Users, Globe } from "lucide-react";

export const SecuritySection = () => {
  const securityFeatures = [
    {
      icon: Shield,
      title: "SOC 2 Type II",
      description: "Audited security controls"
    },
    {
      icon: Lock,
      title: "AES-256 Encryption",
      description: "Data encrypted at rest and in transit"
    },
    {
      icon: Eye,
      title: "GDPR Compliant",
      description: "European privacy standards"
    },
    {
      icon: FileCheck,
      title: "CCPA Ready",
      description: "California privacy compliance"
    },
    {
      icon: Users,
      title: "HIPAA Compliant",
      description: "Healthcare data protection"
    },
    {
      icon: Globe,
      title: "Zero Trust",
      description: "Never trust, always verify"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Enterprise-Grade Security
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your data is protected by the same security standards trusted by Fortune 500 companies
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {securityFeatures.map((feature, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-elegant transition-all duration-300 hover:scale-105 animate-fade-in-delayed"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-2">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Built for Enterprise Trust</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We understand that your knowledge is your competitive advantage. That's why we've built 
              Cognitex with security-first principles, ensuring your data remains private, secure, and under your control.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Regular Security Audits</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">24/7 Monitoring</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Incident Response</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Data Residency Options</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};