import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

// FrostHaven knowledge base for the AI assistant
const FROSTHAVEN_CONTEXT = `You are a knowledgeable equipment sales assistant for FrostHaven Tubs, a cold plunge equipment retailer. You help customers choose the right cold plunge system, understand shipping, warranty, and product details.

KEY FACTS:
- FrostHaven sells cold plunge tubs, commercial systems, accessories (chillers, covers, filters, water treatment), and recovery equipment.
- Residential tubs range from $1,495 (portable) to $6,495 (premium indoor).
- Commercial systems range from $7,295 to $14,995.
- Chillers range from $1,295 to $3,495.
- Temperature ranges vary: residential 37–65°F, commercial 34–55°F.
- Free freight shipping on large equipment within the continental US.
- Typical delivery: 5–10 business days.
- Curbside delivery with lift-gate included; white-glove available for additional fee.
- All shipments fully insured.
- Manufacturer-backed warranty on all equipment.
- Products include: Arctic Pro 100, Glacier Elite 120, Polar Compact 60, Summit XL 200, Apex Dual-Zone, Titan Pro Commercial, Cedar Outdoor Barrel, Alpine Outdoor Pro, Everest XL Outdoor, portable tubs (Nomad 40, Trek 55, Rally 60).
- Accessories: insulated covers, hardtop covers, chiller units (0.5HP, 1HP, 2HP), carbon filters, sediment filters, drain valve kits, ozone sanitizers, UV purifiers, water test kits.
- Cold plunge benefits: muscle recovery, reduced inflammation, improved circulation, mental clarity.
- Most tubs need a standard 110V outlet; commercial units may need 220V.
- Indoor models require level flooring and adequate drainage nearby.
- Outdoor models are weather-resistant; cedar barrel rated for outdoor year-round use.

RULES:
- Only answer based on the information above. Do not make claims about authorized dealer status, brand partnerships, or certifications.
- If asked about partnerships, say: "FrostHaven selects recovery equipment partners carefully and provides support before and after purchase."
- If you cannot answer a question, suggest contacting FrostHaven directly via email at support@frosthaventubs.com or call (555) 123-4567.
- Be helpful, concise, and professional. Prioritize product selection, delivery, installation, warranty, and commercial purchasing questions.
- Keep responses under 3 sentences when possible.`;

interface Message {
  from: "bot" | "user";
  text: string;
}

