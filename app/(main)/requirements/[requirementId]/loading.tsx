export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <>
            <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-pulse flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                    <div className="w-16 h-4 bg-gray-300 rounded-full"></div>
                    <div className="w-16 h-4 bg-gray-300 rounded-full"></div>
                    <div className="w-16 h-4 bg-gray-300 rounded-full"></div>
                    <div className="w-16 h-4 bg-gray-300 rounded-full"></div>
                </div>
            </div>
        </>
    )
}
