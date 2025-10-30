import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const PlacesLoadingSkeleton = () => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="status" aria-label="Loading places">
      {Array.from({ length: 8 }).map((_, idx) => (
        <Card key={idx} className="overflow-hidden border-2 border-border/30 animate-fade-in">
          <Skeleton className="h-40 w-full rounded-none" />
          <CardHeader className="p-4 pb-2 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-12" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
          </CardContent>
        </Card>
      ))}
      <span className="sr-only">Loading places...</span>
    </div>
  );
};
