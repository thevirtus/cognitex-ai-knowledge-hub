import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: 'Free',
      monthlyPrice: '$0',
      yearlyPrice: '$0',
      period: '/month',
      description: 'Perfect for small teams getting started',
      popular: false,
      features: [
        { name: 'Up to 5 team members', included: true },
        { name: '10 documents', included: true },
        { name: 'Basic document management', included: true },
        { name: '5GB storage', included: true },
        { name: 'Email support', included: true },
        { name: 'AI document summaries', included: false },
        { name: 'AI chat interface', included: false },
        { name: 'Third-party integrations', included: false },
        { name: 'Advanced analytics', included: false },
        { name: 'Priority support', included: false },
        { name: 'Custom workflows', included: false },
        { name: 'API access', included: false }
      ],
      cta: 'Get Started Free',
      ctaLink: '/auth'
    },
    {
      name: 'Premium',
      monthlyPrice: '$30',
      yearlyPrice: '$25',
      period: '/month per user',
      description: 'For growing teams that need AI-powered insights',
      popular: true,
      features: [
        { name: 'Unlimited team members', included: true },
        { name: 'Unlimited documents', included: true },
        { name: 'Advanced document management', included: true },
        { name: '100GB storage per user', included: true },
        { name: 'AI document summaries', included: true },
        { name: 'AI chat interface', included: true },
        { name: 'Basic integrations (3 apps)', included: true },
        { name: 'Team analytics', included: true },
        { name: 'Priority email support', included: true },
        { name: 'Custom workflows', included: false },
        { name: 'Advanced integrations', included: false },
        { name: 'API access', included: false }
      ],
      cta: 'Start Premium Trial',
      ctaLink: '/auth'
    },
    {
      name: 'Enterprise',
      monthlyPrice: '$100',
      yearlyPrice: '$80',
      period: '/month per user',
      description: 'For organizations requiring maximum capabilities',
      popular: false,
      features: [
        { name: 'Everything in Premium', included: true },
        { name: 'Unlimited storage', included: true },
        { name: 'All third-party integrations', included: true },
        { name: 'Custom workflows & automation', included: true },
        { name: 'Full API access', included: true },
        { name: 'Advanced analytics & reporting', included: true },
        { name: 'Single sign-on (SSO)', included: true },
        { name: 'Dedicated account manager', included: true },
        { name: '24/7 phone support', included: true },
        { name: 'Custom integrations', included: true },
        { name: 'On-premise deployment', included: true },
        { name: 'Advanced security features', included: true }
      ],
      cta: 'Contact Sales',
      ctaLink: '/contact'
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.name === 'Free') return plan.monthlyPrice;
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (plan.name === 'Free') return null;
    const monthly = parseInt(plan.monthlyPrice.replace('$', ''));
    const yearly = parseInt(plan.yearlyPrice.replace('$', ''));
    const savings = Math.round(((monthly - yearly) / monthly) * 100);
    return savings;
  };

  return (
    <div className="min-h-screen gradient-subtle py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the plan that fits your team's needs. Upgrade or downgrade at any time.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Label htmlFor="billing-toggle" className={!isYearly ? 'font-semibold' : ''}>
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <Label htmlFor="billing-toggle" className={isYearly ? 'font-semibold' : ''}>
              Yearly
            </Label>
            {isYearly && (
              <Badge variant="secondary" className="ml-2">
                Save up to 20%
              </Badge>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`shadow-elegant border-0 relative ${
                plan.popular ? 'ring-2 ring-primary scale-105' : ''
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
                  <span className="text-4xl font-bold text-foreground">{getPrice(plan)}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                  {isYearly && getSavings(plan) && (
                    <div className="text-sm text-green-600 font-medium mt-1">
                      Save {getSavings(plan)}% yearly
                    </div>
                  )}
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

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="p-6 bg-card/50 rounded-lg">
              <h3 className="font-semibold mb-2">Can I change plans at any time?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                and we'll prorate any billing differences.
              </p>
            </div>
            <div className="p-6 bg-card/50 rounded-lg">
              <h3 className="font-semibold mb-2">What happens to my data if I cancel?</h3>
              <p className="text-muted-foreground text-sm">
                Your data remains accessible for 30 days after cancellation. You can export all your 
                documents and data during this period.
              </p>
            </div>
            <div className="p-6 bg-card/50 rounded-lg">
              <h3 className="font-semibold mb-2">Do you offer custom enterprise plans?</h3>
              <p className="text-muted-foreground text-sm">
                Yes! We offer custom enterprise plans with additional features, dedicated support, 
                and flexible pricing. Contact our sales team to discuss your needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};