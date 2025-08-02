import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10 animate-gradient-x"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-float-delayed"></div>
      
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Headlines */}
        <div className="space-y-8 animate-fade-in">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="block text-foreground mb-2">Supercharge Your Team's</span>
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Memory with AI
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Cognitex connects your tools and gives your team instant answers from all your knowledge.
            <span className="block mt-2 text-lg opacity-80">
              Stop searching. Start finding.
            </span>
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12 animate-fade-in-delayed">
          <Button size="lg" className="group px-8 py-4 text-lg font-semibold shadow-elegant hover:shadow-glow transition-all duration-300">
            Try It Free
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold border-2 hover:bg-primary/5">
            Book a Demo
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 animate-fade-in-delayed">
          <p className="text-sm text-muted-foreground mb-6">Trusted by innovative teams worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-lg font-semibold">TechNova</div>
            <div className="text-lg font-semibold">Pioneer AI</div>
            <div className="text-lg font-semibold">EduGrid</div>
            <div className="text-lg font-semibold">DataFlow Inc</div>
            <div className="text-lg font-semibold">CloudSync</div>
          </div>
        </div>
      </div>

      {/* Chat Bubble */}
      <div className="fixed bottom-6 right-6 z-50 animate-bounce-gentle">
        <Button className="rounded-full p-4 shadow-elegant hover:shadow-glow">
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </section>
  );
};