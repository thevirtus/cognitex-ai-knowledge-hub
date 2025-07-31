import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Users, Target, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <div className="min-h-screen gradient-subtle pt-20">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Brain className="h-16 w-16 text-primary mr-4" />
            <h1 className="text-5xl font-bold text-foreground">About Cognitex</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            We're on a mission to transform how teams manage and leverage their collective knowledge using cutting-edge AI technology.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-foreground">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                At Cognitex, we believe that every team's collective knowledge is their most valuable asset. Yet too often, 
                this knowledge remains scattered across documents, emails, and individual minds, making it difficult to access 
                and leverage when needed most.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                We're building the future of knowledge management - where AI doesn't replace human intelligence, 
                but amplifies it, making every team member more effective and every organization more intelligent.
              </p>
              <Button 
                size="lg" 
                className="shadow-glow transition-smooth"
                onClick={() => window.open('/auth', '_self')}
              >
                Join Our Mission
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-6">
              <Card className="shadow-elegant border-0">
                <CardHeader>
                  <Target className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Our Vision</CardTitle>
                  <CardDescription>
                    A world where every team can instantly access, understand, and build upon their collective knowledge.
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="shadow-elegant border-0">
                <CardHeader>
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Our Values</CardTitle>
                  <CardDescription>
                    Innovation, transparency, user-centricity, and the belief that great teams achieve extraordinary things together.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Trusted by Growing Teams Worldwide
          </h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Documents Processed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Teams</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">AI Conversations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Built by Experts
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-elegant border-0 text-center">
              <CardHeader>
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Brain className="h-10 w-10 text-primary" />
                </div>
                <CardTitle>AI Research</CardTitle>
                <CardDescription>
                  Our team includes PhD researchers from top universities with expertise in natural language processing and machine learning.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="shadow-elegant border-0 text-center">
              <CardHeader>
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <CardTitle>Enterprise Experience</CardTitle>
                <CardDescription>
                  Former leaders from Google, Microsoft, and other tech giants who understand enterprise knowledge management challenges.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="shadow-elegant border-0 text-center">
              <CardHeader>
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-10 w-10 text-primary" />
                </div>
                <CardTitle>Security Experts</CardTitle>
                <CardDescription>
                  Cybersecurity professionals ensuring your team's knowledge remains protected with enterprise-grade security.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-foreground">
            Get in Touch
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Have questions about Cognitex? Want to learn more about how we can help your team? 
            We'd love to hear from you.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
            <Button 
              size="lg" 
              className="shadow-glow transition-smooth"
              onClick={() => window.open('/auth', '_self')}
            >
              Start Free Trial
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};