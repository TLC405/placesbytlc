import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const EmptyState = ({ icon: Icon, title, description }: EmptyStateProps) => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center p-16 text-center animate-fade-in">
      <div className="relative mb-6">
        <div className="absolute inset-0 animate-ping opacity-20">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent" />
        </div>
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm flex items-center justify-center border-2 border-primary/30 shadow-xl">
          <Icon className="w-12 h-12 text-primary animate-pulse" />
        </div>
      </div>
      <h3 className="text-2xl font-black gradient-text mb-3 drop-shadow-lg">{title}</h3>
      <p className="text-base text-muted-foreground max-w-md font-medium leading-relaxed">{description}</p>
    </div>
  );
};
