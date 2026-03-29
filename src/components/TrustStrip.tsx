import { Truck, ShieldCheck, BadgeCheck, HeadphonesIcon } from "lucide-react";

const items = [
  { icon: Truck, label: "Free Freight Shipping on Large Equipment" },
  { icon: ShieldCheck, label: "Secure Checkout Protection" },
  { icon: BadgeCheck, label: "Authorized Equipment Supplier" },
  { icon: HeadphonesIcon, label: "Dedicated Support Team" },
];

export const TrustStrip = () => (
  <section className="bg-secondary/60 border-y border-border">
    <div className="container mx-auto py-5 px-4">
      <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
            <item.icon className="h-4 w-4 text-primary shrink-0" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);
