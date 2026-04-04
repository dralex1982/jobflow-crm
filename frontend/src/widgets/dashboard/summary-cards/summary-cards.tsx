interface SummaryCardsProps {
    summary: {
        total: number;
        applied: number;
        interview: number;
        offers: number;
    };
}

export const SummaryCards = ({summary}: SummaryCardsProps) => {
    const items = [
        {label: 'Total vacancies', value: summary.total},
        {label: 'Applied', value: summary.applied},
        {label: 'Interviews', value: summary.interview},
        {label: 'Offers', value: summary.offers},
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => (
                <div key={item.label} className="rounded-xl border p-4">
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                </div>
            ))}
        </div>
    );
};