import cupid from "@/assets/cupid-cutout.png";
import { cn } from "@/lib/utils";

export function CupidPortrait({ className }: { className?: string }) {
  return <img src={cupid} alt="Cupid, your smiling TLC date-planning sidekick" className={cn("cupid-portrait", className)} draggable={false} />;
}