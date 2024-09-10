import {Skeleton} from "@/components/ui/skeleton";

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <div>
            <div className="flex justify-between items-center mb-4 mt-4">
                <div className="flex items-center gap-2 w-full">
                    <div className="relative w-full">
                        <Skeleton className="pl-10 py-1 border rounded w-full h-10"/>
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
              <Skeleton className="w-4 h-4 bg-gray-300 rounded-full"/>
            </span>
                    </div>
                </div>
                <Skeleton className="flex items-center px-3 h-10 bg-gray-300 rounded"/>
            </div>
            <Skeleton className="max-h-[50vh]">
                <div className="flex flex-col gap-2">
                    <Skeleton className="w-full h-6 bg-gray-300 mb-2"/>
                    <Skeleton className="w-full h-6 bg-gray-300 mb-2"/>
                    <Skeleton className="w-full h-6 bg-gray-300 mb-2"/>
                </div>
            </Skeleton>
        </div>
    )
}
