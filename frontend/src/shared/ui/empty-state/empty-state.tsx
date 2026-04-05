interface EmptyStateProps {
    title: string;
    description?: string;
}

export function EmptyState({
                               title,
                               description,
                           }: EmptyStateProps) {
    return (
        <div className="rounded-xl border border-dashed p-6 text-sm text-gray-500">
            <p className="font-medium text-gray-700">{title}</p>
            {description ? <p className="mt-1">{description}</p> : null}
        </div>
    );
}