export const LiveChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "👋 Hi! I'm the FrostHaven assistant. Ask me about cold plunge systems, shipping, warranty, or anything else — I'm here 24/7." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const generateResponse = (userMessage: string): string => {
    const q = userMessage.toLowerCase();

    // Temperature questions
    if (q.includes("how cold") || q.includes("temperature") || q.includes("temp")) {
      return "Our residential cold plunges reach 37–65°F depending on the model. Commercial systems can go as low as 34°F. The Titan Pro reaches 34°F, while the Polar Compact 60 goes down to 42°F.";
    }
    // Outdoor questions
    if (q.includes("outside") || q.includes("outdoor")) {
      return "Yes! We have outdoor-rated models like the Cedar Outdoor Barrel ($3,795), Alpine Outdoor Pro ($5,495), and Everest XL ($7,995). All are weather-resistant and designed for year-round outdoor use.";
    }
    // Drainage questions
    if (q.includes("drain") || q.includes("drainage") || q.includes("plumbing")) {
      return "Most of our tubs include a quick-drain valve for easy water changes. Indoor models should be placed near a floor drain or have a drainage plan. No permanent plumbing is required for standard residential units.";
    }
    // Shipping questions
    if (q.includes("shipping") || q.includes("delivery") || q.includes("ship") || q.includes("how long")) {
      return "We offer free freight shipping within the continental US on all large equipment. Typical delivery is 5–10 business days with curbside lift-gate service included. White-glove delivery is available for an additional fee.";
    }
    // Warranty questions
    if (q.includes("warranty") || q.includes("guarantee")) {
      return "All FrostHaven equipment comes with manufacturer-backed warranty coverage. For specific warranty terms on a product you're interested in, please visit our Warranty page or contact our support team.";
    }
    // Price questions
    if (q.includes("price") || q.includes("cost") || q.includes("how much") || q.includes("expensive") || q.includes("cheap") || q.includes("affordable") || q.includes("budget")) {
      return "Our cold plunges start at $1,495 for portable models, $2,995 for residential units, and $7,295 for commercial systems. Accessories like covers start at $199 and chillers from $1,295. What's your use case — I can help narrow it down!";
    }
    // Commercial questions
    if (q.includes("commercial") || q.includes("gym") || q.includes("business") || q.includes("facility") || q.includes("spa")) {
      return "Our commercial line includes the Summit XL 200 ($9,995), Apex Dual-Zone ($12,495), and Titan Pro ($14,995). These are built for high-traffic environments with features like auto-filtration, UV sanitation, and rapid temperature recovery.";
    }
    // Installation / electrical
    if (q.includes("install") || q.includes("electrical") || q.includes("plug") || q.includes("outlet") || q.includes("volt") || q.includes("power")) {
      return "Most residential cold plunges run on a standard 110V outlet. Commercial units may require a 220V dedicated circuit. Indoor models need level flooring and proximity to drainage. No special plumbing installation is needed.";
    }
    // Portable questions
    if (q.includes("portable") || q.includes("travel") || q.includes("foldable") || q.includes("collapsible")) {
      return "We carry three portable options: the Nomad 40 ($1,495, 28 lbs), Trek 55 ($1,895, 35 lbs), and Rally 60 ($2,295, 42 lbs). All are collapsible, ice-based, and great for travel or field-side recovery.";
    }
    // Chiller questions
    if (q.includes("chiller") || q.includes("cooling unit") || q.includes("compressor")) {
      return "We offer three chiller sizes: 0.5 HP ($1,295) for tubs up to 80 gal, 1.0 HP ($2,195) for up to 150 gal, and 2.0 HP ($3,495) for commercial systems up to 300 gal. All include digital thermostat control.";
    }
    // Benefits / health
    if (q.includes("benefit") || q.includes("health") || q.includes("why") || q.includes("recovery") || q.includes("inflammation")) {
      return "Cold plunge therapy supports muscle recovery, reduces inflammation, improves circulation, and enhances mental clarity. Many athletes and wellness enthusiasts use cold therapy as part of their daily recovery routine.";
    }
    // Contact / support
    if (q.includes("contact") || q.includes("support") || q.includes("help") || q.includes("email") || q.includes("phone") || q.includes("call")) {
      return "You can reach our team at support@frosthaventubs.com or call (555) 123-4567. We're happy to help with product questions, delivery coordination, and commercial inquiries.";
    }
    // Partnership / dealer
    if (q.includes("partner") || q.includes("dealer") || q.includes("authorized") || q.includes("certif")) {
      return "FrostHaven selects recovery equipment partners carefully and provides support before and after purchase. For partnership or wholesale inquiries, please contact our team directly.";
    }
    // Water treatment / maintenance
    if (q.includes("water") || q.includes("clean") || q.includes("maintenance") || q.includes("filter") || q.includes("sanitiz")) {
      return "We offer ozone sanitizers ($395), inline UV purifiers ($495), carbon filters ($59/3-pack), and water test kits ($29). Regular filter changes and water testing keep your plunge clean and safe.";
    }

    // General / fallback
    return "Great question! I'd want to make sure I give you accurate information. For detailed product specifications or specific inquiries, you can reach our team at support@frosthaventubs.com or call (555) 123-4567. Is there anything else about our cold plunge systems I can help with?";
  };

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setInput("");
    setIsTyping(true);

    // Simulate slight delay for natural feel
    setTimeout(() => {
      const response = generateResponse(userMsg);
      setMessages((prev) => [...prev, { from: "bot", text: response }]);
      setIsTyping(false);
    }, 600 + Math.random() * 800);
  };

  return (
    <>
      {/* Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[55] w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-glow flex items-center justify-center hover:scale-105 transition-transform"
            aria-label="Open AI assistant"
          >
            <Bot className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-[55] w-[360px] max-w-[calc(100vw-3rem)] rounded-2xl overflow-hidden shadow-medium border border-border bg-background flex flex-col"
            style={{ height: "min(500px, calc(100dvh - 6rem))" }}
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <div>
                  <p className="text-sm font-semibold">FrostHaven Assistant</p>
                  <p className="text-[10px] opacity-80">AI-powered · Available 24/7</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:opacity-70 transition-opacity">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex items-start gap-2 max-w-[85%] ${msg.from === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                      msg.from === "user" ? "bg-primary/10" : "bg-accent/10"
                    }`}>
                      {msg.from === "user" ? <User className="h-3.5 w-3.5 text-primary" /> : <Bot className="h-3.5 w-3.5 text-accent" />}
                    </div>
                    <div
                      className={`rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.from === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-muted text-foreground rounded-bl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2">
                    <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 bg-accent/10">
                      <Bot className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <div className="bg-muted rounded-xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border px-3 py-2.5 shrink-0 flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about cold plunges..."
                className="flex-1 text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <Button size="icon" variant="ghost" onClick={handleSend} disabled={!input.trim() || isTyping} className="h-8 w-8 shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
