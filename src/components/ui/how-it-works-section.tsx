import { Card, CardContent } from "@/components/ui/card";
import { Link, Bot, Search } from "lucide-react";

export const HowItWorksSection = () => {
  const steps = [
    {
      icon: Link,
      title: "Connect Your Tools",
      description: "Integrate with Notion, Google Drive, Slack, GitHub, and 50+ other platforms in minutes.",
      step: "01"
    },
    {
      icon: Bot,
      title: "Let Cognitex Organize",
      description: "Our AI automatically indexes, categorizes, and understands your team's knowledge.",
      step: "02"
    },
    {
      icon: Search,
      title: "Get Instant Answers",
      description: "Search naturally or chat with your knowledge base to find exactly what you need.",
      step: "03"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your team's knowledge management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative animate-fade-in-delayed"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <Card className="relative h-full hover:shadow-elegant transition-all duration-300 hover:scale-105">
                <CardContent className="p-8 text-center">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  
                  <div className="mb-6 mt-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-12 w-12 lg:w-24 h-0.5 bg-gradient-to-r from-primary/50 to-primary/20 transform -translate-y-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};