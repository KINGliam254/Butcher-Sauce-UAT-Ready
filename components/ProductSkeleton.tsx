export default function ProductSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="relative aspect-[4/5] bg-neutral-soft rounded-sm mb-6 shadow-sm" />
            <div className="space-y-2 px-1">
                <div className="h-2 w-1/4 bg-neutral-soft rounded" />
                <div className="h-4 w-3/4 bg-neutral-soft rounded" />
                <div className="h-3 w-1/3 bg-neutral-soft rounded" />
            </div>
        </div>
    );
}
