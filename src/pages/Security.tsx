import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, Database, Globe, FileCheck, Users, AlertTriangle } from 'lucide-react';

export const Security = () => {
  const securityFeatures = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All data is encrypted in transit and at rest using AES-256 encryption standards.',
      status: 'Implemented'
    },
    {
      icon: Shield,
      title: 'SOC 2 Type II Compliance',
      description: 'We maintain SOC 2 Type II compliance with regular third-party audits.',
      status: 'Certified'
    },
    {
      icon: Database,
      title: 'Data Residency',
      description: 'Choose where your data is stored with multiple regional data centers.',
      status: 'Available'
    },
    {
      icon: Users,
      title: 'Role-Based Access Control',
      description: 'Granular permissions system to control who can access what information.',
      status: 'Implemented'
    },
    {
      icon: Eye,
      title: 'Audit Logging',
      description: 'Comprehensive audit trails for all user actions and data access.',
      status: 'Implemented'
    },
    {
      icon: Globe,
      title: 'GDPR & CCPA Compliant',
      description: 'Full compliance with global privacy regulations and data protection laws.',
      status: 'Certified'
    }
  ];

  const certifications = [
    { name: 'SOC 2 Type II', description: 'Security, availability, and confidentiality' },
    { name: 'ISO 27001', description: 'Information security management' },
    { name: 'GDPR', description: 'European data protection regulation' },
    { name: 'CCPA', description: 'California consumer privacy act' },
    { name: 'HIPAA', description: 'Healthcare information privacy' }
  ];

  return (
    <div className="min-h-screen gradient-subtle py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Enterprise-Grade Security
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your data security is our top priority. We implement industry-leading security measures 
            to protect your team's knowledge and maintain your trust.
          </p>
        </div>

        {/* Security Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {securityFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="shadow-elegant border-0">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <IconComponent className="h-8 w-8 text-primary" />
                    <Badge variant="secondary" className="text-xs">
                      {feature.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Security Practices */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="shadow-elegant border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-6 w-6 text-primary" />
                Security Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Data Protection</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• AES-256 encryption for data at rest</li>
                  <li>• TLS 1.3 for data in transit</li>
                  <li>• Regular security assessments</li>
                  <li>• Automated backup systems</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Access Control</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Multi-factor authentication</li>
                  <li>• Single sign-on (SSO) support</li>
                  <li>• Role-based permissions</li>
                  <li>• Session management</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-primary" />
                Incident Response
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">24/7 Monitoring</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Real-time threat detection</li>
                  <li>• Automated incident response</li>
                  <li>• Security team on standby</li>
                  <li>• Immediate customer notification</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Business Continuity</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 99.9% uptime guarantee</li>
                  <li>• Disaster recovery plan</li>
                  <li>• Redundant infrastructure</li>
                  <li>• Regular backup testing</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certifications */}
        <Card className="shadow-elegant border-0">
          <CardHeader className="text-center">
            <CardTitle>Certifications & Compliance</CardTitle>
            <CardDescription>
              We maintain the highest standards of security and compliance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4">
              {certifications.map((cert, index) => (
                <div key={index} className="text-center p-4 bg-card/50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">{cert.name}</h4>
                  <p className="text-xs text-muted-foreground">{cert.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Security Team */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            Questions About Security?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our security team is available to discuss your specific requirements and answer any questions about our security practices.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Email us at: <span className="font-semibold">security@cognitex.ai</span>
            </p>
            <p className="text-sm text-muted-foreground">
              For security issues: <span className="font-semibold">security-report@cognitex.ai</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};