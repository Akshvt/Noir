export function SkeletonCard({ landscape = false }) {
    return (
        <div className={`flex-none ${landscape ? 'w-72 md:w-96' : 'w-48 md:w-64'}`}>
            <div className={`skeleton ${landscape ? 'aspect-video' : 'aspect-[2/3]'} w-full rounded-xl`}></div>
            <div className="mt-3 space-y-2">
                <div className="skeleton h-4 w-3/4 rounded"></div>
                <div className="skeleton h-3 w-1/2 rounded"></div>
            </div>
        </div>
    );
}

export function SkeletonRow({ count = 6, landscape = false }) {
    return (
        <div className="flex gap-5 overflow-hidden">
            {[...Array(count)].map((_, i) => (
                <SkeletonCard key={i} landscape={landscape} />
            ))}
        </div>
    );
}

export function SkeletonDetails() {
    return (
        <div className="animate-pulse space-y-8 p-4 md:p-20">
            <div className="skeleton w-full aspect-[21/9] min-h-[300px] rounded-xl"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                    <div className="skeleton aspect-[2/3] w-full rounded-xl"></div>
                </div>
                <div className="lg:col-span-5 space-y-4 pt-8">
                    <div className="skeleton h-8 w-3/4 rounded"></div>
                    <div className="skeleton h-4 w-full rounded"></div>
                    <div className="skeleton h-4 w-full rounded"></div>
                    <div className="skeleton h-4 w-2/3 rounded"></div>
                </div>
                <div className="lg:col-span-3 space-y-3 pt-8">
                    <div className="skeleton h-12 w-full rounded-lg"></div>
                    <div className="skeleton h-12 w-full rounded-lg"></div>
                </div>
            </div>
        </div>
    );
}

export function SkeletonGrid({ count = 10 }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(count)].map((_, i) => (
                <div key={i}>
                    <div className="skeleton aspect-[2/3] w-full rounded-xl"></div>
                    <div className="mt-3 space-y-2">
                        <div className="skeleton h-4 w-3/4 rounded"></div>
                        <div className="skeleton h-3 w-1/2 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
