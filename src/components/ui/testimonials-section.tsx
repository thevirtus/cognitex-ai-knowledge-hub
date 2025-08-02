import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Cognitex has transformed how our product team operates. We went from spending hours searching for documentation to finding answers instantly. It's like having a super-powered memory for our entire company.",
      author: "Sarah Chen",
      role: "VP of Product",
      company: "TechNova",
      rating: 5,
      avatar: "SC"
    },
    {
      quote: "The AI search is incredibly intuitive. I can ask questions in plain English and get exactly what I need from across Notion, Slack, and our Google Drive. Cognitex saves us at least 10 hours per week.",
      author: "Marcus Rodriguez",
      role: "Engineering Lead",
      company: "Pioneer AI",
      rating: 5,
      avatar: "MR"
    },
    {
      quote: "Finally, a knowledge management solution that actually works. The setup was painless, and now our distributed team can access institutional knowledge instantly. Game-changer for remote collaboration.",
      author: "Emily Watson",
      role: "Operations Director",
      company: "EduGrid",
      rating: 5,
      avatar: "EW"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Loved by Teams Worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how Cognitex is helping teams unlock their collective intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="relative overflow-hidden hover:shadow-elegant transition-all duration-300 hover:scale-105 animate-fade-in-delayed"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-8">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className="h-12 w-12 text-primary" />
                </div>
                
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                
                {/* Quote */}
                <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                
                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 animate-fade-in-delayed">
          <p className="text-muted-foreground mb-4">Join thousands of teams already using Cognitex</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              10,000+ documents indexed daily
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              500+ teams worldwide
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              99.9% uptime SLA
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};