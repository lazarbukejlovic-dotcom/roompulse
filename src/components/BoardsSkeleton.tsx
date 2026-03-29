import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export function BoardsSkeleton() {
  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-7 w-24 mb-2" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="glass-card overflow-hidden">
            <Skeleton className="h-1 w-full" />
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
