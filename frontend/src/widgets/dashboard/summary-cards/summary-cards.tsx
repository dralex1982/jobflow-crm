type Props = {
    total: number;
    applied: number;
    interview: number;
    offers: number;
};

export const SummaryCards = ({
                                 total,
                                 applied,
                                 interview,
                                 offers,
                             }: Props) => {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border p-4">
                <div className="text-sm text-gray-500">Total vacancies</div>
                <div className="mt-2 text-2xl font-semibold">{total}</div>
            </div>

            <div className="rounded-xl border p-4">
                <div className="text-sm text-gray-500">Applied</div>
                <div className="mt-2 text-2xl font-semibold">{applied}</div>
            </div>

            <div className="rounded-xl border p-4">
                <div className="text-sm text-gray-500">Interview</div>
                <div className="mt-2 text-2xl font-semibold">{interview}</div>
            </div>

            <div className="rounded-xl border p-4">
                <div className="text-sm text-gray-500">Offers</div>
                <div className="mt-2 text-2xl font-semibold">{offers}</div>
            </div>
        </div>
    );
};