import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Building2, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CommercialPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", facilityType: "", message: "" });
  const { toast } = useToast();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "Quote request submitted!", description: "Our commercial team will reach out within 1–2 business days." });
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-20">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <Building2 className="h-12 w-12 text-primary mx-auto mb-6" />
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Commercial Cold Plunge Solutions</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cold plunge systems designed for gyms, wellness studios, athletic training facilities, and recovery centers. Our commercial team works directly with facility owners to specify the right equipment, manage freight delivery, and coordinate installation support.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="frost-card p-8 h-full">
                <h3 className="text-lg font-semibold text-foreground mb-4">Why Choose FrostHaven Commercial?</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-2"><span className="text-primary font-bold">•</span> Volume pricing for multi-unit orders</li>
                  <li className="flex gap-2"><span className="text-primary font-bold">•</span> Dedicated account manager</li>
                  <li className="flex gap-2"><span className="text-primary font-bold">•</span> Custom installation support</li>
                  <li className="flex gap-2"><span className="text-primary font-bold">•</span> Extended commercial warranty</li>
                  <li className="flex gap-2"><span className="text-primary font-bold">•</span> Priority freight delivery</li>
                  <li className="flex gap-2"><span className="text-primary font-bold">•</span> Ongoing maintenance plans available</li>
                </ul>

                <div className="mt-8 pt-6 border-t border-border">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Facility Types We Serve</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Gyms", "CrossFit Boxes", "Spas", "Hotels", "Sports Teams", "Physical Therapy", "Wellness Studios", "Universities"].map((type) => (
                      <span key={type} className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full">{type}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Or email us directly at{" "}
                    <a href="mailto:commercial@frosthaventubs.com" className="text-primary hover:underline">commercial@frosthaventubs.com</a>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <div className="frost-card p-8">
                <h3 className="text-lg font-semibold text-foreground mb-6">Request a Commercial Quote</h3>

                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-foreground mb-2">Thank You!</h4>
                    <p className="text-sm text-muted-foreground mb-6">We've received your inquiry. Our commercial team will contact you within 1–2 business days.</p>
                    <Button variant="outline" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", company: "", phone: "", facilityType: "", message: "" }); }}>
                      Submit Another Inquiry
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Full Name *</label>
                      <input
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="John Smith"
                        className="w-full text-sm rounded-lg border border-border bg-background text-foreground px-3 py-2.5 focus:outline-none focus:border-primary/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Email Address *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="john@facility.com"
                        className="w-full text-sm rounded-lg border border-border bg-background text-foreground px-3 py-2.5 focus:outline-none focus:border-primary/50"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">Company</label>
                        <input
                          value={form.company}
                          onChange={(e) => handleChange("company", e.target.value)}
                          placeholder="Facility name"
                          className="w-full text-sm rounded-lg border border-border bg-background text-foreground px-3 py-2.5 focus:outline-none focus:border-primary/50"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          placeholder="(555) 000-0000"
                          className="w-full text-sm rounded-lg border border-border bg-background text-foreground px-3 py-2.5 focus:outline-none focus:border-primary/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Facility Type</label>
                      <select
                        value={form.facilityType}
                        onChange={(e) => handleChange("facilityType", e.target.value)}
                        className="w-full text-sm rounded-lg border border-border bg-background text-foreground px-3 py-2.5 focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
                      >
                        <option value="">Select facility type</option>
                        <option value="gym">Gym / Fitness Center</option>
                        <option value="spa">Spa / Wellness Studio</option>
                        <option value="sports">Sports Team / Athletic Facility</option>
                        <option value="hotel">Hotel / Resort</option>
                        <option value="pt">Physical Therapy / Rehab</option>
                        <option value="university">University / College</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Message *</label>
                      <textarea
                        value={form.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        placeholder="Tell us about your facility, number of units needed, timeline, and any specific requirements..."
                        rows={4}
                        className="w-full text-sm rounded-lg border border-border bg-background text-foreground px-3 py-2.5 focus:outline-none focus:border-primary/50 resize-none"
                        required
                      />
                    </div>
                    <Button type="submit" variant="default" className="w-full" size="lg">
                      <Send className="h-4 w-4 mr-2" />
                      Submit Quote Request
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CommercialPage;
