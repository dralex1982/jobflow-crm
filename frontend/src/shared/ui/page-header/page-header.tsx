interface PageHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export function PageHeader({
                               title,
                               description,
                               action,
                           }: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                {description ? (
                    <p className="text-sm text-gray-500">{description}</p>
                ) : null}
            </div>

            {action ? <div>{action}</div> : null}
        </div>
    );
}