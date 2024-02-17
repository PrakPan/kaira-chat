export default function ExperienceCardSkeleton() {
    return (
        <div className="flex flex-col items-center justify-between gap-2 w-[90%] lg:w-full md:w-full h-96 bg-gray-100 rounded-lg">
            <div className="w-full h-[50%] bg-gray-200 rounded-t-lg animate-pulse"></div>
            <div className="w-full h-[40%] flex flex-col gap-1 px-2">
                <div className="w-full h-[20%] bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-[70%] h-[15%] bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-full h-[45%] bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-[50%] h-[20%] bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="w-[90%] h-[10%] bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
        </div>
    );
}