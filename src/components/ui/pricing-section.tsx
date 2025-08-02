import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Zap, Building, ArrowRight } from "lucide-react";

export const PricingSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and scale as your team grows. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Beta */}
          <Card className="relative overflow-hidden hover:shadow-elegant transition-all duration-300 animate-fade-in-delayed">
            <CardHeader className="text-center p-8 bg-gradient-to-b from-primary/5 to-transparent">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl mb-2">Free Beta Access</CardTitle>
              <div className="text-4xl font-bold mb-2">$0</div>
              <p className="text-muted-foreground">Perfect for getting started</p>
            </CardHeader>
            <CardContent className="p-8">
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Up to 5 team members</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Connect up to 3 platforms</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>1GB of indexed content</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Basic AI search</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Community support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Full access during beta</span>
                </li>
              </ul>
              <Button className="w-full group">
                Start Free Today
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise */}
          <Card className="relative overflow-hidden hover:shadow-elegant transition-all duration-300 border-primary/20 animate-fade-in-delayed" style={{ animationDelay: '0.2s' }}>
            <div className="absolute top-0 right-0 bg-gradient-primary text-white px-4 py-1 text-sm font-medium">
              Most Popular
            </div>
            <CardHeader className="text-center p-8 bg-gradient-to-b from-primary/5 to-transparent">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl mb-2">Enterprise Plan</CardTitle>
              <div className="text-4xl font-bold mb-2">Custom</div>
              <p className="text-muted-foreground">Tailored for your organization</p>
            </CardHeader>
            <CardContent className="p-8">
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Unlimited team members</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>All platform integrations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Unlimited content indexing</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Advanced AI features</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>SSO & advanced security</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Dedicated support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Custom deployment options</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full group border-2">
                Talk to Sales
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12 animate-fade-in-delayed" style={{ animationDelay: '0.4s' }}>
          <p className="text-muted-foreground mb-4">
            🚀 Beta users get lifetime access to premium features
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              30-day money-back guarantee
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Cancel anytime
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Data migration included
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};