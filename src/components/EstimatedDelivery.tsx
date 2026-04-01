import { Truck } from "lucide-react";

export const EstimatedDelivery = () => {
  const today = new Date();
  const minDays = 6;
  const maxDays = 13;

  const addBusinessDays = (date: Date, days: number) => {
    const result = new Date(date);
    let added = 0;
    while (added < days) {
      result.setDate(result.getDate() + 1);
      const day = result.getDay();
      if (day !== 0 && day !== 6) added++;
    }
    return result;
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const minDate = addBusinessDays(today, minDays);
  const maxDate = addBusinessDays(today, maxDays);

  return (
    <div className="flex items-center gap-2 py-2.5 px-3.5 rounded-lg bg-muted/60 border border-border/50">
      <Truck className="h-4 w-4 text-primary shrink-0" />
      <p className="text-sm text-foreground">
        <span className="font-medium">Estimated delivery:</span>{" "}
        <span className="text-muted-foreground">
          {formatDate(minDate)} – {formatDate(maxDate)}
        </span>
      </p>
    </div>
  );
};
