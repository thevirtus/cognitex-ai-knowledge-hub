import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Truck, ShieldCheck, RotateCcw, Package } from "lucide-react";

interface ProductTabsProps {
  description: string;
  handle: string;
}

export const ProductTabs = ({ description, handle }: ProductTabsProps) => {
  return (
    <Tabs defaultValue="description" className="w-full mt-10">
      <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0 gap-0">
        {["Description", "Specifications", "Warranty & Returns", "Shipping"].map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-5 py-3 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground transition-colors"
          >
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="description" className="pt-6">
        <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
          {description ? (
            description.split('\n').map((p, i) => <p key={i} className="mb-3">{p}</p>)
          ) : (
            <p>Product description will be available soon.</p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="specifications" className="pt-6">
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "Construction", value: "Premium insulated shell" },
            { label: "Temperature Range", value: "39°F – 104°F" },
            { label: "Capacity", value: "1 person" },
            { label: "Power", value: "Standard 110V outlet" },
            { label: "Filtration", value: "Multi-stage filtration system" },
            { label: "Warranty", value: "See Warranty tab" },
          ].map((spec) => (
            <div key={spec.label} className="flex justify-between py-3 border-b border-border/50">
              <span className="text-sm font-medium text-foreground">{spec.label}</span>
              <span className="text-sm text-muted-foreground">{spec.value}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Specifications may vary by model. Contact us for detailed product specifications.
        </p>
      </TabsContent>

      <TabsContent value="warranty-returns" className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Manufacturer Warranty</h4>
              <p className="text-sm text-muted-foreground">All cold plunge systems include the manufacturer's warranty covering defects in materials and workmanship.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <RotateCcw className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">30-Day Satisfaction Promise</h4>
              <p className="text-sm text-muted-foreground">Not satisfied? Contact us within 30 days of delivery. Return shipping may apply. See our full refund policy for details.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Damage Protection</h4>
              <p className="text-sm text-muted-foreground">All shipments are insured against damage during transit. Report any issues within 48 hours of delivery.</p>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="shipping" className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Truck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Free Freight Shipping</h4>
              <p className="text-sm text-muted-foreground">All orders ship free via freight delivery within the continental United States. White-glove delivery available for an additional charge.</p>
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-foreground font-medium mb-1">Estimated Delivery</p>
            <p className="text-sm text-muted-foreground">6–13 business days from order confirmation. Delivery times may vary based on your location and product availability.</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Alaska, Hawaii, and international orders may incur additional shipping charges. Contact us for a quote.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
};
