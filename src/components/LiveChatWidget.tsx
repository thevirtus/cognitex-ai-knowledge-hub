import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Message {
  from: "bot" | "user";
  text: string;
}

const generateResponse = (userMessage: string): string => {
  const q = userMessage.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|howdy|sup|yo|what'?s up|good morning|good afternoon|good evening)\b/.test(q)) {
    return "Hey there! 👋 Welcome to FrostHaven. I can help you find the right cold plunge, answer questions about shipping, warranty, pricing, or anything else. What can I help you with?";
  }

  // Temperature questions
  if (q.includes("how cold") || q.includes("temperature") || q.includes("temp") || q.includes("degree") || q.includes("fahrenheit")) {
    return "Our residential cold plunges reach 37–65°F depending on the model. Commercial systems can go as low as 34°F. The Titan Pro reaches 34°F, while the Polar Compact 60 goes down to 42°F. The colder you go, the more intense the recovery effect.";
  }

  // Outdoor questions
  if (q.includes("outside") || q.includes("outdoor") || q.includes("backyard") || q.includes("patio") || q.includes("weather") || q.includes("rain") || q.includes("snow")) {
    return "Yes! We have outdoor-rated models like the Cedar Outdoor Barrel ($3,795), Alpine Outdoor Pro ($5,495), and Everest XL ($7,995). All are weather-resistant and designed for year-round outdoor use, even in extreme conditions from -20°F to 110°F.";
  }

  // Drainage / plumbing
  if (q.includes("drain") || q.includes("drainage") || q.includes("plumbing") || q.includes("water change")) {
    return "Most of our tubs include a quick-drain valve for easy water changes. Indoor models should be placed near a floor drain or have a drainage plan. No permanent plumbing is required for standard residential units.";
  }

  // Shipping / delivery
  if (q.includes("shipping") || q.includes("delivery") || q.includes("ship") || q.includes("how long") || q.includes("when will") || q.includes("arrive") || q.includes("tracking") || q.includes("freight")) {
    return "We offer free freight shipping within the continental US on all large equipment. Typical delivery is 5–10 business days with curbside lift-gate service included. White-glove delivery is available for an additional fee. You'll receive tracking info via email once your order ships.";
  }

  // Warranty
  if (q.includes("warranty") || q.includes("guarantee") || q.includes("coverage") || q.includes("protection plan")) {
    return "All FrostHaven equipment comes with manufacturer-backed warranty coverage. This covers defects in materials and workmanship. For specific warranty terms on a product you're interested in, visit our Warranty page or contact support.";
  }

  // Pricing / cost
  if (q.includes("price") || q.includes("cost") || q.includes("how much") || q.includes("expensive") || q.includes("cheap") || q.includes("affordable") || q.includes("budget") || q.includes("money") || q.includes("pay") || q.includes("financing")) {
    return "Our cold plunges start at $1,495 for portable models, $2,995 for residential units, and $7,295 for commercial systems. Accessories like covers start at $199 and chillers from $1,295. What's your use case — I can help narrow down the best option for your budget!";
  }

  // Commercial / business
  if (q.includes("commercial") || q.includes("gym") || q.includes("business") || q.includes("facility") || q.includes("spa") || q.includes("studio") || q.includes("hotel") || q.includes("bulk") || q.includes("wholesale") || q.includes("volume")) {
    return "Our commercial line includes the Summit XL 200 ($9,995), Apex Dual-Zone ($12,495), and Titan Pro ($14,995). These are built for high-traffic environments with features like auto-filtration, UV sanitation, and rapid temperature recovery. Visit our Commercial page to request a quote!";
  }

  // Installation / electrical
  if (q.includes("install") || q.includes("electrical") || q.includes("plug") || q.includes("outlet") || q.includes("volt") || q.includes("power") || q.includes("setup") || q.includes("set up")) {
    return "Most residential cold plunges run on a standard 110V outlet — just plug and go. Commercial units may require a 220V dedicated circuit. Indoor models need level flooring and proximity to drainage. No special plumbing installation is needed for most models.";
  }

  // Portable
  if (q.includes("portable") || q.includes("travel") || q.includes("foldable") || q.includes("collapsible") || q.includes("lightweight") || q.includes("carry")) {
    return "We carry three portable options: the Nomad 40 ($1,495, 28 lbs), Trek 55 ($1,895, 35 lbs), and Rally 60 ($2,295, 42 lbs). All are collapsible, use ice for cooling, and are great for travel, events, or field-side recovery.";
  }

  // Chiller
  if (q.includes("chiller") || q.includes("cooling unit") || q.includes("compressor") || q.includes("cooling system")) {
    return "We offer three chiller sizes: 0.5 HP ($1,295) for tubs up to 80 gal, 1.0 HP ($2,195) for up to 150 gal, and 2.0 HP ($3,495) for commercial systems up to 300 gal. All include digital thermostat control for precise temperature management.";
  }

  // Benefits / health / why
  if (q.includes("benefit") || q.includes("health") || q.includes("recovery") || q.includes("inflammation") || q.includes("muscle") || q.includes("sore") || q.includes("athlete") || q.includes("therapy") || q.includes("wellness") || q.includes("ice bath")) {
    return "Cold plunge therapy supports muscle recovery, reduces inflammation, improves circulation, and enhances mental clarity. Many athletes and wellness enthusiasts use cold therapy as part of their daily routine. Sessions of 2–5 minutes at 40–50°F are a great starting point.";
  }

  // Size / capacity / dimensions
  if (q.includes("size") || q.includes("dimension") || q.includes("capacity") || q.includes("gallon") || q.includes("fit") || q.includes("space") || q.includes("room") || q.includes("big") || q.includes("small")) {
    return "Our tubs range from compact 40-gallon portable models (44\" × 24\") to commercial 250-gallon systems (90\" × 44\"). For home use, the Polar Compact 60 (48\" × 28\") is popular for smaller spaces, while the Arctic Pro 100 (60\" × 30\") is our best-selling full-size model.";
  }

  // Maintenance / cleaning
  if (q.includes("water") || q.includes("clean") || q.includes("maintenance") || q.includes("filter") || q.includes("sanitiz") || q.includes("care") || q.includes("upkeep")) {
    return "We offer ozone sanitizers ($395), inline UV purifiers ($495), carbon filters ($59/3-pack), and water test kits ($29). We recommend changing water every 2–4 weeks and testing regularly. Many of our systems include built-in filtration.";
  }

  // Contact / support
  if (q.includes("contact") || q.includes("support") || q.includes("email") || q.includes("phone") || q.includes("call") || q.includes("talk to") || q.includes("speak") || q.includes("representative") || q.includes("human")) {
    return "You can reach our team at support@frosthaventubs.com or call (555) 123-4567. We're happy to help with product questions, delivery coordination, and commercial inquiries. For commercial quotes, visit our Commercial page.";
  }

  // Partnership / dealer
  if (q.includes("partner") || q.includes("dealer") || q.includes("authorized") || q.includes("certif") || q.includes("resell")) {
    return "FrostHaven selects recovery equipment partners carefully and provides support before and after purchase. For partnership or wholesale inquiries, please contact our team directly at commercial@frosthaventubs.com.";
  }

  // Covers
  if (q.includes("cover") || q.includes("lid") || q.includes("protect")) {
    return "We offer three cover options: Universal Fit Insulated Cover ($249), Hardtop Cover for 60 gal tubs ($349), and XL Roll-Up Thermal Cover ($199). Covers help maintain temperature, keep debris out, and improve energy efficiency.";
  }

  // Recommendations / which / best / suggest
  if (q.includes("recommend") || q.includes("which") || q.includes("best") || q.includes("suggest") || q.includes("should i") || q.includes("good for") || q.includes("right for") || q.includes("compare")) {
    return "It depends on your needs! For home use, the Arctic Pro 100 ($4,995) is our best seller with great temp range and build quality. On a budget? The Polar Compact 60 ($2,995) is excellent. For athletes, check out the Glacier Elite 120 ($6,495). Want to chat about your specific situation?";
  }

  // Return / refund
  if (q.includes("return") || q.includes("refund") || q.includes("cancel") || q.includes("money back")) {
    return "For return and refund information, please visit our Refund Policy page. You can also contact our support team at support@frosthaventubs.com or call (555) 123-4567 for specific questions about your order.";
  }

  // Order / buy / purchase
  if (q.includes("order") || q.includes("buy") || q.includes("purchase") || q.includes("checkout") || q.includes("add to cart")) {
    return "You can browse and order directly from our Products page! Just find the product you want, click 'Add to Cart,' and proceed to checkout. Need help choosing? Tell me what you're looking for and I'll point you in the right direction.";
  }

  // Indoor
  if (q.includes("indoor") || q.includes("inside") || q.includes("home") || q.includes("house") || q.includes("apartment") || q.includes("basement") || q.includes("garage")) {
    return "Our indoor models are designed for controlled environments. The Studio 75 ($3,295) is perfect for smaller spaces, the Arctic Pro 100 ($4,995) is our top seller, and the Glacier Elite 120 ($6,495) is our premium option. All run quietly and need just a standard outlet.";
  }

  // Material / build quality
  if (q.includes("material") || q.includes("stainless") || q.includes("acrylic") || q.includes("quality") || q.includes("durable") || q.includes("built") || q.includes("construction")) {
    return "Our tubs are built with premium materials — stainless steel, acrylic, reinforced ABS, and medical-grade composites depending on the model. Commercial units use industrial-grade stainless steel for maximum durability. All models are designed for years of daily use.";
  }

  // Weight
  if (q.includes("weight") || q.includes("heavy") || q.includes("pound") || q.includes("lbs")) {
    return "Weights vary by model: portable tubs are 28–42 lbs, residential units range from 120–220 lbs, and commercial systems can weigh 290–520 lbs. Keep in mind you'll also need to account for water weight once filled.";
  }

  // How to use / beginner
  if (q.includes("beginner") || q.includes("first time") || q.includes("new to") || q.includes("how to use") || q.includes("how do i") || q.includes("start") || q.includes("get started") || q.includes("tip")) {
    return "Welcome to cold plunging! Start with water around 55–60°F for 1–2 minutes. Gradually work down to 40–50°F over a few weeks. Focus on slow, deep breathing. Check out our Cold Plunge Guide for detailed protocols and tips!";
  }

  // Thanks / appreciation
  if (/^(thanks|thank you|thx|ty|appreciate|awesome|great|perfect|cool|nice|ok|okay)\b/.test(q)) {
    return "You're welcome! Let me know if you have any other questions about our cold plunge systems. I'm here to help! 🧊";
  }

  // General catch-all with helpful prompt
  return "I'd love to help with that! I can answer questions about our cold plunge products, pricing, shipping, warranty, installation, maintenance, and more. Could you tell me a bit more about what you're looking for? For example:\n\n• \"What's the best cold plunge for home use?\"\n• \"How cold do your tubs get?\"\n• \"Tell me about shipping\"\n• \"What accessories do you offer?\"";
};

export const LiveChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "👋 Hi! I'm the FrostHaven assistant. Ask me about cold plunge systems, pricing, shipping, or anything else — I'm here 24/7." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(userMsg);
      setMessages((prev) => [...prev, { from: "bot", text: response }]);
      setIsTyping(false);
    }, 500 + Math.random() * 700);
  };

  return (
    <>
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

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex items-start gap-2 max-w-[85%] ${msg.from === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${msg.from === "user" ? "bg-primary/10" : "bg-accent/10"}`}>
                      {msg.from === "user" ? <User className="h-3.5 w-3.5 text-primary" /> : <Bot className="h-3.5 w-3.5 text-accent" />}
                    </div>
                    <div className={`rounded-xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${msg.from === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"}`}>
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
