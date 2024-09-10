import {Skeleton} from "@/components/ui/skeleton";

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <>
            <div className="space-y-6 p-4">
                <div className="flex justify-between items-center">
                    <Skeleton className="w-48 h-8 bg-gray-300"/>
                    <Skeleton className="w-24 h-8 bg-gray-300"/>
                </div>

                <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-12 sm:col-span-10">
                        <Skeleton className="w-full h-10 bg-gray-300 mb-2"/>
                        <Skeleton className="w-full h-8 bg-gray-300"/>
                    </div>
                    <div className="col-span-12 sm:col-span-2">
                        <Skeleton className="w-full h-10 bg-gray-300 mb-2"/>
                    </div>
                </div>

                <div className="text-end">
                    <Skeleton className="w-28 h-8 bg-gray-300"/>
                </div>

                <div>
                    <Skeleton className="w-full h-8 bg-gray-300 mb-4"/>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="flex items-center space-x-4">
                                <Skeleton className="w-12 h-8 bg-gray-300"/>
                                <Skeleton className="flex-1 h-8 bg-gray-300"/>
                                <Skeleton className="w-24 h-8 bg-gray-300"/>
                                <Skeleton className="w-8 h-8 bg-gray-300"/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
