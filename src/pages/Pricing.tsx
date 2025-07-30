import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for small teams getting started',
      popular: false,
      features: [
        { name: 'Up to 5 team members', included: true },
        { name: '10 documents', included: true },
        { name: 'Basic document management', included: true },
        { name: 'Email support', included: true },
        { name: 'AI document summaries', included: false },
        { name: 'AI chat interface', included: false },
        { name: 'Unlimited storage', included: false },
        { name: 'Third-party integrations', included: false },
        { name: 'Priority support', included: false }
      ],
      cta: 'Get Started Free',
      ctaLink: '/auth'
    },
    {
      name: 'Premium',
      price: '$19',
      period: '/month per user',
      description: 'For growing teams that need AI-powered insights',
      popular: true,
      features: [
        { name: 'Unlimited team members', included: true },
        { name: 'Unlimited documents', included: true },
        { name: 'Advanced document management', included: true },
        { name: 'AI document summaries', included: true },
        { name: 'AI chat interface', included: true },
        { name: 'Unlimited storage', included: true },
        { name: 'Third-party integrations', included: true },
        { name: 'Priority support', included: true },
        { name: 'Advanced analytics', included: true }
      ],
      cta: 'Start Premium Trial',
      ctaLink: '/auth'
    }
  ];

  return (
    <div className="min-h-screen gradient-subtle py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your team's needs. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`shadow-elegant border-0 relative ${
                plan.popular ? 'ring-2 ring-primary' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className={feature.included ? 'text-foreground' : 'text-muted-foreground'}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-6">
                  <Link to={plan.ctaLink} className="w-full block">
                    <Button 
                      className={`w-full shadow-glow transition-smooth ${
                        plan.popular ? '' : 'variant-outline'
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <p className="text-sm text-muted-foreground">
            Questions about pricing? <Link to="/contact" className="text-primary hover:underline">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  );
};