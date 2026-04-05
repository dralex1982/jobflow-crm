interface SectionCardProps {
    children: React.ReactNode;
    className?: string;
}

export function SectionCard({
                                children,
                                className = '',
                            }: SectionCardProps) {
    return (
        <section className={`rounded-xl border bg-white p-4 ${className}`}>
            {children}
        </section>
    );
}