interface PageLoaderProps {
    text?: string;
}

export function PageLoader({
                               text = 'Loading...',
                           }: PageLoaderProps) {
    return (
        <div className="rounded-xl border bg-white p-6 text-sm text-gray-500">
            {text}
        </div>
    );
}